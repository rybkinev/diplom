from django.urls import path, include
from rest_framework import routers

from vehicle import views


router = routers.DefaultRouter()

router.register(r'vehicle-model', views.VehicleModelViewSet)
router.register(r'engine-model', views.EngineModelViewSet)
router.register(r'transmission-model', views.TransmissionModelViewSet)
router.register(r'drive-axle-model', views.DriveAxleModelViewSet)
router.register(r'steering-axle-model', views.SteeringAxleModelViewSet)
router.register(r'clients', views.ClientViewSet)
router.register(r'', views.VehicleViewSet)

urlpatterns = [
    path('vehicles/', include(router.urls)),
]
