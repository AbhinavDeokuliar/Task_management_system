const Header = ({ user }) => {
    return (
        <header className="bg-white shadow-sm px-6 py-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-medium text-gray-700">
                        Welcome, {user?.name || 'User'}
                    </h2>
                    <p className="text-sm text-gray-500">
                        {user?.role === 'admin' ? 'Administrator' : 'Team Member'}
                    </p>
                </div>

                <div className="flex items-center space-x-4">
                    {/* Notifications bell icon could go here */}
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
