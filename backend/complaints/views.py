from django_filters.rest_framework.backends import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.filters import OrderingFilter
from rest_framework.permissions import DjangoModelPermissionsOrAnonReadOnly, DjangoModelPermissions

from complaints.filters import ComplaintFilter
import complaints.models as models
import complaints.serializers as serializers
from core.pagination import CustomPageNumberPagination


class ComplaintViewSet(viewsets.ModelViewSet):

    queryset = models.Complaint.objects.all()
    serializer_class = serializers.ComplaintSerializer
    permission_classes = [DjangoModelPermissions]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    ordering = '-date_failure'
    ordering_fields = [
        'date_failure',
        'operating_time',
        'node_failure',
        'description_failure',
        'recovery_method',
        'used_parts',
        'date_recovery',
        'vehicle',
        'service_company'
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

        filterset = ComplaintFilter(self.request.GET, queryset=queryset)

        paginator, result_page = self.pagination_class().custom_sorting_pagination(
            queryset,
            filterset,
            request,
            self.ordering,
            self.ordering_fields
        )

        serializer = serializers.ComplaintSerializer(result_page, many=True)

        return paginator.get_paginated_response(serializer.data)

    @action(detail=False, url_path=r'vehicle/(?P<vehicle_id>\d+)', methods=['get'])
    def by_vehicle(self, request, vehicle_id=None):
        queryset = self.get_queryset()

        if vehicle_id:
            queryset = queryset.filter(vehicle_id=vehicle_id)

        filterset = ComplaintFilter(self.request.GET, queryset=queryset)

        paginator, result_page = self.pagination_class().custom_sorting_pagination(
            queryset,
            filterset,
            request,
            self.ordering,
            self.ordering_fields
        )

        serializer = serializers.ComplaintSerializer(result_page, many=True)

        return paginator.get_paginated_response(serializer.data)


class FailureNodeViewSet(viewsets.ModelViewSet):
    queryset = models.FailureNode.objects.all()
    serializer_class = serializers.NodeFailureSerializer
    permission_classes = [DjangoModelPermissionsOrAnonReadOnly]


class RecoveryMethodViewSet(viewsets.ModelViewSet):
    queryset = models.RecoveryMethod.objects.all()
    serializer_class = serializers.RecoveryMethodSerializer
    permission_classes = [DjangoModelPermissionsOrAnonReadOnly]
