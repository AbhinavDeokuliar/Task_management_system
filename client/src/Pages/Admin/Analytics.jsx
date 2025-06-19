import { useState, useEffect } from 'react';
import Loading from '../../components/common/Loading';
import TaskStatusChart from '../../components/charts/TaskStatusChart';
import TaskPriorityChart from '../../components/charts/TaskPriorityChart';
import TaskTrendChart from '../../components/charts/TaskTrendChart';

const Analytics = () => {
    const [analyticsData, setAnalyticsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [animate, setAnimate] = useState(false);

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
                setTimeout(() => setAnimate(true), 100);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <Loading message="Loading analytics" />;
    }

    return (
        <div className="container mx-auto px-4 py-6 relative">
            {/* Decorative elements */}
            <div className="absolute top-20 right-20 w-3 h-3 bg-purple-500 rounded-full opacity-30 animate-float-slow"></div>
            <div className="absolute bottom-10 left-10 w-2 h-2 bg-indigo-400 rounded-full opacity-20 animate-float"></div>

            <div className={`transition-all duration-700 transform ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <h1 className="text-3xl font-bold mb-8 text-white">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
                        Analytics Dashboard
                    </span>
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Overview stats */}
                    <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-lg shadow-md border border-indigo-500/30 transform transition-all duration-300 hover:shadow-indigo-500/20 hover:-translate-y-1">
                        <div className="flex justify-between">
                            <h3 className="text-gray-400 text-sm font-medium">Task Completion Rate</h3>
                            <div className="p-2 bg-indigo-900/30 rounded-md">
                                <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                                </svg>
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-indigo-400 mt-2">{analyticsData.taskCompletionRate}%</p>
                        <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
                            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-1.5 rounded-full"
                                style={{ width: `${analyticsData.taskCompletionRate}%` }}></div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-lg shadow-md border border-indigo-500/30 transform transition-all duration-300 hover:shadow-indigo-500/20 hover:-translate-y-1">
                        <div className="flex justify-between">
                            <h3 className="text-gray-400 text-sm font-medium">Total Tasks</h3>
                            <div className="p-2 bg-indigo-900/30 rounded-md">
                                <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                                </svg>
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-white mt-2">
                            {Object.values(analyticsData.tasksByStatus).reduce((sum, val) => sum + val, 0)}
                        </p>
                        <div className="mt-2 text-sm text-gray-400">All tasks in the system</div>
                    </div>

                    <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-lg shadow-md border border-green-500/30 transform transition-all duration-300 hover:shadow-green-500/20 hover:-translate-y-1">
                        <div className="flex justify-between">
                            <h3 className="text-gray-400 text-sm font-medium">Completed Tasks</h3>
                            <div className="p-2 bg-green-900/30 rounded-md">
                                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-green-400 mt-2">{analyticsData.tasksByStatus.completed}</p>
                        <div className="mt-2 text-sm text-gray-400">Successfully completed tasks</div>
                    </div>

                    <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-lg shadow-md border border-red-500/30 transform transition-all duration-300 hover:shadow-red-500/20 hover:-translate-y-1">
                        <div className="flex justify-between">
                            <h3 className="text-gray-400 text-sm font-medium">Overdue Tasks</h3>
                            <div className="p-2 bg-red-900/30 rounded-md">
                                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-red-400 mt-2">{analyticsData.overdueTasks}</p>
                        <div className="mt-2 text-sm text-gray-400">Tasks past their deadline</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Charts */}
                    <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-lg shadow-md border border-indigo-500/30">
                        <h3 className="font-semibold text-lg mb-4 text-white">Tasks by Status</h3>
                        <div className="h-64">
                            <TaskStatusChart statusData={analyticsData.tasksByStatus} />
                        </div>
                    </div>

                    <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-lg shadow-md border border-indigo-500/30">
                        <h3 className="font-semibold text-lg mb-4 text-white">Tasks by Priority</h3>
                        <div className="h-64">
                            <TaskPriorityChart priorityData={analyticsData.tasksByPriority} />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-lg shadow-md border border-indigo-500/30">
                        <h3 className="font-semibold text-lg mb-4 text-white">Task Completion Trend</h3>
                        <div className="h-64">
                            <TaskTrendChart trendData={analyticsData.taskTrend} />
                        </div>
                    </div>

                    <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-lg shadow-md border border-indigo-500/30">
                        <h3 className="font-semibold text-lg mb-4 text-white">Task Distribution by User</h3>
                        <div className="space-y-4">
                            {analyticsData.userAssignments.map((item, index) => (
                                <div
                                    key={index}
                                    className="p-4 rounded-lg bg-gray-900/50 border border-gray-700 hover:border-indigo-500/30 transition-all duration-300"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center mr-3 text-white text-sm font-medium">
                                                {item.user.charAt(0)}
                                            </div>
                                            <span className="text-sm text-gray-300">{item.user}</span>
                                        </div>
                                        <div className="flex items-center bg-indigo-900/30 px-3 py-1 rounded-full">
                                            <svg className="w-4 h-4 text-indigo-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                                            </svg>
                                            <span className="text-sm font-medium text-indigo-300">{item.count}</span>
                                        </div>
                                    </div>

                                    <div className="mt-2">
                                        <div className="text-xs text-gray-400 mb-1">Assigned tasks</div>
                                        <div className="w-full bg-gray-700 rounded-full h-1.5">
                                            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-1.5 rounded-full"
                                                style={{ width: `${(item.count / 15) * 100}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="text-center mt-2">
                                <button className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors duration-150">
                                    View Full Assignment Report →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
