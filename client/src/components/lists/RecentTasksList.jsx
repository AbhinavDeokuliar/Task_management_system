import React from 'react';
import { Link } from 'react-router-dom';

const RecentTasksList = ({ tasks = [] }) => {
    // Function to get status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-900/30 text-green-400';
            case 'in_progress':
                return 'bg-indigo-900/30 text-indigo-400';
            case 'pending':
                return 'bg-amber-900/30 text-amber-400';
            case 'archived':
                return 'bg-gray-900/30 text-gray-400';
            default:
                return 'bg-gray-900/30 text-gray-400';
        }
    };

    // Function to get priority indicator
    const getPriorityIndicator = (priority) => {
        switch (priority) {
            case 'high':
                return {
                    color: 'text-red-400',
                    bgColor: 'bg-red-400',
                    text: 'High'
                };
            case 'medium':
                return {
                    color: 'text-amber-400',
                    bgColor: 'bg-amber-400',
                    text: 'Medium'
                };
            case 'low':
                return {
                    color: 'text-blue-400',
                    bgColor: 'bg-blue-400',
                    text: 'Low'
                };
            default:
                return {
                    color: 'text-gray-400',
                    bgColor: 'bg-gray-400',
                    text: 'Normal'
                };
        }
    };

    // Function to format date
    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        } catch (e) {
            return 'Invalid date';
        }
    };

    // Function to calculate days remaining
    const getDaysRemaining = (deadline) => {
        const today = new Date();
        const deadlineDate = new Date(deadline);

        // Set hours to 0 to compare just the days
        today.setHours(0, 0, 0, 0);
        deadlineDate.setHours(0, 0, 0, 0);

        const diffTime = deadlineDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return diffDays;
    };

    if (!tasks || tasks.length === 0) {
        return (
            <div className="flex items-center justify-center h-32">
                <p className="text-gray-400">No tasks available</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {tasks.map((task) => {
                const priority = getPriorityIndicator(task.priority);
                const daysRemaining = getDaysRemaining(task.deadline);
                const isCompleted = task.status === 'completed' || task.status === 'archived';

                return (
                    <Link
                        to={`/tasks/${task._id || task.id}`}
                        key={task._id || task.id}
                        className="block p-4 rounded-lg bg-gray-900/50 border border-gray-700 hover:border-indigo-500/30 hover:bg-gray-800/30 transition-all duration-300"
                    >
                        <div className="flex justify-between">
                            <div className="flex items-start">
                                <div className={`mr-3 mt-1 w-2 h-2 rounded-full ${priority.bgColor}`}></div>
                                <div>
                                    <h4 className="text-white text-sm font-medium">{task.title}</h4>
                                    <p className="text-gray-400 text-xs mt-1 line-clamp-1">{task.description}</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${getStatusColor(task.status)}`}>
                                    {task.status?.charAt(0).toUpperCase() + task.status?.slice(1).replace('_', ' ')}
                                </span>
                                <span className="text-gray-400 text-xs mt-1">
                                    {formatDate(task.deadline)}
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mt-3">
                            <div className="flex items-center">
                                <div className="flex items-center text-xs">
                                    <span className={`font-medium mr-2 ${priority.color}`}>{priority.text} Priority</span>
                                    {!isCompleted && (
                                        <span className={`${daysRemaining < 0 ? 'text-red-400' :
                                                daysRemaining === 0 ? 'text-amber-400' :
                                                    daysRemaining <= 3 ? 'text-amber-300' : 'text-gray-400'
                                            }`}>
                                            {daysRemaining < 0 ? `${Math.abs(daysRemaining)}d overdue` :
                                                daysRemaining === 0 ? 'Due today' :
                                                    `${daysRemaining}d remaining`}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center">
                                {task.assignedTo && (
                                    <div className="flex items-center mr-2">
                                        <div className="h-5 w-5 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-xs font-medium">
                                            {task.assignedTo.name ? task.assignedTo.name.charAt(0) : "U"}
                                        </div>
                                        <span className="text-gray-400 text-xs ml-1">{task.assignedTo.name?.split(' ')[0]}</span>
                                    </div>
                                )}

                                {task.tags && task.tags.length > 0 && (
                                    <div className="text-xs px-2 py-0.5 bg-gray-800 text-gray-300 rounded-md">
                                        {task.tags[0]}
                                        {task.tags.length > 1 && <span> +{task.tags.length - 1}</span>}
                                    </div>
                                )}
                            </div>
                        </div>
                    </Link>
                );
            })}

            <div className="text-center pt-2">
                <Link to="/tasks" className="inline-block text-indigo-400 hover:text-indigo-300 text-sm transition-colors">
                    View All Tasks →
                </Link>
            </div>
        </div>
    );
};

export default RecentTasksList;
