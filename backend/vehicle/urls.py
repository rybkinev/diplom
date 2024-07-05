from django.urls import path, include
from rest_framework import routers

from vehicle import views


router = routers.DefaultRouter()
router.register(r'', views.VehicleViewSet, basename='vehicles')

urlpatterns = [
    # path('vehicle/', views.VehicleViewSet.as_view(), name='vehicle'),
    path('vehicles/', include(router.urls)),
]
