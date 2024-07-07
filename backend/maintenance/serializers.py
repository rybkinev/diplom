from rest_framework.fields import CharField
from rest_framework.serializers import ModelSerializer

from accounts.models import ServiceCompany
from core.serializers import CamelCaseSerializerMixin
from maintenance.models import Maintenance, Organization, MaintenanceType
from vehicle.models import Vehicle


class VehicleSerializer(CamelCaseSerializerMixin, ModelSerializer):
    class Meta:
        model = Vehicle
        fields = ['id', 'serial_number']


class OrganizationSerializer(ModelSerializer):
    class Meta:
        model = Organization
        fields = ['id', 'name']


class TypeMaintenanceSerializer(CamelCaseSerializerMixin, ModelSerializer):
    class Meta:
        model = MaintenanceType
        fields = ['id', 'name']


class ServiceCompanySerializer(CamelCaseSerializerMixin, ModelSerializer):
    class Meta:
        model = ServiceCompany
        fields = ['id', 'name']


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
            'vehicle',
            'typeMaintenance',
            'dateMaintenance',
            'operatingTime',
            'workOrder',
            'dateOrder',
            'organization',
            'serviceCompany',
        ]
