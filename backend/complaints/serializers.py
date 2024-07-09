from rest_framework.fields import CharField
from rest_framework.serializers import ModelSerializer

from accounts.models import ServiceCompany
from accounts.serializers import ServiceCompanySerializer
from core.serializers import CamelCaseSerializerMixin
from maintenance.models import Maintenance, Organization, MaintenanceType
from vehicle.models import Vehicle


class VehicleSerializer(CamelCaseSerializerMixin, ModelSerializer):
    class Meta:
        model = Vehicle
        fields = ['id', 'serial_number']


class RecoveryMethodSerializer(ModelSerializer):
    class Meta:
        model = Organization
        fields = ['id', 'name']


class NodeFailureSerializer(CamelCaseSerializerMixin, ModelSerializer):
    class Meta:
        model = MaintenanceType
        fields = ['id', 'name']


# class ServiceCompanySerializer(CamelCaseSerializerMixin, ModelSerializer):
#     class Meta:
#         model = ServiceCompany
#         fields = ['id', 'name']


class ComplaintSerializer(CamelCaseSerializerMixin, ModelSerializer):
    descriptionFailure = CharField(source='description_failure')
    dateRecovery = CharField(source='date_recovery')
    operatingTime = CharField(source='operating_time')
    usedParts = CharField(source='used_parts')
    dateFailure = CharField(source='date_failure')

    vehicle = VehicleSerializer()
    nodeFailure = NodeFailureSerializer(source='node_failure')
    recoveryMethod = RecoveryMethodSerializer(source='recovery_method')
    serviceCompany = ServiceCompanySerializer(source='service_company')

    class Meta:
        model = Maintenance
        fields = [
            'dateFailure',
            'vehicle',
            'descriptionFailure',
            'nodeFailure',
            'operatingTime',
            'usedParts',
            'recoveryMethod',
            'dateRecovery',
            'serviceCompany',
        ]
