from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.filters import OrderingFilter
from rest_framework.permissions import DjangoModelPermissionsOrAnonReadOnly, DjangoModelPermissions

from core.pagination import CustomPageNumberPagination
from vehicle.filters import PrivateVehicleFilter, PublicVehicleFilter
import vehicle.models as models
import vehicle.serializers as serializers


class VehicleViewSet(viewsets.ModelViewSet):

    queryset = models.Vehicle.objects.all()
    serializer_class = serializers.PrivateVehicleSerializer
    # permission_classes = [DjangoModelPermissions]
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
            permission_classes = [DjangoModelPermissionsOrAnonReadOnly]
        elif self.action == 'retrieve':
            permission_classes = [DjangoModelPermissionsOrAnonReadOnly]
        elif self.action in ['list', 'create', 'update', 'partial_update', 'destroy']:
            permission_classes = [DjangoModelPermissions]
        else:
            permission_classes = [DjangoModelPermissions]
        return [permission() for permission in permission_classes]

    def get_serializer_class(self):
        if self.action == 'list' or self.action == 'retrieve':
            user = getattr(self.request, 'user', None)
            if user and user.is_authenticated:
                return serializers.PrivateVehicleSerializer
            else:
                return serializers.PublicVehicleSerializer
        elif self.action == 'public':
            return serializers.PublicVehicleSerializer

        return serializers.PrivateVehicleSerializer

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

        paginator, result_page = self.pagination_class().custom_sorting_pagination(
            self.queryset,
            filterset,
            request,
            '-shipping_date',
            self.ordering_fields
        )

        serializer = serializers.PrivateVehicleSerializer(result_page, many=True)

        return paginator.get_paginated_response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[DjangoModelPermissionsOrAnonReadOnly])
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

        paginator, result_page = self.pagination_class().custom_sorting_pagination(
            self.queryset,
            filterset,
            request,
            'serial_number',
            ordering_fields
        )

        serializer = serializers.PublicVehicleSerializer(result_page, many=True)

        return paginator.get_paginated_response(serializer.data)


class VehicleModelViewSet(viewsets.ModelViewSet):
    queryset = models.VehicleModel.objects.all()
    serializer_class = serializers.VehicleModelSerializer
    permission_classes = [DjangoModelPermissionsOrAnonReadOnly]


class EngineModelViewSet(viewsets.ModelViewSet):
    queryset = models.EngineModel.objects.all()
    serializer_class = serializers.EngineModelSerializer
    permission_classes = [DjangoModelPermissionsOrAnonReadOnly]


class TransmissionModelViewSet(viewsets.ModelViewSet):
    queryset = models.TransmissionModel.objects.all()
    serializer_class = serializers.TransmissionModelSerializer
    permission_classes = [DjangoModelPermissionsOrAnonReadOnly]


class DriveAxleModelViewSet(viewsets.ModelViewSet):
    queryset = models.DriveAxleModel.objects.all()
    serializer_class = serializers.DriveAxleModelSerializer
    permission_classes = [DjangoModelPermissionsOrAnonReadOnly]


class SteeringAxleModelViewSet(viewsets.ModelViewSet):
    queryset = models.SteeringAxleModel.objects.all()
    serializer_class = serializers.SteeringAxleModelSerializer
    permission_classes = [DjangoModelPermissionsOrAnonReadOnly]
