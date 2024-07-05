from rest_framework.fields import CharField, DateField
from rest_framework.serializers import ModelSerializer

from core.serializers import CamelCaseSerializerMixin
from vehicle.models import Vehicle


class VehicleSerializer(CamelCaseSerializerMixin, ModelSerializer):
    serialNumber = CharField(source='serial_number')
    vehicleModel = CharField(source='vehicle_model')
    engineModel = CharField(source='engine_model')
    snEngine = CharField(source='sn_engine')
    transmissionModel = CharField(source='transmission_model')
    snTransmission = CharField(source='sn_transmission')
    driveAxleModel = CharField(source='drive_axle_model')
    snDriveAxle = CharField(source='sn_drive_axle')
    steeringAxleModel = CharField(source='steering_axle_model')
    snSteeringAxle = CharField(source='sn_steering_axle')
    shippingDate = DateField(source='shipping_date')
    deliveryAddress = CharField(source='delivery_address')
    serviceCompany = CharField(source='service_company')

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
            'contract',
            'shippingDate',
            'consignee',
            'deliveryAddress',
            'equipment',
            'client',
            'serviceCompany'
        ]

        # extra_kwargs = {
        #     'password': {'write_only': True}
        # }


class VehicleSerializerUnAuth(CamelCaseSerializerMixin, ModelSerializer):
    serialNumber = CharField(source='serial_number')
    vehicleModel = CharField(source='vehicle_model')
    engineModel = CharField(source='engine_model')
    transmissionModel = CharField(source='transmission_model')
    driveAxleModel = CharField(source='drive_axle_model')
    steeringAxleModel = CharField(source='steering_axle_model')

    class Meta:
        model = Vehicle
        fields = [
            'serialNumber',
            'vehicleModel',
            'engineModel',
            'transmissionModel',
            'driveAxleModel',
            'steeringAxleModel',
            'equipment',
        ]
