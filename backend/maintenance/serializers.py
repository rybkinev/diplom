from rest_framework.fields import CharField
from rest_framework.relations import PrimaryKeyRelatedField
from rest_framework.serializers import ModelSerializer

from accounts.models import ServiceCompany
from accounts.serializers import ServiceCompanySerializer
from complaints.serializers import NodeFailureSerializer
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

    # vehicle = VehicleSerializer()
    # organization = OrganizationSerializer()
    # typeMaintenance = TypeMaintenanceSerializer(source='type_maintenance')
    # serviceCompany = ServiceCompanySerializer(source='service_company')

    vehicle = PrimaryKeyRelatedField(queryset=Vehicle.objects.all())
    organization = PrimaryKeyRelatedField(queryset=Organization.objects.all())
    typeMaintenance = PrimaryKeyRelatedField(queryset=MaintenanceType.objects.all(), source='type_maintenance')
    serviceCompany = PrimaryKeyRelatedField(queryset=ServiceCompany.objects.all(), source='service_company')

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

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['vehicle'] = VehicleSerializer(instance.vehicle).data
        ret['organization'] = OrganizationSerializer(instance.organization).data
        ret['typeMaintenance'] = TypeMaintenanceSerializer(instance.type_maintenance).data
        ret['serviceCompany'] = ServiceCompanySerializer(
            instance.service_company).data if instance.service_company else None
        return ret
