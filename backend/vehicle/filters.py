from django_filters import rest_framework as filters
from vehicle.models import Vehicle


class VehicleFilter(filters.FilterSet):
    serialNumber = filters.CharFilter(field_name='serial_number')
    # vehicleModel = filters.CharFilter(field_name='vehicle_model')
    # engineModel = filters.CharFilter(field_name='engine_model')
    # snEngine = filters.CharFilter(field_name='sn_engine')
    # transmissionModel = filters.CharFilter(field_name='transmission_model')
    # snTransmission = filters.CharFilter(field_name='sn_transmission')
    # driveAxleModel = filters.CharFilter(field_name='drive_axle_model')
    # snDriveAxle = filters.CharFilter(field_name='sn_drive_axle')
    # steeringAxleModel = filters.CharFilter(field_name='steering_axle_model')
    # snSteeringAxle = filters.CharFilter(field_name='sn_steering_axle')
    # shippingDate = filters.DateFilter(field_name='shipping_date')
    # deliveryAddress = filters.CharFilter(field_name='delivery_address')
    # serviceCompany = filters.CharFilter(field_name='service_company')

    class Meta:
        model = Vehicle
        fields = [
            'serialNumber',
            # 'vehicleModel',
            # 'engineModel',
            # 'snEngine',
            # 'transmissionModel',
            # 'snTransmission',
            # 'driveAxleModel',
            # 'snDriveAxle',
            # 'steeringAxleModel',
            # 'snSteeringAxle',
            # 'shippingDate',
            # 'deliveryAddress',
            # 'serviceCompany'
        ]


class PublicVehicleFilter(filters.FilterSet):
    serialNumber = filters.CharFilter(field_name='serial_number')

    class Meta:
        model = Vehicle
        fields = [
            'serialNumber',
        ]