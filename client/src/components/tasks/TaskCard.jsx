import { useState } from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge';
import PriorityBadge from '../common/PriorityBadge';

const TaskCard = ({ task }) => {
    const [isHovered, setIsHovered] = useState(false);

    const calculateDaysRemaining = () => {
        if (!task.deadline) return null;

        const deadline = new Date(task.deadline);
        const today = new Date();

        // Reset hours to compare dates only
        today.setHours(0, 0, 0, 0);
        deadline.setHours(0, 0, 0, 0);

        const diffTime = deadline - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return diffDays;
    };

    const isOverdue = () => {
        const daysRemaining = calculateDaysRemaining();
        return daysRemaining !== null && daysRemaining < 0;
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';

        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getBorderColor = () => {
        switch (task.priority?.toLowerCase()) {
            case 'high': return 'border-red-500/30';
            case 'medium': return 'border-yellow-500/30';
            case 'low': return 'border-green-500/30';
            default: return 'border-gray-500/30';
        }
    };

    return (
        <div
            className={`bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg shadow-md border ${getBorderColor()} p-5 
                       transition-all duration-300 transform ${isHovered ? 'scale-103 shadow-lg -translate-y-1' : ''} hover:shadow-indigo-500/10`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex justify-between items-start mb-3">
                <h3 className="font-medium text-lg text-white truncate group">
                    <Link to={`/tasks/${task.id}`} className="hover:text-indigo-400 transition-colors duration-200 group-hover:underline">
                        {task.title}
                    </Link>
                </h3>
                <PriorityBadge priority={task.priority} />
            </div>

            <p className={`text-gray-300 text-sm mb-4 line-clamp-2 transition-all duration-300 ${isHovered ? 'line-clamp-none' : 'line-clamp-2'}`}>
                {task.description || 'No description provided'}
            </p>

            <div className="flex justify-between items-center text-xs text-gray-400 pt-2 border-t border-gray-700">
                <div className="flex items-center">
                    <StatusBadge status={task.status} />
                </div>

                <div className="text-right">
                    {task.deadline && (
                        <div className={`flex items-center ${isOverdue() ? 'text-red-400' : 'text-indigo-300'} font-medium`}>
                            <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="mr-1">
                                {isOverdue() ? 'Overdue by' : 'Due in'}
                            </span>
                            <span className="font-medium">
                                {Math.abs(calculateDaysRemaining())} {Math.abs(calculateDaysRemaining()) === 1 ? 'day' : 'days'}
                            </span>
                        </div>
                    )}

                    <div>
                        {formatDate(task.deadline)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskCard;
