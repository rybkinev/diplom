from django_filters.rest_framework.backends import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.filters import OrderingFilter
from rest_framework.permissions import DjangoModelPermissionsOrAnonReadOnly, DjangoModelPermissions

from core.pagination import CustomPageNumberPagination
from maintenance.filters import MaintenanceFilter
import maintenance.models as models
import maintenance.serializers as serializers


class MaintenanceViewSet(viewsets.ModelViewSet):

    queryset = models.Maintenance.objects.all()
    serializer_class = serializers.MaintenanceSerializer
    permission_classes = [DjangoModelPermissions]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    # filterset_class = PrivateVehicleFilter
    ordering = '-date_maintenance'
    ordering_fields = [
        'vehicle',
        'type_maintenance',
        'date_maintenance',
        'operating_time',
        'work_order',
        'date_order',
        'organization',
        'service_company',
    ]
    pagination_class = CustomPageNumberPagination

    def get_queryset(self):
        queryset = super().get_queryset()
        user = getattr(self.request, 'user', None)
        if user and not user.is_authenticated or not user:
            raise PermissionDenied("У вас нет прав доступа к этим данным.")

        if user.is_superuser or user.groups.filter(name='Manager').exists():
            return queryset

        if self.request.user.groups.filter(name='Client').exists():
            return queryset.filter(vehicle__client=user)
        elif self.request.user.groups.filter(name='Service').exists():
            service = getattr(user, 'servicecompany', None)
            if not service:
                raise PermissionDenied("У вас нет прав доступа к этим данным.")
            return queryset.filter(vehicle__service_company=service)

        raise PermissionDenied("У вас нет прав доступа к этим данным.")

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        filterset = MaintenanceFilter(self.request.GET, queryset=queryset)

        paginator, result_page = self.pagination_class().custom_sorting_pagination(
            queryset,
            filterset,
            request,
            self.ordering,
            self.ordering_fields
        )

        serializer = serializers.MaintenanceSerializer(result_page, many=True)

        return paginator.get_paginated_response(serializer.data)

    @action(detail=False, url_path=r'vehicle/(?P<vehicle_id>\d+)', methods=['get'])
    def by_vehicle(self, request, vehicle_id=None):
        queryset = self.get_queryset()

        if vehicle_id:
            queryset = queryset.filter(vehicle_id=vehicle_id)

        filterset = MaintenanceFilter(self.request.GET, queryset=queryset)

        paginator, result_page = self.pagination_class().custom_sorting_pagination(
            queryset,
            filterset,
            request,
            self.ordering,
            self.ordering_fields
        )

        serializer = serializers.MaintenanceSerializer(result_page, many=True)

        return paginator.get_paginated_response(serializer.data)


class MaintenanceTypeViewSet(viewsets.ModelViewSet):
    queryset = models.MaintenanceType.objects.all()
    serializer_class = serializers.TypeMaintenanceSerializer
    permission_classes = [DjangoModelPermissionsOrAnonReadOnly]


class OrganizationViewSet(viewsets.ModelViewSet):
    queryset = models.Organization.objects.all()
    serializer_class = serializers.OrganizationSerializer
    permission_classes = [DjangoModelPermissionsOrAnonReadOnly]
