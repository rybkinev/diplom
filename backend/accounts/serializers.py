from django.contrib.auth import get_user_model
from rest_framework.fields import SerializerMethodField
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


class UserSerializer(CamelCaseSerializerMixin, ModelSerializer):
    userType = SerializerMethodField('get_user_type')

    def get_user_type(self, user):
        groups = {
            'superuser': 'Суперадмин',
            'Client': 'Покупатель',
            'Service': 'Сервисная компания',
            'Manager': 'Менеджер'
        }
        if user.is_superuser:
            return groups.get('superuser', None)

        group = user.groups.last()
        if group:
            return groups.get(group.name, None)
        return None

    class Meta:
        model = get_user_model()
        fields = [
            'id',
            'username',
            'first_name',
            'userType',
        ]
