import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from users.models import CustomUser


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def test_user_data():
    return {
        'email': 'test@example.com',
        'password': 'TestPass123',
        'full_name': 'Test User'
    }


@pytest.fixture
def created_user(test_user_data):
    return CustomUser.objects.create_user(
        email=test_user_data['email'],
        password=test_user_data['password'],
        full_name=test_user_data['full_name']
    )


@pytest.fixture
def admin_user():
    return CustomUser.objects.create_user(
        email='admin@example.com',
        password='AdminPass123',
        full_name='Admin User',
        role='admin'
    )


@pytest.fixture
def authenticated_client(api_client, created_user):
    """Client authenticated as regular user."""
    api_client.force_authenticate(user=created_user)
    return api_client


@pytest.fixture
def admin_client(api_client, admin_user):
    """Client authenticated as admin."""
    api_client.force_authenticate(user=admin_user)
    return api_client


@pytest.mark.django_db
class TestAuthentication:
    """Core authentication tests."""
    
    def test_register_user(self, api_client, test_user_data):
        """Verify user creation with proper password hashing."""
        url = reverse('auth-register')
        
        response = api_client.post(url, test_user_data, format='json')
        
        assert response.status_code == status.HTTP_201_CREATED
        assert 'tokens' in response.data
        assert 'access' in response.data['tokens']
        
        user = CustomUser.objects.get(email=test_user_data['email'])
        assert user.password != test_user_data['password']
        assert user.check_password(test_user_data['password'])
    
    def test_login_user(self, api_client, test_user_data, created_user):
        """Verify valid credentials return JWT tokens."""
        url = reverse('auth-login')
        
        response = api_client.post(url, {
            'email': test_user_data['email'],
            'password': test_user_data['password']
        }, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.data
        assert 'refresh' in response.data
        assert response.data['user']['role'] == 'user'
    
    def test_register_weak_password_rejected(self, api_client):
        """Verify password without numbers is rejected."""
        url = reverse('auth-register')
        
        response = api_client.post(url, {
            'email': 'weak@example.com',
            'password': 'NoNumbersHere',
            'full_name': 'Weak Pass User'
        }, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
    
    def test_login_invalid_credentials(self, api_client, created_user):
        """Verify wrong password returns 401."""
        url = reverse('auth-login')
        
        response = api_client.post(url, {
            'email': 'test@example.com',
            'password': 'WrongPassword123'
        }, format='json')
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_uuid_primary_key(self, created_user):
        """Verify UUID is used as primary key for security."""
        assert len(str(created_user.id)) == 36
        assert '-' in str(created_user.id)


@pytest.mark.django_db
class TestAdminRBAC:
    """Admin endpoint security and functionality tests."""
    
    def test_admin_can_list_users(self, admin_client, created_user, admin_user):
        """Verify admin gets paginated user list."""
        url = reverse('admin-user-list')
        
        response = admin_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert 'results' in response.data
        assert 'count' in response.data
    
    def test_user_cannot_access_admin_list(self, authenticated_client):
        """Verify standard user gets 403 Forbidden on admin endpoints."""
        url = reverse('admin-user-list')
        
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_403_FORBIDDEN
    
    def test_unauthenticated_cannot_access_admin_list(self, api_client):
        """Verify unauthenticated request gets 401."""
        url = reverse('admin-user-list')
        
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_pagination_limit(self, admin_client, admin_user):
        """Verify pagination returns exactly 10 items per page."""
        # Create 15 users (plus the admin = 16 total)
        for i in range(15):
            CustomUser.objects.create_user(
                email=f'user{i}@example.com',
                password='TestPass123',
                full_name=f'User {i}'
            )
        
        url = reverse('admin-user-list')
        response = admin_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['results']) == 10
        assert response.data['next'] is not None  # More pages available
    
    def test_admin_cannot_ban_self(self, admin_client, admin_user):
        """Verify self-lockout protection works."""
        url = reverse('admin-user-status', kwargs={'pk': admin_user.id})
        
        response = admin_client.patch(url, {'is_active': False}, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'Cannot modify your own status' in response.data['detail']
    
    def test_admin_can_ban_other_user(self, admin_client, created_user):
        """Verify admin can toggle another user's status."""
        url = reverse('admin-user-status', kwargs={'pk': created_user.id})
        
        response = admin_client.patch(url, {'is_active': False}, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        
        created_user.refresh_from_db()
        assert created_user.is_active is False
    
    def test_soft_delete_persistence(self, admin_client, created_user):
        """Verify is_active toggle persists correctly."""
        url = reverse('admin-user-status', kwargs={'pk': created_user.id})
        
        # Ban
        admin_client.patch(url, {'is_active': False}, format='json')
        created_user.refresh_from_db()
        assert created_user.is_active is False
        
        # Unban
        admin_client.patch(url, {'is_active': True}, format='json')
        created_user.refresh_from_db()
        assert created_user.is_active is True


@pytest.mark.django_db
class TestUserProfile:
    """User profile endpoint tests."""
    
    def test_user_can_view_own_profile(self, authenticated_client, created_user):
        """Verify user can access their own profile."""
        url = reverse('user-profile')
        
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['email'] == created_user.email
    
    def test_user_can_update_own_profile(self, authenticated_client, created_user):
        """Verify user can update their full_name."""
        url = reverse('user-profile')
        
        response = authenticated_client.patch(url, {
            'full_name': 'Updated Name'
        }, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        
        created_user.refresh_from_db()
        assert created_user.full_name == 'Updated Name'
    
    def test_unauthenticated_cannot_access_profile(self, api_client):
        """Verify profile endpoint requires authentication."""
        url = reverse('user-profile')
        
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
