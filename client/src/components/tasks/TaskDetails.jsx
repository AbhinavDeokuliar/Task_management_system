import { useState } from 'react';
import StatusBadge from '../common/StatusBadge';
import PriorityBadge from '../common/PriorityBadge';
import { taskService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const TaskDetails = ({ task, onTaskUpdate }) => {
    const { currentUser, isAdmin } = useAuth();
    const [comment, setComment] = useState('');
    const [status, setStatus] = useState(task.status);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const formatDate = (dateString) => {
        if (!dateString) return 'Not specified';

        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleStatusChange = async (e) => {
        const newStatus = e.target.value;
        setStatus(newStatus);

        try {
            setSubmitting(true);

            // In a real app, this would use the API
            // await taskService.updateTask(task.id, { status: newStatus });

            // For demo, simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));

            onTaskUpdate({
                ...task,
                status: newStatus
            });
        } catch (err) {
            setError('Failed to update task status');
            setStatus(task.status); // Revert on error
        } finally {
            setSubmitting(false);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();

        if (!comment.trim()) return;

        try {
            setSubmitting(true);

            // In a real app, this would use the API
            // await taskService.addComment(task.id, comment);

            // For demo, simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));

            // Add comment to task
            const newComment = {
                text: comment,
                createdBy: {
                    id: currentUser.id,
                    name: currentUser.name
                },
                createdAt: new Date().toISOString()
            };

            onTaskUpdate({
                ...task,
                comments: [...(task.comments || []), newComment]
            });

            setComment('');
        } catch (err) {
            setError('Failed to add comment');
        } finally {
            setSubmitting(false);
        }
    };

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

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
                <h1 className="text-2xl font-bold mb-3 md:mb-0">{task.title}</h1>

                <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                        <span className="text-sm text-gray-600 mr-2">Status:</span>
                        {isAdmin || task.assignedTo?.id === currentUser?.id ? (
                            <select
                                value={status}
                                onChange={handleStatusChange}
                                disabled={submitting}
                                className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="pending">Pending</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        ) : (
                            <StatusBadge status={task.status} />
                        )}
                    </div>

                    <div className="flex items-center">
                        <span className="text-sm text-gray-600 mr-2">Priority:</span>
                        <PriorityBadge priority={task.priority} />
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                    <div className="flex">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <h2 className="text-lg font-medium mb-2">Details</h2>
                    <div className="bg-gray-50 p-4 rounded border border-gray-200">
                        <p className="text-gray-800 whitespace-pre-line">
                            {task.description || 'No description provided.'}
                        </p>
                    </div>
                </div>

                <div>
                    <h2 className="text-lg font-medium mb-2">Information</h2>
                    <div className="bg-gray-50 p-4 rounded border border-gray-200 space-y-3">
                        <div className="grid grid-cols-3 gap-2">
                            <span className="text-sm text-gray-600">Assigned to:</span>
                            <span className="text-sm font-medium col-span-2">
                                {task.assignedTo?.name || 'Unassigned'}
                            </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            <span className="text-sm text-gray-600">Created by:</span>
                            <span className="text-sm font-medium col-span-2">
                                {task.createdBy?.name || 'Unknown'}
                            </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            <span className="text-sm text-gray-600">Deadline:</span>
                            <span className="text-sm font-medium col-span-2">
                                {formatDate(task.deadline)}
                                {calculateDaysRemaining() !== null && (
                                    <span className={`ml-2 ${calculateDaysRemaining() < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                        ({calculateDaysRemaining() < 0
                                            ? `Overdue by ${Math.abs(calculateDaysRemaining())} days`
                                            : calculateDaysRemaining() === 0
                                                ? 'Due today'
                                                : `${calculateDaysRemaining()} days left`
                                        })
                                    </span>
                                )}
                            </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            <span className="text-sm text-gray-600">Created at:</span>
                            <span className="text-sm font-medium col-span-2">
                                {formatDate(task.createdAt)}
                            </span>
                        </div>

                        {task.tags && task.tags.length > 0 && (
                            <div className="grid grid-cols-3 gap-2">
                                <span className="text-sm text-gray-600">Tags:</span>
                                <div className="col-span-2 flex flex-wrap gap-1">
                                    {task.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="border-t pt-6">
                <h2 className="text-lg font-medium mb-4">Comments</h2>

                <div className="mb-6">
                    <form onSubmit={handleCommentSubmit} className="flex">
                        <input
                            type="text"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Add a comment..."
                            className="flex-1 border border-gray-300 rounded-l-md py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <button
                            type="submit"
                            disabled={!comment.trim() || submitting}
                            className="bg-indigo-600 text-white py-2 px-4 rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                        >
                            Post
                        </button>
                    </form>
                </div>

                {task.comments && task.comments.length > 0 ? (
                    <div className="space-y-4">
                        {task.comments.map((comment, index) => (
                            <div key={index} className="bg-gray-50 p-4 rounded border border-gray-200">
                                <div className="flex items-center mb-2">
                                    <div className="mr-2 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                                        {comment.createdBy?.name?.charAt(0) || '?'}
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">{comment.createdBy?.name || 'Unknown'}</p>
                                        <p className="text-xs text-gray-500">
                                            {formatDate(comment.createdAt)}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-gray-800 whitespace-pre-line">{comment.text}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No comments yet.</p>
                )}
            </div>
        </div>
    );
};

export default TaskDetails;
