import { useState, useEffect } from 'react';
import Loading from '../../components/common/Loading';
import TaskStatusChart from '../../components/charts/TaskStatusChart';
import TaskPriorityChart from '../../components/charts/TaskPriorityChart';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalTasks: 0,
        pendingTasks: 0,
        completedTasks: 0,
        overdueTasks: 0,
        totalUsers: 0
    });

    const [loading, setLoading] = useState(true);
    const [animate, setAnimate] = useState(false);

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
                    overdueTasks: 2,
                    totalUsers: 15
                });
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
                setTimeout(() => setAnimate(true), 100);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <Loading message="Loading dashboard" />;
    }

    // Mock data for charts
    const mockStatusData = {
        pending: stats.pendingTasks,
        in_progress: 10,
        completed: stats.completedTasks,
        archived: 2
    };

    const mockPriorityData = {
        high: 15,
        medium: 22,
        low: 11
    };

    // Activity data
    const activities = [
        { user: 'John Doe', action: 'completed task', item: 'Fix login bug', time: '2 hours ago' },
        { user: 'Jane Smith', action: 'created task', item: 'Update dashboard UI', time: '3 hours ago' },
        { user: 'Robert Johnson', action: 'assigned task', item: 'API integration', time: '5 hours ago' },
        { user: 'Admin', action: 'added new user', item: 'Emily White', time: '1 day ago' }
    ];

    return (
        <div className="container mx-auto px-4 py-6 relative">
            {/* Decorative elements */}
            <div className="absolute top-10 right-10 w-3 h-3 bg-indigo-500 rounded-full opacity-30 animate-float"></div>
            <div className="absolute bottom-20 left-20 w-2 h-2 bg-purple-400 rounded-full opacity-20 animate-float-delayed"></div>

            <div className={`transition-all duration-700 transform ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <h1 className="text-3xl font-bold mb-8 text-white">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
                        Admin Dashboard
                    </span>
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Stats cards */}
                    <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-lg shadow-md border border-indigo-500/30 transform transition-all duration-300 hover:shadow-indigo-500/20 hover:-translate-y-1">
                        <div className="flex justify-between">
                            <h3 className="text-gray-400 text-sm font-medium">Total Tasks</h3>
                            <div className="p-2 bg-indigo-900/30 rounded-md">
                                <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-white mt-2">{stats.totalTasks}</p>
                        <div className="mt-2 text-sm text-gray-400">All tasks in the system</div>
                    </div>

                    <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-lg shadow-md border border-yellow-500/30 transform transition-all duration-300 hover:shadow-yellow-500/20 hover:-translate-y-1">
                        <div className="flex justify-between">
                            <h3 className="text-gray-400 text-sm font-medium">Pending Tasks</h3>
                            <div className="p-2 bg-yellow-900/30 rounded-md">
                                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-yellow-400 mt-2">{stats.pendingTasks}</p>
                        <div className="mt-2 text-sm text-gray-400">Tasks awaiting action</div>
                    </div>

                    <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-lg shadow-md border border-green-500/30 transform transition-all duration-300 hover:shadow-green-500/20 hover:-translate-y-1">
                        <div className="flex justify-between">
                            <h3 className="text-gray-400 text-sm font-medium">Completed Tasks</h3>
                            <div className="p-2 bg-green-900/30 rounded-md">
                                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-green-400 mt-2">{stats.completedTasks}</p>
                        <div className="mt-2 text-sm text-gray-400">Successfully completed tasks</div>
                    </div>

                    <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-lg shadow-md border border-red-500/30 transform transition-all duration-300 hover:shadow-red-500/20 hover:-translate-y-1">
                        <div className="flex justify-between">
                            <h3 className="text-gray-400 text-sm font-medium">Overdue Tasks</h3>
                            <div className="p-2 bg-red-900/30 rounded-md">
                                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                                </svg>
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-red-400 mt-2">{stats.overdueTasks}</p>
                        <div className="mt-2 text-sm text-gray-400">Tasks past their deadline</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Charts */}
                    <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-lg shadow-md border border-indigo-500/30">
                        <h3 className="font-semibold text-lg mb-4 text-white">Task Status Distribution</h3>
                        <div className="h-64">
                            <TaskStatusChart statusData={mockStatusData} />
                        </div>
                    </div>

                    <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-lg shadow-md border border-indigo-500/30">
                        <h3 className="font-semibold text-lg mb-4 text-white">Task Priority Distribution</h3>
                        <div className="h-64">
                            <TaskPriorityChart priorityData={mockPriorityData} />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent activity */}
                    <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-lg shadow-md border border-indigo-500/30">
                        <h3 className="font-semibold text-lg mb-4 text-white">Recent Activity</h3>
                        <div className="space-y-4">
                            {activities.map((activity, index) => (
                                <div
                                    key={index}
                                    className="flex items-start p-3 rounded-lg bg-gray-900/50 border border-gray-700 hover:border-indigo-500/30 transition-all duration-300"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center mr-3 text-white text-sm font-medium">
                                        {activity.user.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm text-gray-300">
                                            <span className="font-medium text-white">{activity.user}</span> {activity.action} <span className="text-indigo-400">"{activity.item}"</span>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">{activity.time}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Team stats */}
                    <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-lg shadow-md border border-indigo-500/30">
                        <h3 className="font-semibold text-lg mb-4 text-white">Team Performance</h3>
                        <div className="space-y-4">
                            <div className="p-4 rounded-lg bg-gray-900/50 border border-gray-700">
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm text-gray-300">John Doe</span>
                                    <span className="text-sm text-green-400">92%</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-2.5">
                                    <div className="bg-gradient-to-r from-green-500 to-green-600 h-2.5 rounded-full" style={{ width: '92%' }}></div>
                                </div>
                            </div>

                            <div className="p-4 rounded-lg bg-gray-900/50 border border-gray-700">
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm text-gray-300">Jane Smith</span>
                                    <span className="text-sm text-green-400">78%</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-2.5">
                                    <div className="bg-gradient-to-r from-green-500 to-green-600 h-2.5 rounded-full" style={{ width: '78%' }}></div>
                                </div>
                            </div>

                            <div className="p-4 rounded-lg bg-gray-900/50 border border-gray-700">
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm text-gray-300">Robert Johnson</span>
                                    <span className="text-sm text-yellow-400">65%</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-2.5">
                                    <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                                </div>
                            </div>

                            <div className="text-center mt-6">
                                <button className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors duration-150">
                                    View Full Team Report →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
