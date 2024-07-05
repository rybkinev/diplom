from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.tokens import RefreshToken


class CustomTokenRefreshSerializer(TokenRefreshSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        # Создайте новый refresh токен
        refresh = RefreshToken()
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)

        return data
