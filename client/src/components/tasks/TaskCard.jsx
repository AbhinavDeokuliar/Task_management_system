import { Link } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge';
import PriorityBadge from '../common/PriorityBadge';

const TaskCard = ({ task }) => {
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

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-lg text-gray-900 truncate">
                    <Link to={`/tasks/${task.id}`} className="hover:text-indigo-600">
                        {task.title}
                    </Link>
                </h3>
                <PriorityBadge priority={task.priority} />
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {task.description || 'No description provided'}
            </p>

            <div className="flex justify-between items-center text-xs text-gray-500">
                <div className="flex items-center">
                    <StatusBadge status={task.status} />
                </div>

                <div>
                    {task.deadline && (
                        <div className={`flex items-center ${isOverdue() ? 'text-red-600' : ''}`}>
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
