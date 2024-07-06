from django.db.models import Q
from django_filters import rest_framework as filters

from core.utils.camel_case import convert_key_to_snake_case
from vehicle.models import Vehicle


class PrivateVehicleFilter(filters.FilterSet):
    serialNumber = filters.CharFilter(field_name='serial_number')
    vehicleModel = filters.CharFilter(method='filter_by_foreign_key')
    engineModel = filters.CharFilter(method='filter_by_foreign_key')
    snEngine = filters.CharFilter(field_name='sn_engine')
    transmissionModel = filters.CharFilter(method='filter_by_foreign_key')
    snTransmission = filters.CharFilter(field_name='sn_transmission')
    driveAxleModel = filters.CharFilter(method='filter_by_foreign_key')
    snDriveAxle = filters.CharFilter(field_name='sn_drive_axle')
    steeringAxleModel = filters.CharFilter(method='filter_by_foreign_key')
    snSteeringAxle = filters.CharFilter(field_name='sn_steering_axle')
    shippingDate = filters.DateFilter(field_name='shipping_date')
    deliveryAddress = filters.CharFilter(field_name='delivery_address')
    serviceCompany = filters.CharFilter(method='filter_by_foreign_key')

    class Meta:
        model = Vehicle
        fields = [
            'serialNumber',
            'vehicleModel',
            'engineModel',
            'snEngine',
            'transmissionModel',
            'snTransmission',
            'driveAxleModel',
            'snDriveAxle',
            'steeringAxleModel',
            'snSteeringAxle',
            'shippingDate',
            'deliveryAddress',
            'serviceCompany'
        ]

    def filter_by_foreign_key(self, queryset, name, value):
        # Convert field name from camelCase to snake_case
        snake_case_field_name = convert_key_to_snake_case(name)
        filter_field = f'{snake_case_field_name}__name'
        return queryset.filter(Q(**{filter_field: value}))


class PublicVehicleFilter(filters.FilterSet):
    serialNumber = filters.CharFilter(field_name='serial_number')

    class Meta:
        model = Vehicle
        fields = [
            'serialNumber',
        ]