from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from vehicle.models import Vehicle
from vehicle.serializers import VehicleSerializer, VehicleSerializerUnAuth


class VehicleViewSet(viewsets.ModelViewSet):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
    permission_classes = [IsAuthenticated]

    # def list(self, request, *args, **kwargs):
    #     if not request.user.is_authenticated:
    #         data = {"message": "Вы должны быть авторизованы, чтобы увидеть все данные."}
    #         return Response(data, status=401)
    #
    #     queryset = self.filter_queryset(self.get_queryset())
    #     serializer = self.get_serializer(queryset, many=True)
    #     return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def public(self, request):
        queryset = Vehicle.objects.all()
        serializer = VehicleSerializerUnAuth(queryset, many=True)
        return Response(serializer.data)

