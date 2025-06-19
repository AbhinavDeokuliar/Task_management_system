import { useState, useEffect } from 'react';
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
    const [isVisible, setIsVisible] = useState(false);
    const [activeSection, setActiveSection] = useState('details');

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

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
        <div className={`bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg border border-indigo-500/30 shadow-lg shadow-indigo-500/10 p-6 text-gray-200 transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 border-b border-gray-700 pb-4">
                <h1 className="text-2xl font-bold mb-3 md:mb-0 text-white">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
                        {task.title}
                    </span>
                </h1>

                <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                        <span className="text-sm text-gray-400 mr-2">Status:</span>
                        {isAdmin || task.assignedTo?.id === currentUser?.id ? (
                            <select
                                value={status}
                                onChange={handleStatusChange}
                                disabled={submitting}
                                className="border border-gray-600 rounded px-2 py-1 text-sm bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
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
                        <span className="text-sm text-gray-400 mr-2">Priority:</span>
                        <PriorityBadge priority={task.priority} />
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-red-900/30 border-l-4 border-red-500 p-4 mb-4 animate-fade-in">
                    <div className="flex">
                        <svg className="h-5 w-5 text-red-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <p className="text-sm text-red-300">{error}</p>
                    </div>
                </div>
            )}

            <div className="flex border-b border-gray-700 mb-6">
                <button
                    className={`px-4 py-2 font-medium text-sm transition-all duration-300 ${activeSection === 'details' ? 'border-b-2 border-indigo-500 text-indigo-400' : 'text-gray-400 hover:text-gray-200'}`}
                    onClick={() => setActiveSection('details')}
                >
                    Details
                </button>
                <button
                    className={`px-4 py-2 font-medium text-sm transition-all duration-300 ${activeSection === 'comments' ? 'border-b-2 border-indigo-500 text-indigo-400' : 'text-gray-400 hover:text-gray-200'}`}
                    onClick={() => setActiveSection('comments')}
                >
                    Comments {task.comments?.length ? `(${task.comments.length})` : ''}
                </button>
            </div>

            {activeSection === 'details' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="animate-fade-in">
                        <h2 className="text-lg font-medium mb-2 text-indigo-300 flex items-center">
                            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Description
                        </h2>
                        <div className="bg-gray-900/50 p-4 rounded border border-gray-700 hover:border-gray-600 transition-all duration-300">
                            <p className="text-gray-300 whitespace-pre-line">
                                {task.description || 'No description provided.'}
                            </p>
                        </div>
                    </div>

                    <div className="animate-fade-in" style={{ animationDelay: "100ms" }}>
                        <h2 className="text-lg font-medium mb-2 text-indigo-300 flex items-center">
                            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Information
                        </h2>
                        <div className="bg-gray-900/50 p-4 rounded border border-gray-700 hover:border-gray-600 transition-all duration-300 space-y-3">
                            <div className="grid grid-cols-3 gap-2">
                                <span className="text-sm text-gray-400">Assigned to:</span>
                                <span className="text-sm font-medium col-span-2 text-white">
                                    {task.assignedTo?.name || 'Unassigned'}
                                </span>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                <span className="text-sm text-gray-400">Created by:</span>
                                <span className="text-sm font-medium col-span-2 text-white">
                                    {task.createdBy?.name || 'Unknown'}
                                </span>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                <span className="text-sm text-gray-400">Deadline:</span>
                                <span className="text-sm font-medium col-span-2">
                                    <span className="text-white">{formatDate(task.deadline)}</span>
                                    {calculateDaysRemaining() !== null && (
                                        <span className={`ml-2 ${calculateDaysRemaining() < 0 ? 'text-red-400' : calculateDaysRemaining() <= 2 ? 'text-yellow-400' : 'text-green-400'}`}>
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
                                <span className="text-sm text-gray-400">Created at:</span>
                                <span className="text-sm font-medium col-span-2 text-white">
                                    {formatDate(task.createdAt)}
                                </span>
                            </div>

                            {task.tags && task.tags.length > 0 && (
                                <div className="grid grid-cols-3 gap-2">
                                    <span className="text-sm text-gray-400">Tags:</span>
                                    <div className="col-span-2 flex flex-wrap gap-1">
                                        {task.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-900/50 text-indigo-300 border border-indigo-700 hover:bg-indigo-800/50 transition-colors duration-200 cursor-default"
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
            ) : (
                <div className="border-t pt-6 animate-fade-in">
                    <div className="mb-6">
                        <form onSubmit={handleCommentSubmit} className="flex">
                            <input
                                type="text"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Add a comment..."
                                className="flex-1 border border-gray-700 bg-gray-900/50 rounded-l-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-400"
                            />
                            <button
                                type="submit"
                                disabled={!comment.trim() || submitting}
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-2 px-4 rounded-r-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all duration-300"
                            >
                                {submitting ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Posting...
                                    </span>
                                ) : 'Post'}
                            </button>
                        </form>
                    </div>

                    {task.comments && task.comments.length > 0 ? (
                        <div className="space-y-4">
                            {task.comments.map((comment, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-900/30 p-4 rounded border border-gray-700 hover:border-gray-600 transition-all duration-300 transform hover:-translate-y-0.5"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className="flex items-center mb-2">
                                        <div className="mr-2 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold">
                                            {comment.createdBy?.name?.charAt(0) || '?'}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm text-white">{comment.createdBy?.name || 'Unknown'}</p>
                                            <p className="text-xs text-gray-400">
                                                {formatDate(comment.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-gray-300 whitespace-pre-line">{comment.text}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-gray-400 text-center py-8 italic">No comments yet. Be the first to add one!</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TaskDetails;
