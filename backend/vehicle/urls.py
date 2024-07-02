from django.urls import path, include
from rest_framework import routers

from vehicle import views


router = routers.DefaultRouter()
router.register(r'vehicles', views.VehicleViewSet, basename='vehicle')

urlpatterns = [
    # path('vehicle/', views.VehicleViewSet.as_view(), name='vehicle'),
    path('vehicle/', include(router.urls)),
]
