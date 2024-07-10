from django.conf import settings
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView

from accounts.serializers import CustomTokenRefreshSerializer


class LogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            if "rest_framework_simplejwt.token_blacklist" in settings.INSTALLED_APPS:
                refresh_token = request.data["refresh"]
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response("Successfully logged out", status=status.HTTP_200_OK)
        except Exception as e:
            return Response("Error logging out", status=status.HTTP_400_BAD_REQUEST)


class CustomTokenRefreshView(TokenRefreshView):
    serializer_class = CustomTokenRefreshSerializer


class UserPermissionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        permissions = [perm.codename for perm in user.user_permissions.all()]
        for group in user.groups.all():
            permissions.extend(group.permissions.values_list('codename', flat=True))
        return Response({
            "permissions": permissions,
            'superuser': user.is_superuser,
        })
