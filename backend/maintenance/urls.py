from django.urls import path, include
from rest_framework import routers

from maintenance import views

router = routers.DefaultRouter()
router.register(r'', views.MaintenanceViewSet, basename='maintenance')
router.register(r'maintenance-type', views.MaintenanceTypeViewSet, basename='maintenance-type')
router.register(r'organizations', views.OrganizationViewSet, basename='organizations')

urlpatterns = [
    path('maintenance/', include(router.urls)),
]
