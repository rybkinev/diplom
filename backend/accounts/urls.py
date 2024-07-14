from django.urls import path, include
from rest_framework import routers
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from accounts import views

router = routers.DefaultRouter()
router.register(r'service-company', views.ServiceCompanyViewSet)

urlpatterns = [
    path('account/', include(router.urls)),
    path('account/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('account/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('account/logout/', views.LogoutView.as_view(), name='logout'),
    path('account/permissions/', views.UserPermissionsView.as_view(), name='user-permissions'),
]
