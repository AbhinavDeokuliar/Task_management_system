import { useState, useEffect } from 'react';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalTasks: 0,
        pendingTasks: 0,
        completedTasks: 0,
        overdueTask: 0,
        totalUsers: 0
    });

    const [loading, setLoading] = useState(true);

    // Fetch dashboard data - in a real app, this would be an API call
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 800));

                // Mock data
                setStats({
                    totalTasks: 48,
                    pendingTasks: 12,
                    completedTasks: 36,
                    overdueTask: 2,
                    totalUsers: 15
                });
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="h-full flex items-center justify-center">Loading dashboard...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Stats cards */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-gray-500 text-sm font-medium">Total Tasks</h3>
                    <p className="text-3xl font-bold">{stats.totalTasks}</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-gray-500 text-sm font-medium">Pending Tasks</h3>
                    <p className="text-3xl font-bold text-yellow-500">{stats.pendingTasks}</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-gray-500 text-sm font-medium">Completed Tasks</h3>
                    <p className="text-3xl font-bold text-green-500">{stats.completedTasks}</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-gray-500 text-sm font-medium">Overdue Tasks</h3>
                    <p className="text-3xl font-bold text-red-500">{stats.overdueTask}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent activity chart placeholder */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-semibold text-lg mb-4">Recent Activity</h3>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                        [Activity Chart Placeholder]
                    </div>
                </div>

                {/* Team performance chart placeholder */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-semibold text-lg mb-4">Team Performance</h3>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                        [Performance Chart Placeholder]
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
