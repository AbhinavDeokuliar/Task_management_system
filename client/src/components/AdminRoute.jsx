import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminRoute = () => {
    const { currentUser, isAdmin, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    if (!isAdmin) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default AdminRoute;
