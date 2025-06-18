import { useState, useEffect } from 'react';
import { taskService, userService } from '../../services/api';

const TaskForm = ({ task, onSubmit, onCancel }) => {
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'medium',
        assignedTo: '',
        deadline: '',
        tags: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Load existing task data if editing
    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title || '',
                description: task.description || '',
                priority: task.priority || 'medium',
                assignedTo: task.assignedTo?.id || '',
                deadline: task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : '',
                tags: task.tags ? task.tags.join(', ') : ''
            });
        }
    }, [task]);

    // Load users for assignment dropdown
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoadingUsers(true);

                // In a real app, this would be an API call
                // For demo, we'll use mock data
                // const response = await userService.getAllUsers();
                // setUsers(response.data.users);

                // Mock data
                setUsers([
                    { id: '1', name: 'John Doe', email: 'john@example.com' },
                    { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
                    { id: '3', name: 'Robert Johnson', email: 'robert@example.com' }
                ]);
            } catch (error) {
                console.error('Error loading users:', error);
            } finally {
                setLoadingUsers(false);
            }
        };

        fetchUsers();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const submitData = {
                ...formData,
                tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
            };

            await onSubmit(submitData);
        } catch (err) {
            setError(err.message || 'Failed to save task. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Task Title *
                </label>
                <input
                    type="text"
                    name="title"
                    id="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                />
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                </label>
                <textarea
                    name="description"
                    id="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                        Priority *
                    </label>
                    <select
                        name="priority"
                        id="priority"
                        value={formData.priority}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700">
                        Assign To *
                    </label>
                    <select
                        name="assignedTo"
                        id="assignedTo"
                        value={formData.assignedTo}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                        disabled={loadingUsers}
                    >
                        <option value="">Select a team member</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>
                                {user.name} ({user.email})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">
                        Deadline *
                    </label>
                    <input
                        type="date"
                        name="deadline"
                        id="deadline"
                        value={formData.deadline}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                        Tags
                    </label>
                    <input
                        type="text"
                        name="tags"
                        id="tags"
                        value={formData.tags}
                        onChange={handleInputChange}
                        placeholder="Enter tags separated by commas"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
            </div>

            <div className="flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    {loading ? (
                        'Saving...'
                    ) : (
                        task ? 'Update Task' : 'Create Task'
                    )}
                </button>
            </div>
        </form>
    );
};

export default TaskForm;
