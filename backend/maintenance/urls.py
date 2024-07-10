from django.urls import path, include
from rest_framework import routers

from maintenance import views

router = routers.DefaultRouter()
router.register(r'maintenance-type', views.MaintenanceTypeViewSet)
router.register(r'organizations', views.OrganizationViewSet)
router.register(r'', views.MaintenanceViewSet)

urlpatterns = [
    path('maintenance/', include(router.urls)),
]
