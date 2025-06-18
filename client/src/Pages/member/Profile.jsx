import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Profile = () => {
    const { currentUser } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        photo: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    useEffect(() => {
        if (currentUser) {
            setFormData({
                name: currentUser.name || '',
                email: currentUser.email || '',
                photo: currentUser.photo || '',
            });
        }
    }, [currentUser]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm({
            ...passwordForm,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ type: '', text: '' });

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 800));

            // Mock success
            setMessage({
                type: 'success',
                text: 'Your profile has been updated successfully!'
            });
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.message || 'Failed to update profile. Please try again.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setMessage({
                type: 'error',
                text: 'New password and confirmation do not match.'
            });
            return;
        }

        setIsLoading(true);
        setMessage({ type: '', text: '' });

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 800));

            // Mock success
            setMessage({
                type: 'success',
                text: 'Your password has been changed successfully!'
            });

            // Reset form
            setPasswordForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.message || 'Failed to change password. Please try again.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold mb-8">My Profile</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Profile Details Form */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">Profile Information</h2>

                    {message.text && (
                        <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                readOnly
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                            />
                            <p className="mt-1 text-xs text-gray-500">Email cannot be changed. Contact an administrator for assistance.</p>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-1">
                                Profile Picture URL
                            </label>
                            <input
                                type="text"
                                id="photo"
                                name="photo"
                                value={formData.photo}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                        >
                            {isLoading ? 'Saving...' : 'Update Profile'}
                        </button>
                    </form>
                </div>

                {/* Change Password Form */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">Change Password</h2>

                    <form onSubmit={handlePasswordSubmit}>
                        <div className="mb-4">
                            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                Current Password
                            </label>
                            <input
                                type="password"
                                id="currentPassword"
                                name="currentPassword"
                                value={passwordForm.currentPassword}
                                onChange={handlePasswordChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                New Password
                            </label>
                            <input
                                type="password"
                                id="newPassword"
                                name="newPassword"
                                value={passwordForm.newPassword}
                                onChange={handlePasswordChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                minLength="8"
                                required
                            />
                            <p className="mt-1 text-xs text-gray-500">Password must be at least 8 characters long</p>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={passwordForm.confirmPassword}
                                onChange={handlePasswordChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                        >
                            {isLoading ? 'Changing Password...' : 'Change Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
