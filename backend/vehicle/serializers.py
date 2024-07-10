from rest_framework.fields import CharField, DateField
from rest_framework.serializers import ModelSerializer

from accounts.serializers import ServiceCompanySerializer
from core.serializers import CamelCaseSerializerMixin, ReferenceSerializer
from vehicle.models import Vehicle, DriveAxleModel, TransmissionModel, EngineModel, VehicleModel, SteeringAxleModel


class VehicleModelSerializer(ReferenceSerializer):
    class Meta(ReferenceSerializer.Meta):
        model = VehicleModel

    def get_label(self, obj):
        return "Модель"


class EngineModelSerializer(ReferenceSerializer):
    class Meta(ReferenceSerializer.Meta):
        model = EngineModel

    def get_label(self, obj):
        return "Модель двигателя"


class TransmissionModelSerializer(ReferenceSerializer):
    class Meta(ReferenceSerializer.Meta):
        model = TransmissionModel

    def get_label(self, obj):
        return "Модель трансмиссии"


class DriveAxleModelSerializer(ReferenceSerializer):
    class Meta(ReferenceSerializer.Meta):
        model = DriveAxleModel

    def get_label(self, obj):
        return "Модель ведущего моста"


class SteeringAxleModelSerializer(ReferenceSerializer):
    class Meta(ReferenceSerializer.Meta):
        model = SteeringAxleModel

    def get_label(self, obj):
        return "Модель управляемого моста"


class PrivateVehicleSerializer(CamelCaseSerializerMixin, ModelSerializer):
    serialNumber = CharField(source='serial_number')
    vehicleModel = VehicleModelSerializer(source='vehicle_model')
    engineModel = EngineModelSerializer(source='engine_model')
    snEngine = CharField(source='sn_engine')
    transmissionModel = TransmissionModelSerializer(source='transmission_model')
    snTransmission = CharField(source='sn_transmission')
    driveAxleModel = DriveAxleModelSerializer(source='drive_axle_model')
    snDriveAxle = CharField(source='sn_drive_axle')
    steeringAxleModel = SteeringAxleModelSerializer(source='steering_axle_model')
    snSteeringAxle = CharField(source='sn_steering_axle')
    shippingDate = DateField(source='shipping_date')
    deliveryAddress = CharField(source='delivery_address')
    serviceCompany = ServiceCompanySerializer(source='service_company')

    class Meta:
        model = Vehicle
        fields = [
            'id',
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


class PublicVehicleSerializer(CamelCaseSerializerMixin, ModelSerializer):
    serialNumber = CharField(source='serial_number')
    vehicleModel = VehicleModelSerializer(source='vehicle_model')
    engineModel = EngineModelSerializer(source='engine_model')
    transmissionModel = TransmissionModelSerializer(source='transmission_model')
    driveAxleModel = DriveAxleModelSerializer(source='drive_axle_model')
    steeringAxleModel = SteeringAxleModelSerializer(source='steering_axle_model')

    snEngine = CharField(source='sn_engine')
    snTransmission = CharField(source='sn_transmission')
    snDriveAxle = CharField(source='sn_drive_axle')
    snSteeringAxle = CharField(source='sn_steering_axle')

    class Meta:
        model = Vehicle
        fields = [
            'id',
            'serialNumber',
            'vehicleModel',
            'engineModel',
            'transmissionModel',
            'driveAxleModel',
            'steeringAxleModel',
            'equipment',
            'snEngine',
            'snTransmission',
            'snDriveAxle',
            'snSteeringAxle',
        ]
