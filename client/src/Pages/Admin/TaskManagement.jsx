import { useState, useEffect } from 'react';

const TaskManagement = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Fetch tasks - in a real app, this would be an API call
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 800));

                // Mock data
                setTasks([
                    {
                        id: '1',
                        title: 'Develop landing page',
                        status: 'pending',
                        priority: 'high',
                        assignee: 'John Doe',
                        deadline: '2025-07-30'
                    },
                    {
                        id: '2',
                        title: 'Fix login bug',
                        status: 'in_progress',
                        priority: 'high',
                        assignee: 'Jane Smith',
                        deadline: '2025-06-20'
                    },
                    {
                        id: '3',
                        title: 'Create API documentation',
                        status: 'completed',
                        priority: 'medium',
                        assignee: 'Robert Johnson',
                        deadline: '2025-06-10'
                    }
                ]);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    if (loading) {
        return <div className="h-full flex items-center justify-center">Loading tasks...</div>;
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
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Task Management</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                    Create Task
                </button>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignee</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {tasks.map((task) => (
                            <tr key={task.id} className="hover:bg-gray-50">
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
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {task.assignee}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {task.deadline}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                                    <button className="text-red-600 hover:text-red-900">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal placeholder - would be implemented as a separate component */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
                    <div className="bg-white p-8 rounded-lg w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Create New Task</h2>
                        <p>Task creation form would go here</p>
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setShowModal(false)}
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 mr-2"
                            >
                                Cancel
                            </button>
                            <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskManagement;
