import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, User, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">PM</span>
                            </div>
                            <span className="font-semibold text-gray-900 text-lg">PurpleMerit</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-4">
                        {isAuthenticated ? (
                            <>
                                {/* User Info Display */}
                                <div className="flex items-center space-x-2 px-3 py-1 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center">
                                        <span className="text-indigo-600 font-medium text-xs">
                                            {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                                        </span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-gray-900 leading-tight">
                                            {user?.full_name || 'User'}
                                        </span>
                                        <span className={`text-xs leading-tight ${user?.role === 'admin' ? 'text-amber-600' : 'text-gray-500'
                                            }`}>
                                            {user?.role === 'admin' ? 'Admin' : 'User'}
                                        </span>
                                    </div>
                                </div>

                                {user?.role === 'admin' && (
                                    <Link
                                        to="/dashboard"
                                        className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                                    >
                                        <LayoutDashboard className="w-4 h-4" />
                                        <span>Dashboard</span>
                                    </Link>
                                )}
                                <Link
                                    to="/profile"
                                    className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                                >
                                    <User className="w-4 h-4" />
                                    <span>Profile</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="px-4 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="md:hidden pb-4 space-y-2">
                        {isAuthenticated ? (
                            <>
                                {/* Mobile User Info */}
                                <div className="flex items-center space-x-3 px-3 py-3 bg-gray-50 rounded-lg mb-2">
                                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                        <span className="text-indigo-600 font-medium">
                                            {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                                        </span>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">{user?.full_name}</div>
                                        <div className={`text-xs ${user?.role === 'admin' ? 'text-amber-600' : 'text-gray-500'
                                            }`}>
                                            {user?.role === 'admin' ? 'Administrator' : 'User'}
                                        </div>
                                    </div>
                                </div>

                                {user?.role === 'admin' && (
                                    <Link
                                        to="/dashboard"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                                    >
                                        Dashboard
                                    </Link>
                                )}
                                <Link
                                    to="/profile"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                                >
                                    Profile
                                </Link>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setMobileMenuOpen(false);
                                    }}
                                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block px-3 py-2 rounded-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
