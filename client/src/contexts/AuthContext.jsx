import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Create context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // State to hold user information
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is already logged in (on page refresh/initial load)
    useEffect(() => {
        // Get user from localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                // Parse stored user data
                const userObject = JSON.parse(storedUser);
                setCurrentUser(userObject);
            } catch (error) {
                console.error("Failed to parse stored user data:", error);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    // Derived property to check if user is admin
    const isAdmin = currentUser?.role === 'admin';

    // Login function - update context state with user info
    const login = async (userData) => {
        // Make sure we have valid user data
        if (!userData || typeof userData !== 'object') {
            throw new Error('Invalid user data provided');
        }

        setCurrentUser(userData);
        return userData;
    };

    // Logout function - clear user data
    const logout = () => {
        // Remove from context
        setCurrentUser(null);

        // Remove from localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('token');

        // Navigation will be handled by the component calling this function
    };

    // Get appropriate homepage based on user role
    const getHomePage = () => {
        if (!currentUser) return '/login';
        return isAdmin ? '/admin/dashboard' : '/dashboard';
    };

    // Context value
    const value = {
        currentUser,
        isAdmin,
        login,
        logout,
        loading,
        getHomePage
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth context
export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthContext;
