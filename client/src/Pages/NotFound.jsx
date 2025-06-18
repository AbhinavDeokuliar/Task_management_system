import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const NotFound = () => {
    const { currentUser, isAdmin } = useAuth();

    const getHomeLink = () => {
        if (!currentUser) return '/login';
        return isAdmin ? '/admin/dashboard' : '/dashboard';
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-indigo-600">404</h1>
                <h2 className="text-3xl font-bold mt-4">Page Not Found</h2>
                <p className="mt-2 text-lg text-gray-600">
                    The page you are looking for doesn't exist or has been moved.
                </p>
                <div className="mt-6">
                    <Link
                        to={getHomeLink()}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Go back home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
