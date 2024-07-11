import logging

from rest_framework.exceptions import ValidationError
from rest_framework.fields import CharField
from rest_framework.relations import PrimaryKeyRelatedField
from rest_framework.serializers import ModelSerializer

from accounts.models import ServiceCompany
from accounts.serializers import ServiceCompanySerializer
from complaints.models import RecoveryMethod, FailureNode, Complaint
from core.serializers import CamelCaseSerializerMixin
from vehicle.models import Vehicle

logger = logging.getLogger(__name__)


class VehicleSerializer(CamelCaseSerializerMixin, ModelSerializer):
    class Meta:
        model = Vehicle
        fields = ['id', 'serial_number']


class RecoveryMethodSerializer(ModelSerializer):
    class Meta:
        model = RecoveryMethod
        fields = ['id', 'name']


class NodeFailureSerializer(CamelCaseSerializerMixin, ModelSerializer):
    class Meta:
        model = FailureNode
        fields = ['id', 'name']


class ComplaintSerializer(CamelCaseSerializerMixin, ModelSerializer):
    descriptionFailure = CharField(source='description_failure')
    dateRecovery = CharField(source='date_recovery')
    operatingTime = CharField(source='operating_time')
    usedParts = CharField(source='used_parts')
    dateFailure = CharField(source='date_failure')

    # vehicle = VehicleSerializer()
    # nodeFailure = NodeFailureSerializer(source='node_failure')
    # recoveryMethod = RecoveryMethodSerializer(source='recovery_method')
    # serviceCompany = ServiceCompanySerializer(source='service_company')

    vehicle = PrimaryKeyRelatedField(queryset=Vehicle.objects.all())
    nodeFailure = PrimaryKeyRelatedField(queryset=FailureNode.objects.all(), source='node_failure')
    recoveryMethod = PrimaryKeyRelatedField(queryset=RecoveryMethod.objects.all(), source='recovery_method')
    serviceCompany = PrimaryKeyRelatedField(queryset=ServiceCompany.objects.all(), source='service_company')

    class Meta:
        model = Complaint
        fields = [
            'id',
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

    def validate(self, data):
        errors = {}
        if not data.get('vehicle'):
            errors['vehicle'] = 'This field is required.'
        if not data.get('node_failure'):
            errors['node_failure'] = 'This field is required.'
        if not data.get('recovery_method'):
            errors['recovery_method'] = 'This field is required.'
        if errors:
            logger.debug('Validation errors: %s', errors)
            raise ValidationError(errors)
        return data

    def to_internal_value(self, data):
        try:
            return super().to_internal_value(data)
        except ValidationError as e:
            logger.debug('to_internal_value ValidationError: %s', e.detail)
            raise e

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['vehicle'] = VehicleSerializer(instance.vehicle).data
        ret['nodeFailure'] = NodeFailureSerializer(instance.node_failure).data
        ret['recoveryMethod'] = RecoveryMethodSerializer(instance.recovery_method).data
        ret['serviceCompany'] = ServiceCompanySerializer(
            instance.service_company).data if instance.service_company else None
        return ret
