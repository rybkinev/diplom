from rest_framework.fields import CharField
from rest_framework.serializers import ModelSerializer

from accounts.serializers import ServiceCompanySerializer
from core.serializers import CamelCaseSerializerMixin, ReferenceSerializer
from maintenance.models import Maintenance, Organization, MaintenanceType
from vehicle.models import Vehicle


class VehicleSerializer(CamelCaseSerializerMixin, ModelSerializer):
    class Meta:
        model = Vehicle
        fields = ['id', 'serial_number']


class OrganizationSerializer(ReferenceSerializer):
    class Meta(ReferenceSerializer.Meta):
        model = Organization


class TypeMaintenanceSerializer(ReferenceSerializer):
    class Meta(ReferenceSerializer.Meta):
        model = MaintenanceType


class MaintenanceSerializer(CamelCaseSerializerMixin, ModelSerializer):
    dateMaintenance = CharField(source='date_maintenance')
    operatingTime = CharField(source='operating_time')
    workOrder = CharField(source='work_order')
    dateOrder = CharField(source='date_order')

    vehicle = VehicleSerializer()
    organization = OrganizationSerializer()
    typeMaintenance = TypeMaintenanceSerializer(source='type_maintenance')
    serviceCompany = ServiceCompanySerializer(source='service_company')

    class Meta:
        model = Maintenance
        fields = [
            'id',
            'vehicle',
            'typeMaintenance',
            'dateMaintenance',
            'operatingTime',
            'workOrder',
            'dateOrder',
            'organization',
            'serviceCompany',
        ]
