import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is logged in (from localStorage or sessionStorage)
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    // Mock login function - replace with actual API call
    const login = async (email, password) => {
        try {
            // This would be an API call in a real application
            const mockResponse = {
                id: '1',
                name: email.includes('admin') ? 'Admin User' : 'Team Member',
                email,
                role: email.includes('admin') ? 'admin' : 'team_member',
                token: 'mock-jwt-token'
            };

            setCurrentUser(mockResponse);
            localStorage.setItem('user', JSON.stringify(mockResponse));
            return mockResponse;
        } catch (error) {
            console.error('Login error:', error);
            throw new Error('Invalid credentials');
        }
    };

    // Logout function
    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('user');
    };

    const value = {
        currentUser,
        isAdmin: currentUser?.role === 'admin',
        login,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthContext;
