from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated, DjangoModelPermissionsOrAnonReadOnly, \
    DjangoModelPermissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView

from accounts import serializers, models
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


class ServiceCompanyViewSet(ModelViewSet):
    queryset = models.ServiceCompany.objects.all()
    serializer_class = serializers.ServiceCompanySerializer
    permission_classes = [DjangoModelPermissionsOrAnonReadOnly]


class UserInfoViewSet(APIView):
    permission_classes = [DjangoModelPermissions]
    serializer_class = serializers.UserSerializer

    def get_queryset(self):
        user = self.request.user
        return get_user_model().objects.filter(id=user.id)

    def get(self, request, *args, **kwargs):
        serializer = serializers.UserSerializer(self.request.user, many=False)

        return Response(serializer.data)
