import { Outlet } from 'react-router-dom';
import Sidebar from '../navigation/Sidebar';
import Header from '../navigation/Header';
import { useAuth } from '../../contexts/AuthContext';

const MemberLayout = () => {
    const { currentUser } = useAuth();

    const memberNavItems = [
        { title: 'Dashboard', path: '/dashboard' },
        { title: 'My Tasks', path: '/tasks' },
        { title: 'Calendar', path: '/calendar' },
        { title: 'Profile', path: '/profile' },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar navItems={memberNavItems} />

            <div className="flex flex-col flex-1 overflow-hidden">
                <Header user={currentUser} />

                <main className="flex-1 overflow-y-auto p-4">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MemberLayout;
