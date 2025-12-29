from django.utils import timezone
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import CustomUser
from .permissions import IsAdminRole
from .serializers import (
    UserRegistrationSerializer,
    UserResponseSerializer,
    UserListSerializer,
    UserStatusSerializer,
    UserProfileSerializer,
    ChangePasswordSerializer,
    get_tokens_for_user
)


# =============================================================================
# AUTHENTICATION VIEWS
# =============================================================================

class RegisterView(generics.CreateAPIView):
    """
    Public endpoint for user registration.
    Returns JWT tokens immediately for seamless auto-login after signup.
    """
    
    queryset = CustomUser.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.save()
        tokens = get_tokens_for_user(user)
        
        return Response({
            'user': UserResponseSerializer(user).data,
            'tokens': tokens
        }, status=status.HTTP_201_CREATED)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Extended token serializer to include user role in response.
    Frontend needs role for RBAC routing decisions.
    Updates last_login timestamp for audit trail.
    """
    
    def validate(self, attrs: dict) -> dict:
        data = super().validate(attrs)
        
        # Update last_login for user activity tracking
        self.user.last_login = timezone.now()
        self.user.save(update_fields=['last_login'])
        
        data['user'] = {
            'id': str(self.user.id),
            'email': self.user.email,
            'full_name': self.user.full_name,
            'role': self.user.role,
        }
        
        return data


class LoginView(TokenObtainPairView):
    """
    JWT login endpoint.
    Returns access/refresh tokens plus user role for RBAC.
    """
    
    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = [AllowAny]


# =============================================================================
# ADMIN VIEWS
# =============================================================================

class AdminUserListView(generics.ListAPIView):
    """
    Paginated user list for admin dashboard.
    Uses field-level optimization to prevent SELECT * bloat.
    """
    
    serializer_class = UserListSerializer
    permission_classes = [IsAdminRole]
    
    def get_queryset(self):
        # .only() reduces memory footprint for large datasets
        return CustomUser.objects.only(
            'id', 'full_name', 'email', 'role', 'is_active', 'last_login'
        ).order_by('-date_joined')


class UserStatusUpdateView(generics.UpdateAPIView):
    """
    Toggle user active status (ban/unban).
    Admin-only endpoint with self-lockout protection.
    """
    
    queryset = CustomUser.objects.all()
    serializer_class = UserStatusSerializer
    permission_classes = [IsAdminRole]
    lookup_field = 'pk'
    
    def update(self, request, *args, **kwargs):
        target_user = self.get_object()
        
        # Prevent admin self-lockout
        if target_user.id == request.user.id:
            return Response(
                {'detail': 'Cannot modify your own status.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        return super().update(request, *args, **kwargs)


# =============================================================================
# USER PROFILE VIEWS
# =============================================================================

class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    Authenticated user's own profile.
    Users can update their email and full_name only.
    """
    
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        # Returns the authenticated user's own record
        return self.request.user


class ChangePasswordView(generics.GenericAPIView):
    """
    Change password for authenticated users.
    Requires old password verification for security.
    """
    
    serializer_class = ChangePasswordSerializer
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response(
            {'detail': 'Password changed successfully.'},
            status=status.HTTP_200_OK
        )
