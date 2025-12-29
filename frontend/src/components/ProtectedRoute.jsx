import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { user, isAuthenticated, loading } = useAuth();

    // Wait for auth state hydration before making routing decisions
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
            </div>
        );
    }

    // Unauthenticated users must login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // RBAC: Redirect unauthorized roles to profile instead of showing forbidden
    // This prevents information disclosure about admin-only routes
    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/profile" replace />;
    }

    return children;
};

export default ProtectedRoute;
