from django_filters.rest_framework.backends import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.decorators import action
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

    def list(self, request, *args, **kwargs):

        filterset = MaintenanceFilter(self.request.GET, queryset=self.queryset)

        paginator, result_page = self.pagination_class().custom_sorting_pagination(
            self.queryset,
            filterset,
            request,
            self.ordering,
            self.ordering_fields
        )

        serializer = serializers.MaintenanceSerializer(result_page, many=True)

        return paginator.get_paginated_response(serializer.data)

    @action(detail=False, url_path=r'vehicle/(?P<vehicle_id>\d+)', methods=['get'])
    def by_vehicle(self, request, vehicle_id=None):
        if vehicle_id:
            queryset = self.queryset.filter(vehicle_id=vehicle_id)
        else:
            queryset = self.queryset

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
