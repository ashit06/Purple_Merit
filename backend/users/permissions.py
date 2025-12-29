from rest_framework.permissions import BasePermission


class IsAdminRole(BasePermission):
    """
    RBAC permission check for admin-only endpoints.
    Separates Django's is_staff from application-level admin role.
    """
    
    message = 'Admin access required.'
    
    def has_permission(self, request, view) -> bool:
        return (
            request.user.is_authenticated and
            request.user.role == 'admin'
        )
