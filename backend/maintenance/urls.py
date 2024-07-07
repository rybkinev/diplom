from django.urls import path, include
from rest_framework import routers

from maintenance import views

router = routers.DefaultRouter()
router.register(r'', views.MaintenanceViewSet, basename='maintenance')

urlpatterns = [
    path('maintenance/', include(router.urls)),
]