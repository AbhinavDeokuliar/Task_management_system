import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = () => {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
