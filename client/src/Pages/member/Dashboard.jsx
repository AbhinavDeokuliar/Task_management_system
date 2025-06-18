import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const MemberDashboard = () => {
    const [stats, setStats] = useState({
        totalAssigned: 0,
        pending: 0,
        inProgress: 0,
        completed: 0,
        overdue: 0
    });

    const [recentTasks, setRecentTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch dashboard data - in a real app, this would be an API call
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 800));

                // Mock data
                setStats({
                    totalAssigned: 12,
                    pending: 4,
                    inProgress: 5,
                    completed: 3,
                    overdue: 1
                });

                setRecentTasks([
                    {
                        id: '1',
                        title: 'Complete frontend for user profile',
                        status: 'in_progress',
                        priority: 'high',
                        deadline: '2025-07-05',
                        isOverdue: false,
                        daysRemaining: 5
                    },
                    {
                        id: '2',
                        title: 'Fix navigation menu issues',
                        status: 'pending',
                        priority: 'medium',
                        deadline: '2025-07-08',
                        isOverdue: false,
                        daysRemaining: 8
                    },
                    {
                        id: '3',
                        title: 'Review API documentation',
                        status: 'completed',
                        priority: 'low',
                        deadline: '2025-06-28',
                        isOverdue: false,
                        daysRemaining: 0
                    }
                ]);
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

    const getPriorityClass = (priority) => {
        switch (priority) {
            case 'high':
                return 'bg-red-100 text-red-800';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800';
            case 'low':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'in_progress':
                return 'bg-blue-100 text-blue-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-gray-500 text-sm font-medium">Total Tasks</h3>
                    <p className="text-3xl font-bold">{stats.totalAssigned}</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-gray-500 text-sm font-medium">Pending</h3>
                    <p className="text-3xl font-bold text-yellow-500">{stats.pending}</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-gray-500 text-sm font-medium">In Progress</h3>
                    <p className="text-3xl font-bold text-blue-500">{stats.inProgress}</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-gray-500 text-sm font-medium">Completed</h3>
                    <p className="text-3xl font-bold text-green-500">{stats.completed}</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-gray-500 text-sm font-medium">Overdue</h3>
                    <p className="text-3xl font-bold text-red-500">{stats.overdue}</p>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md">
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h2 className="text-xl font-semibold">Recent Tasks</h2>
                    <Link to="/tasks" className="text-indigo-600 hover:text-indigo-800">View all tasks</Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {recentTasks.map((task) => (
                                <tr key={task.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{task.title}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(task.status)}`}>
                                            {task.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityClass(task.priority)}`}>
                                            {task.priority}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{task.deadline}</div>
                                        <div className="text-sm text-gray-500">
                                            {task.isOverdue ? (
                                                <span className="text-red-600">Overdue</span>
                                            ) : task.status === 'completed' ? (
                                                <span className="text-green-600">Completed</span>
                                            ) : (
                                                <span>{task.daysRemaining} days left</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <Link to={`/tasks/${task.id}`} className="text-indigo-600 hover:text-indigo-900">View details</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MemberDashboard;
