from rest_framework.serializers import Serializer

from core.utils.camel_case import convert_keys_to_camel_case


class CamelCaseSerializerMixin(Serializer):

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        return convert_keys_to_camel_case(representation)