from django.conf import settings
from rest_framework import permissions
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            if "rest_framework_simplejwt.token_blacklist" in settings.INSTALLED_APPS:
                refresh_token = request.data["refresh"]
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response("Successfully logged out", status=status.HTTP_200_OK)
        except Exception as e:
            return Response("Error logging out", status=status.HTTP_400_BAD_REQUEST)
