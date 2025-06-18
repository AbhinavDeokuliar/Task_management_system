import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ navItems }) => {
    const { logout } = useAuth();

    return (
        <div className="w-64 bg-indigo-700 text-white p-4 flex flex-col h-full">
            <div className="py-4 text-center">
                <h1 className="text-2xl font-bold">Task Manager</h1>
            </div>

            <nav className="flex-1 mt-6">
                <ul className="space-y-2">
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center p-3 rounded-lg transition-colors ${isActive
                                        ? 'bg-indigo-800 text-white'
                                        : 'text-indigo-100 hover:bg-indigo-600'
                                    }`
                                }
                            >
                                {item.title}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="mt-auto pt-4 border-t border-indigo-600">
                <button
                    onClick={logout}
                    className="w-full py-3 text-indigo-200 hover:text-white transition-colors flex items-center justify-center"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
