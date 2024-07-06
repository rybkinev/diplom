from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.filters import OrderingFilter
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from core.pagination import CustomPageNumberPagination
from core.utils.camel_case import convert_key_to_snake_case
from vehicle.filters import PrivateVehicleFilter, PublicVehicleFilter
from vehicle.models import Vehicle
from vehicle.serializers import PrivateVehicleSerializer, PublicVehicleSerializer


class VehicleViewSet(viewsets.ModelViewSet):

    queryset = Vehicle.objects.all()
    serializer_class = PrivateVehicleSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = PrivateVehicleFilter
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

    def custom_sorting_pagination(self, filterset, request, default_sort, ordering_fields):
        if filterset.is_valid():
            queryset = filterset.qs
        else:
            queryset = self.queryset

        sort = self.request.query_params.get('sort', default_sort)
        reverse_sort = sort.startswith('-')

        sort = convert_key_to_snake_case(sort.lstrip('-'))
        if sort not in ordering_fields:
            sort = default_sort

        if reverse_sort:
            sort = '-' + sort

        queryset = queryset.order_by(sort)

        page_size = self.request.query_params.get('page_size', 5)
        paginator = CustomPageNumberPagination(page_size)
        result_page = paginator.paginate_queryset(queryset, request)

        return paginator, result_page

    def list(self, request, *args, **kwargs):
        filterset = PrivateVehicleFilter(self.request.GET, queryset=self.queryset)

        paginator, result_page = self.custom_sorting_pagination(
            filterset,
            request,
            'shipping_date',
            self.ordering_fields
        )

        serializer = PrivateVehicleSerializer(result_page, many=True)

        return paginator.get_paginated_response(serializer.data)

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

        paginator, result_page = self.custom_sorting_pagination(
            filterset,
            request,
            'serial_number',
            ordering_fields
        )

        serializer = PublicVehicleSerializer(result_page, many=True)

        return paginator.get_paginated_response(serializer.data)
