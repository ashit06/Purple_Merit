import re
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from .models import CustomUser


class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Handles user registration with password validation.
    Returns JWT tokens immediately for auto-login after signup.
    """
    
    password = serializers.CharField(
        write_only=True,
        min_length=8,
        style={'input_type': 'password'}
    )
    
    class Meta:
        model = CustomUser
        fields = ['email', 'password', 'full_name']
    
    def validate_password(self, value: str) -> str:
        if not re.search(r'[A-Za-z]', value):
            raise serializers.ValidationError('Password must contain at least one letter')
        if not re.search(r'\d', value):
            raise serializers.ValidationError('Password must contain at least one number')
        return value
    
    def create(self, validated_data: dict) -> CustomUser:
        return CustomUser.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            full_name=validated_data['full_name']
        )


class UserResponseSerializer(serializers.ModelSerializer):
    """
    Serializer for returning user data in responses.
    """
    
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'full_name', 'role', 'is_active', 'date_joined']
        read_only_fields = fields


class TokenResponseSerializer(serializers.Serializer):
    """Schema for token response documentation."""
    access = serializers.CharField()
    refresh = serializers.CharField()
    user = UserResponseSerializer()


def get_tokens_for_user(user: CustomUser) -> dict:
    """
    Generate JWT token pair for a user.
    Called after registration for auto-login functionality.
    """
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


# =============================================================================
# ADMIN SERIALIZERS
# =============================================================================

class UserListSerializer(serializers.ModelSerializer):
    """
    Optimized serializer for admin user table.
    Includes only fields needed for the dashboard display.
    """
    
    class Meta:
        model = CustomUser
        fields = ['id', 'full_name', 'email', 'role', 'is_active', 'last_login']
        read_only_fields = fields


class UserStatusSerializer(serializers.ModelSerializer):
    """
    Minimal serializer for toggling user active status.
    Restricted to is_active to prevent admins from modifying other fields.
    """
    
    class Meta:
        model = CustomUser
        fields = ['is_active']


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for users to view/update their own profile.
    Email changes trigger re-validation requirements in production.
    """
    
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'full_name', 'role', 'is_active', 'date_joined']
        read_only_fields = ['id', 'role', 'is_active', 'date_joined']
