from django.urls import path, include
from rest_framework import routers

from vehicle import views


router = routers.DefaultRouter()
router.register(r'', views.VehicleViewSet, basename='vehicles')
router.register(r'vehicle-model', views.VehicleModelViewSet, basename='vehicle-model')
router.register(r'engine-model', views.EngineModelViewSet, basename='engine-model')
router.register(r'transmission-model', views.TransmissionModelViewSet, basename='transmission-model')
router.register(r'drive-axle-model', views.DriveAxleModelViewSet, basename='drive-axle-model')
router.register(r'steering-axle-model', views.SteeringAxleModelViewSet, basename='steering-axle-model')

urlpatterns = [
    path('vehicles/', include(router.urls)),
]
