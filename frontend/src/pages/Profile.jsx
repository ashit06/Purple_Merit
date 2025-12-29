import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Calendar, Save, X, Lock } from 'lucide-react';
import axiosInstance from '../utils/axiosInstance';
import toast from 'react-hot-toast';

const Profile = () => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // Edit form state
    const [fullName, setFullName] = useState(user?.full_name || '');
    const [email, setEmail] = useState(user?.email || '');

    // Password change state
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    if (!user) return null;

    const handleSaveProfile = async () => {
        setLoading(true);
        try {
            await axiosInstance.put('/auth/profile/', { full_name: fullName, email });
            toast.success('Profile updated successfully');
            setIsEditing(false);
            // Update local storage
            const updatedUser = { ...user, full_name: fullName, email };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            window.location.reload();
        } catch (err) {
            const message = err.response?.data?.email?.[0] || err.response?.data?.detail || 'Failed to update profile';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async () => {
        setLoading(true);
        try {
            await axiosInstance.post('/auth/profile/change-password/', {
                old_password: oldPassword,
                new_password: newPassword
            });
            toast.success('Password changed successfully');
            setIsChangingPassword(false);
            setOldPassword('');
            setNewPassword('');
        } catch (err) {
            const message = err.response?.data?.old_password?.[0] ||
                err.response?.data?.new_password?.[0] ||
                err.response?.data?.detail ||
                'Failed to change password';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const cancelEdit = () => {
        setFullName(user.full_name);
        setEmail(user.email);
        setIsEditing(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-8">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                                <span className="text-white text-2xl font-bold">
                                    {user.full_name?.charAt(0)?.toUpperCase() || 'U'}
                                </span>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">{user.full_name}</h1>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${user.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-indigo-100 text-indigo-800'
                                    }`}>
                                    {user.role === 'admin' ? 'Administrator' : 'User'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Profile Details */}
                    <div className="px-6 py-6 space-y-6">
                        {!isEditing ? (
                            // View Mode
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="flex items-start space-x-3">
                                    <User className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Full Name</p>
                                        <p className="text-base text-gray-900">{user.full_name}</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Email</p>
                                        <p className="text-base text-gray-900">{user.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <Shield className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Role</p>
                                        <p className="text-base text-gray-900 capitalize">{user.role}</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">User ID</p>
                                        <p className="text-base text-gray-900 font-mono text-sm">{user.id}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // Edit Mode
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3 pt-4 border-t">
                            {!isEditing ? (
                                <>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                    >
                                        Edit Profile
                                    </button>
                                    <button
                                        onClick={() => setIsChangingPassword(true)}
                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        Change Password
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={handleSaveProfile}
                                        disabled={loading}
                                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button
                                        onClick={cancelEdit}
                                        className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        Cancel
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Change Password Modal */}
                {isChangingPassword && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                        <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
                            <div className="flex items-center space-x-3 mb-4">
                                <Lock className="w-6 h-6 text-indigo-600" />
                                <h2 className="text-xl font-semibold">Change Password</h2>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                    <input
                                        type="password"
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        placeholder="••••••••"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Min 8 characters with letters and numbers</p>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    onClick={() => {
                                        setIsChangingPassword(false);
                                        setOldPassword('');
                                        setNewPassword('');
                                    }}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleChangePassword}
                                    disabled={loading || !oldPassword || !newPassword}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    {loading ? 'Changing...' : 'Change Password'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
