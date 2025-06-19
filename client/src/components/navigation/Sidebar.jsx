import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ navItems }) => {
    const { logout } = useAuth();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 150);

        return () => clearTimeout(timer);
    }, []);

    const handleLogout = () => {
        // Small animation before logout
        setIsVisible(false);
        setTimeout(() => {
            logout();
        }, 300);
    };

    return (
        <div className={`w-64 bg-gradient-to-b from-gray-900 to-indigo-900 text-white p-4 flex flex-col h-full shadow-lg transition-all duration-500 transform ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
            <div className="py-6 text-center relative">
                <div className="absolute top-1 left-1 w-2 h-2 bg-indigo-400 rounded-full opacity-60 animate-float-delayed"></div>
                <div className="absolute top-2 right-4 w-1.5 h-1.5 bg-purple-400 rounded-full opacity-70 animate-float-slow"></div>

                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-purple-400 to-indigo-300">Task Manager</h1>
                <div className="mt-1 h-0.5 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
            </div>

            <nav className="flex-1 mt-6">
                <ul className="space-y-2">
                    {navItems.map((item, index) => (
                        <li key={item.path} style={{ animationDelay: `${index * 100}ms` }} className="animate-fade-in-up">
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center p-3 rounded-lg transition-all duration-300 ${isActive
                                        ? 'bg-gradient-to-r from-indigo-700 to-indigo-900 text-white shadow-md'
                                        : 'text-indigo-100 hover:bg-indigo-800/50 hover:transform hover:translate-x-1'
                                    }`
                                }
                            >
                                {item.icon && <span className="mr-3">{item.icon}</span>}
                                {item.title}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="mt-auto pt-4 border-t border-indigo-700/50">
                <button
                    onClick={handleLogout}
                    className="w-full py-3 text-indigo-200 hover:text-white transition-all duration-300 flex items-center justify-center group hover:bg-indigo-700/30 rounded-lg"
                >
                    <svg className="h-5 w-5 mr-2 text-indigo-400 group-hover:text-white transition-all duration-300 transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
