from django.urls import path, include
from rest_framework import routers

from complaints import views

router = routers.DefaultRouter()
router.register(r'', views.ComplaintViewSet, basename='complaint')
router.register(r'failure-node', views.FailureNodeViewSet, basename='failure-node')
router.register(r'recovery-method', views.RecoveryMethodViewSet, basename='recovery-method')

urlpatterns = [
    path('complaint/', include(router.urls)),
]