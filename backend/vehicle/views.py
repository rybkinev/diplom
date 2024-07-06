from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.filters import OrderingFilter
from rest_framework.permissions import AllowAny, IsAuthenticated

from core.pagination import CustomPageNumberPagination
from core.utils.camel_case import convert_key_to_snake_case
from vehicle.filters import VehicleFilter, PublicVehicleFilter
from vehicle.models import Vehicle
from vehicle.serializers import VehicleSerializer, PublicVehicleSerializer


class VehicleViewSet(viewsets.ModelViewSet):
    page_size = 5

    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = VehicleFilter
    ordering = 'shipping_date'
    ordering_fields = [
        'serial_number',
        'vehicle_model',
        'engine_model',
        'transmission_model',
        'drive_axle_model',
        'steering_axle_model',
        'shipping_date',
    ]
    pagination_class = CustomPageNumberPagination

    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def public(self, request):
        # Для публичного запроса свой список полей сортировки
        ordering_fields = [
            'serial_number',
            'vehicle_model',
            'engine_model',
            'transmission_model',
            'drive_axle_model',
            'steering_axle_model'
        ]

        filterset = PublicVehicleFilter(self.request.GET, queryset=self.queryset)
        if filterset.is_valid():
            queryset = filterset.qs
        else:
            queryset = self.queryset

        sort = self.request.query_params.get('sort', 'serial_number')
        reverse_sort = sort.startswith('-')

        sort = convert_key_to_snake_case(sort.lstrip('-'))
        if sort not in ordering_fields:
            sort = 'serial_number'

        if reverse_sort:
            sort = '-' + sort

        queryset = queryset.order_by(sort)

        paginator = CustomPageNumberPagination()
        paginator.page_size = self.request.query_params.get('page_size', self.page_size)
        result_page = paginator.paginate_queryset(queryset, request)

        serializer = PublicVehicleSerializer(result_page, many=True)

        return paginator.get_paginated_response(serializer.data)
