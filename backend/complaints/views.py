from django_filters.rest_framework.backends import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.filters import OrderingFilter
from rest_framework.permissions import IsAuthenticated

from complaints.filters import ComplaintFilter
from complaints.models import Complaint
from complaints.serializers import ComplaintSerializer
from core.pagination import CustomPageNumberPagination
from maintenance.filters import MaintenanceFilter
from maintenance.models import Maintenance
from maintenance.serializers import MaintenanceSerializer


class ComplaintViewSet(viewsets.ModelViewSet):

    queryset = Complaint.objects.all()
    serializer_class = ComplaintSerializer
    permission_classes = [IsAuthenticated]
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

        paginator, result_page = self.pagination_class.custom_sorting_pagination(
            self.queryset,
            filterset,
            request,
            self.ordering,
            self.ordering_fields
        )

        serializer = ComplaintSerializer(result_page, many=True)

        return paginator.get_paginated_response(serializer.data)
