import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Loading from '../../components/common/Loading';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';

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
    const [animate, setAnimate] = useState(false);

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
                setTimeout(() => setAnimate(true), 100);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <Loading message="Loading dashboard" />;
    }

    const formatDate = (dateString) => {
        if (!dateString) return '';

        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="container mx-auto px-4 py-6 relative">
            {/* Decorative elements */}
            <div className="absolute top-10 left-1/4 w-3 h-3 bg-indigo-500 rounded-full opacity-20 animate-float"></div>
            <div className="absolute bottom-20 right-1/3 w-2 h-2 bg-purple-400 rounded-full opacity-30 animate-float-delayed"></div>
            <div className="absolute top-1/3 right-1/4 w-4 h-4 bg-indigo-400 rounded-full opacity-10 animate-float-slow"></div>

            <div className={`transition-all duration-700 transform ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <h1 className="text-3xl font-bold mb-8 text-white">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
                        My Dashboard
                    </span>
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
                    <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-lg shadow-md border border-indigo-500/30 transform transition-all duration-300 hover:shadow-indigo-500/20 hover:-translate-y-1">
                        <div className="flex justify-between">
                            <h3 className="text-gray-400 text-sm font-medium">Total Tasks</h3>
                            <div className="p-2 bg-indigo-900/30 rounded-md">
                                <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                                </svg>
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-white mt-2">{stats.totalAssigned}</p>
                    </div>

                    <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-lg shadow-md border border-yellow-500/30 transform transition-all duration-300 hover:shadow-yellow-500/20 hover:-translate-y-1">
                        <div className="flex justify-between">
                            <h3 className="text-gray-400 text-sm font-medium">Pending</h3>
                            <div className="p-2 bg-yellow-900/30 rounded-md">
                                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-yellow-400 mt-2">{stats.pending}</p>
                    </div>

                    <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-lg shadow-md border border-blue-500/30 transform transition-all duration-300 hover:shadow-blue-500/20 hover:-translate-y-1">
                        <div className="flex justify-between">
                            <h3 className="text-gray-400 text-sm font-medium">In Progress</h3>
                            <div className="p-2 bg-blue-900/30 rounded-md">
                                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                </svg>
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-blue-400 mt-2">{stats.inProgress}</p>
                    </div>

                    <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-lg shadow-md border border-green-500/30 transform transition-all duration-300 hover:shadow-green-500/20 hover:-translate-y-1">
                        <div className="flex justify-between">
                            <h3 className="text-gray-400 text-sm font-medium">Completed</h3>
                            <div className="p-2 bg-green-900/30 rounded-md">
                                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-green-400 mt-2">{stats.completed}</p>
                    </div>

                    <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-lg shadow-md border border-red-500/30 transform transition-all duration-300 hover:shadow-red-500/20 hover:-translate-y-1">
                        <div className="flex justify-between">
                            <h3 className="text-gray-400 text-sm font-medium">Overdue</h3>
                            <div className="p-2 bg-red-900/30 rounded-md">
                                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                                </svg>
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-red-400 mt-2">{stats.overdue}</p>
                    </div>
                </div>

                <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg shadow-md border border-indigo-500/30" style={{ animationDelay: '0.2s' }}>
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
                        <h2 className="text-xl font-semibold text-white">Recent Tasks</h2>
                        <Link to="/tasks" className="text-indigo-400 hover:text-indigo-300 transition-colors duration-200 flex items-center group">
                            View all tasks
                            <svg className="w-4 h-4 ml-1 transform transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead className="bg-gray-900/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">Task</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">Priority</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">Deadline</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {recentTasks.map((task, index) => (
                                    <tr
                                        key={task.id}
                                        className="hover:bg-gray-800/50 transition-colors duration-150"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-white">{task.title}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <StatusBadge status={task.status} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <PriorityBadge priority={task.priority} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-300">{formatDate(task.deadline)}</div>
                                            <div className="text-sm">
                                                {task.isOverdue ? (
                                                    <span className="text-red-400">Overdue</span>
                                                ) : task.status === 'completed' ? (
                                                    <span className="text-green-400">Completed</span>
                                                ) : (
                                                    <span className="text-indigo-300">{task.daysRemaining} days left</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <Link
                                                to={`/tasks/${task.id}`}
                                                className="text-indigo-400 hover:text-indigo-300 transition-colors duration-200 flex items-center group"
                                            >
                                                View details
                                                <svg className="w-4 h-4 ml-1 opacity-0 transform transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                                </svg>
                                            </Link>
                                        </td>
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

export default MemberDashboard;
