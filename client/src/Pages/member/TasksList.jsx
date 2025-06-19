import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import Loading from '../../components/common/Loading';
import Pagination from '../../components/common/Pagination';
import useTasks from '../../hooks/useTasks';
import { formatDate, getDaysRemaining } from '../../utils/formatDate';

const TasksList = () => {
    const [filter, setFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState('deadline');
    const [sortDirection, setSortDirection] = useState('asc');
    const [animate, setAnimate] = useState(false);

    const { tasks, loading, error, refreshTasks, updateTaskStatus } = useTasks();
    const tasksPerPage = 5;

    useEffect(() => {
        if (!loading) {
            setTimeout(() => setAnimate(true), 100);
        }
    }, [loading]);

    // Filter tasks based on current filters and search term
    const filteredTasks = tasks.filter((task) => {
        // Filter by status
        if (filter !== 'all' && task.status !== filter) return false;

        // Filter by priority
        if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;

        // Filter by search term
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            return (
                task.title.toLowerCase().includes(term) ||
                (task.description && task.description.toLowerCase().includes(term)) ||
                (task.tags && task.tags.some(tag => tag.toLowerCase().includes(term)))
            );
        }

        return true;
    });

    // Sort tasks
    const sortedTasks = [...filteredTasks].sort((a, b) => {
        let comparison = 0;

        switch (sortBy) {
            case 'title':
                comparison = a.title.localeCompare(b.title);
                break;
            case 'priority':
                const priorityOrder = { high: 0, medium: 1, low: 2 };
                comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
                break;
            case 'status':
                const statusOrder = {
                    pending: 0,
                    in_progress: 1,
                    completed: 2,
                    archived: 3
                };
                comparison = statusOrder[a.status] - statusOrder[b.status];
                break;
            case 'deadline':
                const aDate = a.deadline ? new Date(a.deadline) : new Date(8640000000000000);
                const bDate = b.deadline ? new Date(b.deadline) : new Date(8640000000000000);
                comparison = aDate - bDate;
                break;
            default:
                comparison = 0;
        }

        return sortDirection === 'asc' ? comparison : -comparison;
    });

    // Paginate tasks
    const totalPages = Math.ceil(sortedTasks.length / tasksPerPage);
    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = sortedTasks.slice(indexOfFirstTask, indexOfLastTask);

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filter, priorityFilter, searchTerm, sortBy, sortDirection]);

    const handleSort = (column) => {
        if (sortBy === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortDirection('asc');
        }
    };

    const handleStatusChange = async (taskId, newStatus) => {
        await updateTaskStatus(taskId, newStatus);
    };

    if (loading) {
        return <Loading message="Loading tasks" />;
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-6 bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg border border-red-500/30 shadow-lg">
                <div className="p-4 mb-4 text-center">
                    <svg className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                    <p className="text-lg text-red-300 mb-4">{error}</p>
                    <button
                        onClick={refreshTasks}
                        className="mt-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2 rounded hover:-translate-y-1 transform transition-transform duration-200"
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
            <div className="absolute top-20 left-1/3 w-3 h-3 bg-indigo-500 rounded-full opacity-20 animate-float"></div>
            <div className="absolute bottom-10 right-1/4 w-2 h-2 bg-purple-400 rounded-full opacity-30 animate-float-delayed"></div>

            <div className={`transition-all duration-700 transform ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <h1 className="text-3xl font-bold mb-6 text-white">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
                        My Tasks
                    </span>
                </h1>

                <div className="mb-6 bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg p-4 border border-indigo-500/30 shadow-lg">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <div>
                                <label htmlFor="status-filter" className="block text-sm font-medium text-gray-300 mb-1">
                                    Status Filter
                                </label>
                                <select
                                    id="status-filter"
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                    className="block w-full py-2 px-3 border border-gray-700 bg-gray-900 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 sm:text-sm"
                                >
                                    <option value="all">All Tasks</option>
                                    <option value="pending">Pending</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="priority-filter" className="block text-sm font-medium text-gray-300 mb-1">
                                    Priority Filter
                                </label>
                                <select
                                    id="priority-filter"
                                    value={priorityFilter}
                                    onChange={(e) => setPriorityFilter(e.target.value)}
                                    className="block w-full py-2 px-3 border border-gray-700 bg-gray-900 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 sm:text-sm"
                                >
                                    <option value="all">All Priorities</option>
                                    <option value="high">High</option>
                                    <option value="medium">Medium</option>
                                    <option value="low">Low</option>
                                </select>
                            </div>
                        </div>

                        <div className="w-full md:w-1/3">
                            <label htmlFor="search" className="block text-sm font-medium text-gray-300 mb-1">
                                Search Tasks
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="search"
                                    placeholder="Search by title, description, or tags"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="block w-full py-2 pl-10 pr-3 border border-gray-700 bg-gray-900 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 sm:text-sm"
                                />
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {tasks.length === 0 ? (
                    <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-10 rounded-lg shadow-md border border-indigo-500/30 text-center">
                        <svg className="h-16 w-16 text-indigo-400 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <h3 className="text-lg font-medium text-white">No tasks assigned</h3>
                        <p className="mt-2 text-gray-400">You don't have any assigned tasks yet.</p>
                    </div>
                ) : filteredTasks.length === 0 ? (
                    <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-10 rounded-lg shadow-md border border-indigo-500/30 text-center">
                        <svg className="h-16 w-16 text-gray-400 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                        <h3 className="text-lg font-medium text-white">No matching tasks</h3>
                        <p className="mt-2 text-gray-400">Try adjusting your filters or search term.</p>
                    </div>
                ) : (
                    <>
                        <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg shadow-lg overflow-hidden border border-indigo-500/30">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-700">
                                    <thead className="bg-gray-900/50">
                                        <tr>
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider cursor-pointer transition-colors hover:text-indigo-200"
                                                onClick={() => handleSort('title')}
                                            >
                                                <div className="flex items-center">
                                                    <span>Task</span>
                                                    {sortBy === 'title' && (
                                                        <span className="ml-1">
                                                            {sortDirection === 'asc' ? '↑' : '↓'}
                                                        </span>
                                                    )}
                                                </div>
                                            </th>
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider cursor-pointer transition-colors hover:text-indigo-200"
                                                onClick={() => handleSort('status')}
                                            >
                                                <div className="flex items-center">
                                                    <span>Status</span>
                                                    {sortBy === 'status' && (
                                                        <span className="ml-1">
                                                            {sortDirection === 'asc' ? '↑' : '↓'}
                                                        </span>
                                                    )}
                                                </div>
                                            </th>
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider cursor-pointer transition-colors hover:text-indigo-200"
                                                onClick={() => handleSort('priority')}
                                            >
                                                <div className="flex items-center">
                                                    <span>Priority</span>
                                                    {sortBy === 'priority' && (
                                                        <span className="ml-1">
                                                            {sortDirection === 'asc' ? '↑' : '↓'}
                                                        </span>
                                                    )}
                                                </div>
                                            </th>
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider cursor-pointer transition-colors hover:text-indigo-200"
                                                onClick={() => handleSort('deadline')}
                                            >
                                                <div className="flex items-center">
                                                    <span>Deadline</span>
                                                    {sortBy === 'deadline' && (
                                                        <span className="ml-1">
                                                            {sortDirection === 'asc' ? '↑' : '↓'}
                                                        </span>
                                                    )}
                                                </div>
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700">
                                        {currentTasks.map((task, index) => {
                                            const { daysRemaining, isOverdue } = getDaysRemaining(task.deadline);

                                            return (
                                                <tr
                                                    key={task.id}
                                                    className="hover:bg-gray-800/50 transition-all duration-200"
                                                    style={{ animationDelay: `${index * 100}ms` }}
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-white">{task.title}</div>
                                                        {task.tags && task.tags.length > 0 && (
                                                            <div className="mt-1 flex flex-wrap gap-1">
                                                                {task.tags.map((tag, idx) => (
                                                                    <span
                                                                        key={idx}
                                                                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-900/50 text-indigo-300 border border-indigo-700/30"
                                                                    >
                                                                        {tag}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <select
                                                            value={task.status}
                                                            onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                                            className="block text-sm border border-gray-700 bg-gray-800 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 py-1"
                                                        >
                                                            <option value="pending">Pending</option>
                                                            <option value="in_progress">In Progress</option>
                                                            <option value="completed">Completed</option>
                                                        </select>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <PriorityBadge priority={task.priority} />
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-300">{formatDate(task.deadline)}</div>
                                                        <div className="text-sm">
                                                            {isOverdue ? (
                                                                <span className="text-red-400">Overdue by {Math.abs(daysRemaining)} days</span>
                                                            ) : task.status === 'completed' ? (
                                                                <span className="text-green-400">Completed</span>
                                                            ) : daysRemaining !== null ? (
                                                                daysRemaining === 0 ? (
                                                                    <span className="text-orange-400">Due today</span>
                                                                ) : (
                                                                    <span className="text-indigo-300">{daysRemaining} days left</span>
                                                                )
                                                            ) : (
                                                                <span className="text-gray-400">No deadline</span>
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
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {totalPages > 1 && (
                            <div className="mt-6">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default TasksList;
