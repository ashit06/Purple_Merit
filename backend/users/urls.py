from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView,
    LoginView,
    AdminUserListView,
    UserStatusUpdateView,
    UserProfileView
)

urlpatterns = [
    # Auth endpoints
    path('register/', RegisterView.as_view(), name='auth-register'),
    path('login/', LoginView.as_view(), name='auth-login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    
    # User profile
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    
    # Admin endpoints
    path('admin/users/', AdminUserListView.as_view(), name='admin-user-list'),
    path('admin/users/<uuid:pk>/status/', UserStatusUpdateView.as_view(), name='admin-user-status'),
]
