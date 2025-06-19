// Import necessary dependencies from React and React Router
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// Import the authentication context
import { useAuth } from '../../contexts/AuthContext';
// Import the API service
import { authService } from '../../services/api';

// Login component definition
const Login = () => {
    // State variables for form fields and UI states
    const [email, setEmail] = useState(''); // State for email input
    const [password, setPassword] = useState(''); // State for password input
    const [error, setError] = useState(''); // State for error messages
    const [loading, setLoading] = useState(false); // State for loading status
    const [showForm, setShowForm] = useState(false); // State for form animation

    // Get login function from auth context
    const { login } = useAuth();
    // Get navigate function for redirection
    const navigate = useNavigate();

    // Animation effect - show form with delay for elegant entrance
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowForm(true);
        }, 300);

        return () => clearTimeout(timer);
    }, []);

    // Form submission handler
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        try {
            // Reset error message and set loading state
            setError('');
            setLoading(true);

            // Call the login API service
            const response = await authService.login(email, password);

            console.log('Login response:', response); // Add this to debug the response structure

            // Check if response contains token
            if (!response.token) {
                throw new Error('Authentication failed: No token received');
            }

            // Store token in localStorage
            localStorage.setItem('token', response.token);

            // Extract user data based on response structure
            const user = response.data?.user || response.user;
            if (!user) {
                throw new Error('Authentication failed: No user data received');
            }

            // Store user data
            localStorage.setItem('user', JSON.stringify(user));

            // Use the auth context to update the application state
            await login(user);

            // Redirect based on user role
            if (user.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            // Handle login failure with specific error messages
            console.error("Login error:", err);

            if (err.response?.status === 401) {
                setError('Incorrect email or password. Please try again.');
            } else if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err.message) {
                setError(err.message);
            } else {
                setError('Login failed. Please check your connection and try again.');
            }
        } finally {
            // Reset loading state regardless of outcome
            setLoading(false);
        }
    };

    // Component UI rendering
    return (
        // Main container with full height and background
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background pattern overlay */}
            <div className="absolute inset-0 z-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%239C92AC' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                    backgroundSize: '20px 20px'
                }}>
                </div>
            </div>

            {/* Login form container */}
            <div className={`max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-xl shadow-lg z-10 transform transition-all duration-500 ${showForm ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                {/* Heading and logo */}
                <div>
                    <h1 className="text-center text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 drop-shadow-md">
                        Task Management System
                    </h1>
                    <h2 className="mt-4 text-center text-sm text-gray-400">
                        Log in to your account to continue
                    </h2>
                </div>

                {/* Error alert (conditional rendering) with animation */}
                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded relative animate-fade-in" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                {/* Login form */}
                <form className="mt-10 space-y-4" onSubmit={handleSubmit}>
                    {/* Input fields container */}
                    <div className="rounded-md shadow-sm -space-y-px">
                        {/* Email input field */}
                        <div className="mb-4">
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-700 placeholder-gray-400 text-white bg-gray-800 rounded-t-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all duration-300"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        {/* Password input field */}
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-700 placeholder-gray-400 text-white bg-gray-800 rounded-b-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all duration-300"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Submit button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                        >
                            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                <svg className="h-5 w-5 text-indigo-300 group-hover:text-indigo-200 transition ease-in-out duration-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                            </span>
                            {loading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </span>
                            ) : 'Sign in'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Export the component
export default Login;

