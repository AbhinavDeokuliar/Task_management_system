import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { taskService } from '../../services/api';
import TaskDetails from '../../components/tasks/TaskDetails';
import useAuth from '../../hooks/useAuth';

const TaskDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTask = async () => {
            try {
                setLoading(true);
                setError('');

                // In a real app, this would be:
                // const response = await taskService.getTask(id);
                // setTask(response.data.task);

                // For demo, we'll use mock data
                await new Promise(resolve => setTimeout(resolve, 700));

                // Mock task data
                const mockTask = {
                    id,
                    title: 'Complete frontend for user profile',
                    description: 'Implement the UI components for user profile page based on the approved designs. This should include the profile photo upload functionality, personal information form, and settings panel.',
                    status: 'in_progress',
                    priority: 'high',
                    createdBy: {
                        id: 'admin1',
                        name: 'Admin User',
                        email: 'admin@example.com'
                    },
                    assignedTo: {
                        id: currentUser.id,
                        name: currentUser.name,
                        email: currentUser.email
                    },
                    deadline: '2025-07-05T00:00:00.000Z',
                    createdAt: '2025-06-20T00:00:00.000Z',
                    comments: [
                        {
                            text: "I've started working on this. Will update the progress soon.",
                            createdBy: {
                                id: currentUser.id,
                                name: currentUser.name
                            },
                            createdAt: '2025-06-21T09:30:00.000Z'
                        },
                        {
                            text: "How's it going? Any blockers?",
                            createdBy: {
                                id: 'admin1',
                                name: 'Admin User'
                            },
                            createdAt: '2025-06-22T14:15:00.000Z'
                        }
                    ],
                    tags: ['frontend', 'ui', 'profile']
                };

                setTask(mockTask);
            } catch (err) {
                console.error('Error fetching task:', err);
                setError('Failed to fetch task details. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchTask();
    }, [id, currentUser]);

    const handleTaskUpdate = async (updatedTask) => {
        try {
            // In a real app:
            // await taskService.updateTask(id, { status: updatedTask.status });

            // For demo, just update the local state
            setTask(updatedTask);
            return true;
        } catch (err) {
            console.error('Error updating task:', err);
            return false;
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-6">
                <div className="flex justify-center items-center h-64">
                    <p className="text-gray-500">Loading task details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-6">
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                    <div className="flex">
                        <p className="text-red-700">{error}</p>
                    </div>
                </div>
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                    Go Back
                </button>
            </div>
        );
    }

    if (!task) {
        return (
            <div className="container mx-auto px-4 py-6">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                    <div className="flex">
                        <p className="text-yellow-700">Task not found or you don't have permission to view it.</p>
                    </div>
                </div>
                <button
                    onClick={() => navigate('/tasks')}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                    View All Tasks
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex items-center mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="mr-4 text-gray-600 hover:text-gray-900"
                >
                    &larr; Back
                </button>
                <h1 className="text-lg font-medium">Task Details</h1>
            </div>

            <TaskDetails task={task} onTaskUpdate={handleTaskUpdate} />
        </div>
    );
};

export default TaskDetail;
