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

    const { tasks, loading, error, refreshTasks, updateTaskStatus } = useTasks();
    const tasksPerPage = 5;

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
        return <Loading message="Loading tasks..." />;
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-6">
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                    <div className="flex">
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
                <button
                    onClick={refreshTasks}
                    className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold mb-6">My Tasks</h1>

            <div className="mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div>
                            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                                Status Filter
                            </label>
                            <select
                                id="status-filter"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                <option value="all">All Tasks</option>
                                <option value="pending">Pending</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="priority-filter" className="block text-sm font-medium text-gray-700 mb-1">
                                Priority Filter
                            </label>
                            <select
                                id="priority-filter"
                                value={priorityFilter}
                                onChange={(e) => setPriorityFilter(e.target.value)}
                                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                <option value="all">All Priorities</option>
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </select>
                        </div>
                    </div>

                    <div className="w-full md:w-1/3">
                        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                            Search Tasks
                        </label>
                        <input
                            type="text"
                            id="search"
                            placeholder="Search by title, description, or tags"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                </div>
            </div>

            {tasks.length === 0 ? (
                <div className="bg-white p-6 rounded-lg shadow text-center">
                    <h3 className="text-lg font-medium text-gray-900">No tasks assigned</h3>
                    <p className="mt-1 text-gray-500">You don't have any assigned tasks yet.</p>
                </div>
            ) : filteredTasks.length === 0 ? (
                <div className="bg-white p-6 rounded-lg shadow text-center">
                    <h3 className="text-lg font-medium text-gray-900">No matching tasks</h3>
                    <p className="mt-1 text-gray-500">Try adjusting your filters or search term.</p>
                </div>
            ) : (
                <>
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
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
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
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
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
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
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
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
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {currentTasks.map((task) => {
                                        const { daysRemaining, isOverdue } = getDaysRemaining(task.deadline);

                                        return (
                                            <tr key={task.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{task.title}</div>
                                                    {task.tags && task.tags.length > 0 && (
                                                        <div className="mt-1 flex flex-wrap gap-1">
                                                            {task.tags.map((tag, idx) => (
                                                                <span
                                                                    key={idx}
                                                                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
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
                                                        className="block text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
                                                    <div className="text-sm text-gray-900">{formatDate(task.deadline)}</div>
                                                    <div className="text-sm text-gray-500">
                                                        {isOverdue ? (
                                                            <span className="text-red-600">Overdue by {Math.abs(daysRemaining)} days</span>
                                                        ) : task.status === 'completed' ? (
                                                            <span className="text-green-600">Completed</span>
                                                        ) : daysRemaining !== null ? (
                                                            daysRemaining === 0 ? (
                                                                <span className="text-orange-600">Due today</span>
                                                            ) : (
                                                                <span>{daysRemaining} days left</span>
                                                            )
                                                        ) : (
                                                            <span>No deadline</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <Link
                                                        to={`/tasks/${task.id}`}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        View details
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
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default TasksList;
