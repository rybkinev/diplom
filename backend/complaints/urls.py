from django.urls import path, include
from rest_framework import routers

from complaints import views

router = routers.DefaultRouter()
router.register(r'', views.ComplaintViewSet, basename='complaint')

urlpatterns = [
    path('complaint/', include(router.urls)),
]