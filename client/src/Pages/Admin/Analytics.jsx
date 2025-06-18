import { useState, useEffect } from 'react';

const Analytics = () => {
    const [analyticsData, setAnalyticsData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch analytics data - in a real app, this would be an API call
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Mock data
                setAnalyticsData({
                    tasksByStatus: {
                        pending: 12,
                        in_progress: 8,
                        completed: 36,
                        archived: 5
                    },
                    tasksByPriority: {
                        low: 15,
                        medium: 24,
                        high: 22
                    },
                    overdueTasks: 3,
                    taskCompletionRate: 72, // percentage
                    userAssignments: [
                        { user: 'John Doe', count: 8 },
                        { user: 'Jane Smith', count: 12 },
                        { user: 'Robert Johnson', count: 15 }
                    ],
                    taskTrend: [
                        { month: 'Jan', completed: 5, created: 8 },
                        { month: 'Feb', completed: 7, created: 6 },
                        { month: 'Mar', completed: 10, created: 9 },
                        { month: 'Apr', completed: 8, created: 12 },
                        { month: 'May', completed: 12, created: 10 },
                        { month: 'Jun', completed: 14, created: 11 }
                    ]
                });
            } catch (error) {
                console.error('Error fetching analytics data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="h-full flex items-center justify-center">Loading analytics...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Overview stats */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-gray-500 text-sm font-medium">Task Completion Rate</h3>
                    <p className="text-3xl font-bold text-indigo-600">{analyticsData.taskCompletionRate}%</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-gray-500 text-sm font-medium">Total Tasks</h3>
                    <p className="text-3xl font-bold">
                        {Object.values(analyticsData.tasksByStatus).reduce((sum, val) => sum + val, 0)}
                    </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-gray-500 text-sm font-medium">Completed Tasks</h3>
                    <p className="text-3xl font-bold text-green-500">{analyticsData.tasksByStatus.completed}</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-gray-500 text-sm font-medium">Overdue Tasks</h3>
                    <p className="text-3xl font-bold text-red-500">{analyticsData.overdueTasks}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Charts - in a real app, these would be actual chart components */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-semibold text-lg mb-4">Tasks by Status</h3>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                        [Status Chart Placeholder]
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-semibold text-lg mb-4">Tasks by Priority</h3>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                        [Priority Chart Placeholder]
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-semibold text-lg mb-4">Task Completion Trend</h3>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                        [Trend Chart Placeholder]
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-semibold text-lg mb-4">Task Distribution by User</h3>
                    <div className="h-64 overflow-y-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Tasks</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {analyticsData.userAssignments.map((item, index) => (
                                    <tr key={index}>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.user}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.count}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
