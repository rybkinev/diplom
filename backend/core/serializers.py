from rest_framework.fields import SerializerMethodField
from rest_framework.serializers import Serializer, ModelSerializer

from core.utils.camel_case import convert_keys_to_camel_case


class CamelCaseSerializerMixin(Serializer):
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        return convert_keys_to_camel_case(representation)


class ReferenceSerializer(CamelCaseSerializerMixin, ModelSerializer):
    label = SerializerMethodField('get_label')

    class Meta:
        fields = ['id', 'name', 'description', 'label']

    def get_label(self, obj):
        return ""
