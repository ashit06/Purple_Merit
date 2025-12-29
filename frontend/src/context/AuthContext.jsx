import { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [loading, setLoading] = useState(true);

    const isAuthenticated = !!accessToken && !!user;

    // Hydrate auth state from localStorage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('accessToken');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            try {
                setAccessToken(storedToken);
                setUser(JSON.parse(storedUser));
            } catch {
                // Corrupted localStorage data - clear and force re-login
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const response = await axiosInstance.post('/auth/login/', { email, password });
        const { access, refresh, user: userData } = response.data;

        // Persist auth data for session recovery
        localStorage.setItem('accessToken', access);
        localStorage.setItem('refreshToken', refresh);
        localStorage.setItem('user', JSON.stringify(userData));

        setAccessToken(access);
        setUser(userData);

        return userData;
    };

    const register = async (email, password, fullName) => {
        const response = await axiosInstance.post('/auth/register/', {
            email,
            password,
            full_name: fullName,
        });
        const { tokens, user: userData } = response.data;

        localStorage.setItem('accessToken', tokens.access);
        localStorage.setItem('refreshToken', tokens.refresh);
        localStorage.setItem('user', JSON.stringify(userData));

        setAccessToken(tokens.access);
        setUser(userData);

        return userData;
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        setAccessToken(null);
        setUser(null);
    };

    const value = {
        user,
        accessToken,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
