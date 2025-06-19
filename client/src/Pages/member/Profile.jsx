import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Loading from '../../components/common/Loading';

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
    const [animate, setAnimate] = useState(false);
    const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'password'

    useEffect(() => {
        if (currentUser) {
            setFormData({
                name: currentUser.name || '',
                email: currentUser.email || '',
                photo: currentUser.photo || '',
            });

            setTimeout(() => setAnimate(true), 100);
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

    if (!currentUser) {
        return <Loading message="Loading profile" />;
    }

    return (
        <div className="container mx-auto px-4 py-6 relative">
            {/* Decorative elements */}
            <div className="absolute top-10 right-1/4 w-3 h-3 bg-indigo-500 rounded-full opacity-20 animate-float"></div>
            <div className="absolute bottom-20 left-1/3 w-2 h-2 bg-purple-400 rounded-full opacity-30 animate-float-delayed"></div>

            <div className={`transition-all duration-700 transform ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <h1 className="text-3xl font-bold mb-8 text-white">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
                        My Profile
                    </span>
                </h1>

                <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg shadow-lg border border-indigo-500/30 overflow-hidden">
                    {/* Tab navigation */}
                    <div className="flex border-b border-gray-700">
                        <button
                            className={`px-6 py-4 text-sm font-medium ${activeTab === 'profile' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-gray-400 hover:text-gray-200'} transition-colors duration-200`}
                            onClick={() => setActiveTab('profile')}
                        >
                            Profile Information
                        </button>
                        <button
                            className={`px-6 py-4 text-sm font-medium ${activeTab === 'password' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-gray-400 hover:text-gray-200'} transition-colors duration-200`}
                            onClick={() => setActiveTab('password')}
                        >
                            Change Password
                        </button>
                    </div>

                    <div className="p-6">
                        {message.text && (
                            <div className={`mb-6 p-4 rounded-lg border ${message.type === 'success' ? 'bg-green-900/30 border-green-600 text-green-300' : 'bg-red-900/30 border-red-600 text-red-300'} animate-fade-in flex items-center`}>
                                {message.type === 'success' ? (
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                )}
                                {message.text}
                            </div>
                        )}

                        {activeTab === 'profile' ? (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                                    {/* Avatar preview */}
                                    <div className="lg:col-span-1">
                                        <div className="flex flex-col items-center">
                                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-4xl font-bold mb-3 shadow-lg border-2 border-indigo-300">
                                                {formData.name?.charAt(0) || 'U'}
                                            </div>
                                            <p className="text-gray-400 text-xs text-center">
                                                Update your profile info below
                                            </p>
                                        </div>
                                    </div>

                                    {/* Form fields */}
                                    <div className="lg:col-span-3 space-y-4">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                readOnly
                                                className="w-full px-4 py-3 border border-gray-700 rounded-md bg-gray-900 text-gray-400 cursor-not-allowed"
                                            />
                                            <p className="mt-1 text-xs text-gray-500">Email cannot be changed. Contact an administrator for assistance.</p>
                                        </div>

                                        <div>
                                            <label htmlFor="photo" className="block text-sm font-medium text-gray-300 mb-2">
                                                Profile Picture URL
                                            </label>
                                            <input
                                                type="text"
                                                id="photo"
                                                name="photo"
                                                value={formData.photo}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                            />
                                        </div>

                                        {/* Department and Position - Optional extras */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="department" className="block text-sm font-medium text-gray-300 mb-2">
                                                    Department
                                                </label>
                                                <input
                                                    type="text"
                                                    id="department"
                                                    name="department"
                                                    value={currentUser.department || "Development"}
                                                    disabled
                                                    className="w-full px-4 py-3 border border-gray-700 rounded-md bg-gray-900 text-gray-400 cursor-not-allowed"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="position" className="block text-sm font-medium text-gray-300 mb-2">
                                                    Position
                                                </label>
                                                <input
                                                    type="text"
                                                    id="position"
                                                    name="position"
                                                    value={currentUser.position || "Frontend Developer"}
                                                    disabled
                                                    className="w-full px-4 py-3 border border-gray-700 rounded-md bg-gray-900 text-gray-400 cursor-not-allowed"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-md shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 flex items-center"
                                    >
                                        {isLoading && (
                                            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        )}
                                        {isLoading ? 'Saving...' : 'Update Profile'}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={handlePasswordSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 gap-6 max-w-xl mx-auto">
                                    <div>
                                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300 mb-2">
                                            Current Password
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                            </div>
                                            <input
                                                type="password"
                                                id="currentPassword"
                                                name="currentPassword"
                                                value={passwordForm.currentPassword}
                                                onChange={handlePasswordChange}
                                                className="w-full pl-10 pr-4 py-3 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-2">
                                            New Password
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                                </svg>
                                            </div>
                                            <input
                                                type="password"
                                                id="newPassword"
                                                name="newPassword"
                                                value={passwordForm.newPassword}
                                                onChange={handlePasswordChange}
                                                className="w-full pl-10 pr-4 py-3 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                                minLength="8"
                                                required
                                            />
                                            <p className="mt-1 text-xs text-gray-500">Password must be at least 8 characters long</p>
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                                            Confirm New Password
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                </svg>
                                            </div>
                                            <input
                                                type="password"
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                value={passwordForm.confirmPassword}
                                                onChange={handlePasswordChange}
                                                className="w-full pl-10 pr-4 py-3 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <div className="p-4 bg-gray-900 rounded-md border border-gray-700">
                                            <h4 className="text-sm font-medium text-white mb-2">Password requirements:</h4>
                                            <ul className="list-disc list-inside text-xs text-gray-400 space-y-1">
                                                <li>Minimum 8 characters long</li>
                                                <li>Include at least one uppercase letter</li>
                                                <li>Include at least one number</li>
                                                <li>Include at least one special character</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-md shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 flex items-center"
                                    >
                                        {isLoading && (
                                            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        )}
                                        {isLoading ? 'Changing Password...' : 'Change Password'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
