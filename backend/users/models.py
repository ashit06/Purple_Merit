import uuid
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


class CustomUserManager(BaseUserManager):
    """
    Custom manager for email-based authentication.
    Django's default manager expects 'username' which we've removed.
    """
    
    def create_user(self, email: str, password: str = None, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        
        email = self.normalize_email(email)
        extra_fields.setdefault('is_active', True)
        
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email: str, password: str = None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'admin')
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True')
        
        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractUser):
    """
    Custom user model using UUID and email-based authentication.
    UUID primary key prevents enumeration attacks on user IDs.
    Email as username simplifies the auth flow for modern apps.
    """
    
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('user', 'User'),
    ]
    
    # Override default id with UUID for security
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    
    # Email-based authentication
    email = models.EmailField(
        unique=True,
        db_index=True  # Indexed for fast lookups during authentication
    )
    
    # Remove username field entirely
    username = None
    
    full_name = models.CharField(max_length=255)
    
    # RBAC: Simple role-based access control
    role = models.CharField(
        max_length=10,
        choices=ROLE_CHOICES,
        default='user',
        db_index=True  # Indexed for admin dashboard queries by role
    )
    
    # Soft-delete capability via is_active (inherited, but noted for clarity)
    # is_active = models.BooleanField(default=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']
    
    objects = CustomUserManager()
    
    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        ordering = ['-date_joined']
    
    def __str__(self) -> str:
        return self.email
