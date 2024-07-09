from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.filters import OrderingFilter
from rest_framework.permissions import AllowAny, IsAuthenticated

from core.pagination import CustomPageNumberPagination
from vehicle.filters import PrivateVehicleFilter, PublicVehicleFilter
from vehicle.models import Vehicle
from vehicle.serializers import PrivateVehicleSerializer, PublicVehicleSerializer


class VehicleViewSet(viewsets.ModelViewSet):

    queryset = Vehicle.objects.all()
    serializer_class = PrivateVehicleSerializer
    # permission_classes = [IsAuthenticated]
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

    def get_permissions(self):
        if self.action in ['public']:
            permission_classes = [AllowAny]
        elif self.action == 'retrieve':
            permission_classes = [AllowAny]
        elif self.action in ['list', 'create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_serializer_class(self):
        if self.action == 'list' or self.action == 'retrieve':
            user = getattr(self.request, 'user', None)
            if user and user.is_authenticated:
                return PrivateVehicleSerializer
            else:
                return PublicVehicleSerializer
        elif self.action == 'public':
            return PublicVehicleSerializer

        return PrivateVehicleSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        if self.action == 'public':
            return queryset

        if self.request.user.is_authenticated:
            if self.request.user.groups.filter(name='Client').exists():
                return queryset.filter(client=self.request.user)
            elif self.request.user.groups.filter(name='Service').exists():
                return queryset.filter(service_company=self.request.user)
        return queryset

    def list(self, request, *args, **kwargs):
        filterset = PrivateVehicleFilter(self.request.GET, queryset=self.queryset)

        paginator, result_page = self.pagination_class.custom_sorting_pagination(
            self.queryset,
            filterset,
            request,
            '-shipping_date',
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

        paginator, result_page = self.pagination_class.custom_sorting_pagination(
            self.queryset,
            filterset,
            request,
            'serial_number',
            ordering_fields
        )

        serializer = PublicVehicleSerializer(result_page, many=True)

        return paginator.get_paginated_response(serializer.data)

    @action(detail=True, methods=['get'], permission_classes=[AllowAny])
    def public_retrieve(self, request):
        pass
        # return
