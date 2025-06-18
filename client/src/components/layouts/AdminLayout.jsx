import { Outlet } from 'react-router-dom';
import Sidebar from '../navigation/Sidebar';
import Header from '../navigation/Header';
import { useAuth } from '../../contexts/AuthContext';

const AdminLayout = () => {
    const { currentUser } = useAuth();

    const adminNavItems = [
        { title: 'Dashboard', path: '/admin/dashboard' },
        { title: 'Task Management', path: '/admin/tasks' },
        { title: 'User Management', path: '/admin/users' },
        { title: 'Analytics', path: '/admin/analytics' },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar navItems={adminNavItems} />

            <div className="flex flex-col flex-1 overflow-hidden">
                <Header user={currentUser} />

                <main className="flex-1 overflow-y-auto p-4">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
