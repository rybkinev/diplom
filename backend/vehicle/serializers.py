from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from rest_framework.fields import CharField, DateField
from rest_framework.relations import PrimaryKeyRelatedField
from rest_framework.serializers import ModelSerializer

from accounts.models import ServiceCompany
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


class ClientSerializer(CamelCaseSerializerMixin, ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('id', 'first_name')


class PrivateVehicleSerializer(CamelCaseSerializerMixin, ModelSerializer):
    serialNumber = CharField(source='serial_number')
    snEngine = CharField(source='sn_engine')
    snTransmission = CharField(source='sn_transmission')
    snDriveAxle = CharField(source='sn_drive_axle')
    snSteeringAxle = CharField(source='sn_steering_axle')
    shippingDate = DateField(source='shipping_date')
    deliveryAddress = CharField(source='delivery_address')

    # vehicleModel = VehicleModelSerializer(source='vehicle_model')
    # engineModel = EngineModelSerializer(source='engine_model')
    # transmissionModel = TransmissionModelSerializer(source='transmission_model')
    # driveAxleModel = DriveAxleModelSerializer(source='drive_axle_model')
    # steeringAxleModel = SteeringAxleModelSerializer(source='steering_axle_model')
    # serviceCompany = ServiceCompanySerializer(source='service_company')

    vehicleModel = PrimaryKeyRelatedField(queryset=VehicleModel.objects.all(), source='vehicle_model')
    engineModel = PrimaryKeyRelatedField(queryset=EngineModel.objects.all(), source='engine_model')
    transmissionModel = PrimaryKeyRelatedField(queryset=TransmissionModel.objects.all(), source='transmission_model')
    driveAxleModel = PrimaryKeyRelatedField(queryset=DriveAxleModel.objects.all(), source='drive_axle_model')
    steeringAxleModel = PrimaryKeyRelatedField(queryset=SteeringAxleModel.objects.all(), source='steering_axle_model')
    serviceCompany = PrimaryKeyRelatedField(queryset=ServiceCompany.objects.all(), source='service_company')
    client = PrimaryKeyRelatedField(queryset=get_user_model().objects.none())

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Проверяем группу пользователя и фильтруем queryset в зависимости от группы
        group_name = 'Client'
        group = Group.objects.get(name=group_name)
        self.fields['client'].queryset = get_user_model().objects.filter(groups=group)

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

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['vehicleModel'] = VehicleModelSerializer(instance.vehicle_model).data
        ret['engineModel'] = EngineModelSerializer(instance.engine_model).data
        ret['transmissionModel'] = TransmissionModelSerializer(instance.transmission_model).data
        ret['driveAxleModel'] = DriveAxleModelSerializer(instance.drive_axle_model).data
        ret['steeringAxleModel'] = SteeringAxleModelSerializer(instance.steering_axle_model).data
        ret['client'] = ClientSerializer(instance.client).data
        ret['serviceCompany'] = ServiceCompanySerializer(
            instance.service_company).data if instance.service_company else None
        return ret


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
