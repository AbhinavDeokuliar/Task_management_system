import { useState, useEffect } from 'react';

const Header = ({ user }) => {
    const [showHeader, setShowHeader] = useState(false);
    const [notifications, setNotifications] = useState(3); // Demo notification count

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowHeader(true);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    return (
        <header className={`bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg px-6 py-4 border-b border-indigo-500/30 transition-all duration-500 transform ${showHeader ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            <div className="flex items-center justify-between">
                <div className="transition-all duration-300 transform hover:translate-x-1">
                    <h2 className="text-lg font-medium text-white">
                        Welcome, <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">{user?.name || 'User'}</span>
                    </h2>
                    <p className="text-sm text-gray-300">
                        {user?.role === 'admin' ? 'Administrator' : 'Team Member'} • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                    </p>
                </div>

                <div className="flex items-center space-x-4">
                    {/* Notifications bell icon */}
                    <div className="relative transition-transform duration-200 hover:scale-110 cursor-pointer group">
                        <svg className="w-6 h-6 text-gray-300 group-hover:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        {notifications > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center animate-pulse">
                                {notifications}
                            </span>
                        )}
                    </div>

                    {/* User avatar */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-md border-2 border-indigo-300 transition-transform duration-200 hover:scale-110 cursor-pointer">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
