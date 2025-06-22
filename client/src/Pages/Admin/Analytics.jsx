import { useState, useEffect } from 'react';
import Loading from '../../components/common/Loading';
import TaskStatusChart from '../../components/charts/TaskStatusChart';
import TaskPriorityChart from '../../components/charts/TaskPriorityChart';
import TaskTrendChart from '../../components/charts/TaskTrendChart';
import DepartmentPerformanceChart from '../../components/charts/DepartmentPerformanceChart';
import WorkloadDistributionChart from '../../components/charts/WorkloadDistributionChart';
import UserPerformanceTable from '../../components/charts/UserPerformanceTable';
import RecentTasksList from '../../components/lists/RecentTasksList';
import { analyticsService, taskService } from '../../services/api';
import { toast } from 'react-hot-toast';

const Analytics = () => {
    const [analyticsData, setAnalyticsData] = useState({
        tasksByStatus: {},
        tasksByPriority: {},
        overdueTasks: 0,
        taskCompletionRate: 0,
        userAssignments: [],
        taskTrend: [],
        departmentPerformance: {},
        workloadDistribution: [],
        userPerformance: [],
        recentTasks: []
    });
    const [loading, setLoading] = useState(true);
    const [animate, setAnimate] = useState(false);
    const [error, setError] = useState(null);

    // Fetch analytics data from API
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);

                // Get all tasks
                const tasksResponse = await taskService.getAllTasks();
                console.log('Tasks response:', tasksResponse);
                const tasks = tasksResponse.data?.tasks || [];

                // Get task statistics (status, priority counts, etc.)
                const statsResponse = await taskService.getTaskStats();
                console.log('Task stats response:', statsResponse);

                // Extract data from response based on actual structure
                const { statusStats = [], priorityStats = [], overdueTasks = [], userAssignmentStats = [] } =
                    statsResponse.data?.data?.stats || {};

                // Format status data
                const formattedStatusData = {};
                statusStats.forEach(item => {
                    if (item && item._id) {
                        formattedStatusData[item._id] = item.count || 0;
                    }
                });

                // Format priority data
                const formattedPriorityData = {};
                priorityStats.forEach(item => {
                    if (item && item._id) {
                        formattedPriorityData[item._id] = item.count || 0;
                    }
                });

                // Get task trends
                const trendResponse = await analyticsService.getTaskTrends('month', 6);
                console.log('Task trends response:', trendResponse);

                // Extract trend data based on actual response structure
                const { created = [], completed = [] } = trendResponse.data?.data || {};

                // Format trend data for chart
                const formattedTrendData = [];

                // Create a map of all unique month IDs from both arrays
                const monthIds = new Set();
                created.forEach(item => monthIds.add(item._id));
                completed.forEach(item => monthIds.add(item._id));

                // Convert to array and sort chronologically
                const sortedMonths = Array.from(monthIds).sort();

                // Build the formatted data array
                sortedMonths.forEach(monthId => {
                    // Find the corresponding data in created and completed arrays
                    const createdItem = created.find(item => item._id === monthId);
                    const completedItem = completed.find(item => item._id === monthId);

                    // Extract month name from month format like "2025-06" -> "Jun"
                    let month;
                    try {
                        month = new Date(`${monthId}-01`).toLocaleString('default', { month: 'short' });
                    } catch (e) {
                        // Fallback if date parsing fails
                        month = monthId;
                    }

                    formattedTrendData.push({
                        month,
                        created: createdItem ? createdItem.count : 0,
                        completed: completedItem ? completedItem.count : 0
                    });
                });

                try {
                    // Get department performance (with error handling)
                    const deptResponse = await analyticsService.getDepartmentPerformance();
                    console.log('Department performance response:', deptResponse);

                    // Get workload distribution (with error handling)
                    const workloadResponse = await analyticsService.getWorkloadDistribution();
                    console.log('Workload distribution response:', workloadResponse);

                    // Get user performance metrics (with error handling)
                    const perfResponse = await analyticsService.getUserPerformance();
                    console.log('User performance response:', perfResponse);

                    // Calculate completion rate from statusStats
                    const totalTasks = statusStats.reduce((sum, item) => sum + (item.count || 0), 0);
                    const completedTasks = statusStats.find(item => item._id === 'completed')?.count || 0;
                    const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

                    setAnalyticsData({
                        tasksByStatus: formattedStatusData,
                        tasksByPriority: formattedPriorityData,
                        overdueTasks: (overdueTasks[0]?.count) || 0,
                        taskCompletionRate,
                        userAssignments: userAssignmentStats || [],
                        taskTrend: formattedTrendData,
                        departmentPerformance: deptResponse.data?.data?.departments || {},
                        workloadDistribution: workloadResponse.data?.data?.workload || [],
                        userPerformance: perfResponse.data?.data?.performance || [],
                        recentTasks: tasks.slice(0, 5) // Get the 5 most recent tasks
                    });
                } catch (analyticsError) {
                    console.error('Error fetching additional analytics data:', analyticsError);

                    // Still set the basic data we have
                    const totalTasks = statusStats.reduce((sum, item) => sum + (item.count || 0), 0);
                    const completedTasks = statusStats.find(item => item._id === 'completed')?.count || 0;
                    const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

                    setAnalyticsData({
                        tasksByStatus: formattedStatusData,
                        tasksByPriority: formattedPriorityData,
                        overdueTasks: (overdueTasks[0]?.count) || 0,
                        taskCompletionRate,
                        userAssignments: userAssignmentStats || [],
                        taskTrend: formattedTrendData,
                        departmentPerformance: {},
                        workloadDistribution: [],
                        userPerformance: [],
                        recentTasks: tasks.slice(0, 5) // Get the 5 most recent tasks
                    });

                    toast.error('Some analytics data could not be loaded');
                }

            } catch (error) {
                console.error('Error fetching analytics data:', error);
                setError('Failed to load analytics data. Please try again later.');
                toast.error('Failed to load analytics data');
            } finally {
                setLoading(false);
                setTimeout(() => setAnimate(true), 100);
            }
        };

        fetchAllData();
    }, []);

    // Create a safe formatting function for user assignments
    const getFormattedUserAssignments = () => {
        if (!analyticsData.userAssignments || !Array.isArray(analyticsData.userAssignments)) {
            return [];
        }

        return analyticsData.userAssignments.map(item => ({
            name: item.name || 'Unknown User',
            count: item.count || 0,
            _id: item._id || ''
        }));
    };

    // Calculate deadlines approaching
    const calculateDeadlinesApproaching = () => {
        if (!analyticsData.recentTasks || !Array.isArray(analyticsData.recentTasks)) {
            return 0;
        }

        const today = new Date();
        const oneWeekFromNow = new Date();
        oneWeekFromNow.setDate(today.getDate() + 7);

        return analyticsData.recentTasks.filter(task => {
            if (task.status === 'completed' || task.status === 'archived') return false;

            const deadline = new Date(task.deadline);
            return deadline > today && deadline <= oneWeekFromNow;
        }).length;
    };

    if (loading) {
        return <Loading message="Loading analytics" />;
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-6">
                <div className="bg-red-500/20 border border-red-500 text-white p-4 rounded-md">
                    <p>{error}</p>
                    <button
                        className="mt-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-md transition-all"
                        onClick={() => window.location.reload()}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
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
                            {Object.values(analyticsData.tasksByStatus).reduce((sum, val) => sum + (val || 0), 0)}
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
                        <p className="text-3xl font-bold text-green-400 mt-2">{analyticsData.tasksByStatus.completed || 0}</p>
                        <div className="mt-2 text-sm text-gray-400">Successfully completed tasks</div>
                    </div>

                    <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-lg shadow-md border border-amber-500/30 transform transition-all duration-300 hover:shadow-amber-500/20 hover:-translate-y-1">
                        <div className="flex justify-between">
                            <h3 className="text-gray-400 text-sm font-medium">Deadlines Approaching</h3>
                            <div className="p-2 bg-amber-900/30 rounded-md">
                                <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-amber-400 mt-2">{calculateDeadlinesApproaching()}</p>
                        <div className="mt-2 text-sm text-gray-400">Due within 7 days</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Recent Tasks and Stats */}
                    <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-lg shadow-md border border-indigo-500/30">
                        <h3 className="font-semibold text-lg mb-4 text-white">Recent Tasks</h3>
                        <RecentTasksList tasks={analyticsData.recentTasks} />
                    </div>

                    <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-lg shadow-md border border-red-500/30">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-lg text-white">Overdue Tasks</h3>
                            <div className="px-3 py-1 bg-red-900/30 rounded-full text-red-400 text-sm font-medium">
                                {analyticsData.overdueTasks} Tasks
                            </div>
                        </div>
                        {analyticsData.overdueTasks > 0 ? (
                            <div className="space-y-4">
                                <div className="p-4 rounded-lg bg-gray-900/50 border border-gray-700">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center mr-3 text-white text-sm font-medium">
                                                !
                                            </div>
                                            <div>
                                                <p className="text-gray-300 text-sm">Some tasks are overdue and need immediate attention</p>
                                                <div className="mt-2 space-x-2">
                                                    <span className="inline-block px-2 py-1 bg-red-900/30 text-red-400 text-xs rounded-full">High Priority: {analyticsData.tasksByPriority.high || 0}</span>
                                                    <span className="inline-block px-2 py-1 bg-amber-900/30 text-amber-400 text-xs rounded-full">Medium Priority: {analyticsData.tasksByPriority.medium || 0}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <a href="/tasks" className="px-3 py-1 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-md text-sm transition-colors">
                                            View All
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-32">
                                <div className="text-center">
                                    <svg className="w-10 h-10 text-green-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="mt-2 text-gray-300">No overdue tasks! Everything is on schedule.</p>
                                </div>
                            </div>
                        )}
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-lg shadow-md border border-indigo-500/30">
                        <h3 className="font-semibold text-lg mb-4 text-white">Task Completion Trend</h3>
                        <div className="h-64">
                            <TaskTrendChart trendData={analyticsData.taskTrend} />
                        </div>
                    </div>

                    {Object.keys(analyticsData.departmentPerformance).length > 0 && (
                        <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-lg shadow-md border border-indigo-500/30">
                            <h3 className="font-semibold text-lg mb-4 text-white">Department Performance</h3>
                            <div className="h-64">
                                <DepartmentPerformanceChart departmentData={analyticsData.departmentPerformance} />
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {analyticsData.workloadDistribution.length > 0 && (
                        <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-lg shadow-md border border-indigo-500/30">
                            <h3 className="font-semibold text-lg mb-4 text-white">Team Workload Distribution</h3>
                            <div className="h-64">
                                <WorkloadDistributionChart workloadData={analyticsData.workloadDistribution} />
                            </div>
                        </div>
                    )}

                    <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-lg shadow-md border border-indigo-500/30">
                        <h3 className="font-semibold text-lg mb-4 text-white">Task Distribution by User</h3>
                        {getFormattedUserAssignments().length > 0 ? (
                            <div className="space-y-4">
                                {getFormattedUserAssignments().map((item, index) => (
                                    <div
                                        key={item._id || index}
                                        className="p-4 rounded-lg bg-gray-900/50 border border-gray-700 hover:border-indigo-500/30 transition-all duration-300"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center mr-3 text-white text-sm font-medium">
                                                    {item.name ? item.name.charAt(0) : "U"}
                                                </div>
                                                <span className="text-sm text-gray-300">{item.name}</span>
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
                                                    style={{ width: `${(item.count / (getFormattedUserAssignments()[0]?.count || 1)) * 100}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center">
                                <p className="text-gray-400">No user assignments data available</p>
                            </div>
                        )}
                    </div>
                </div>

                {analyticsData.userPerformance.length > 0 && (
                    <div className="grid grid-cols-1 gap-6">
                        <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-lg shadow-md border border-indigo-500/30">
                            <h3 className="font-semibold text-lg mb-4 text-white">User Performance Metrics</h3>
                            <UserPerformanceTable performanceData={analyticsData.userPerformance} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Analytics;
