from rest_framework.serializers import ModelSerializer
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.tokens import RefreshToken

from accounts.models import ServiceCompany
from core.serializers import CamelCaseSerializerMixin, ReferenceSerializer


class CustomTokenRefreshSerializer(TokenRefreshSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        # Создайте новый refresh токен
        refresh = RefreshToken()
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)

        return data


class ServiceCompanySerializer(ReferenceSerializer):
    class Meta(ReferenceSerializer.Meta):
        model = ServiceCompany
        # fields = ['id', 'name', 'description']
