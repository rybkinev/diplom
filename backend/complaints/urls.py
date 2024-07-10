from django.urls import path, include
from rest_framework import routers

from complaints import views

router = routers.DefaultRouter()
router.register(r'failure-node', views.FailureNodeViewSet)
router.register(r'recovery-method', views.RecoveryMethodViewSet)
router.register(r'', views.ComplaintViewSet)

urlpatterns = [
    path('complaint/', include(router.urls)),
]
