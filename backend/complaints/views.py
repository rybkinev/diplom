from django_filters.rest_framework.backends import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.decorators import action
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

    def list(self, request, *args, **kwargs):
        filterset = ComplaintFilter(self.request.GET, queryset=self.queryset)

        paginator, result_page = self.pagination_class().custom_sorting_pagination(
            self.queryset,
            filterset,
            request,
            self.ordering,
            self.ordering_fields
        )

        serializer = serializers.ComplaintSerializer(result_page, many=True)

        return paginator.get_paginated_response(serializer.data)

    @action(detail=False, url_path=r'vehicle/(?P<vehicle_id>\d+)', methods=['get'])
    def by_vehicle(self, request, vehicle_id=None):
        if vehicle_id:
            queryset = self.queryset.filter(vehicle_id=vehicle_id)
        else:
            queryset = self.queryset

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
