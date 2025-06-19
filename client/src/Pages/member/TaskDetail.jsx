import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { taskService } from '../../services/api';
import TaskDetails from '../../components/tasks/TaskDetails';
import Loading from '../../components/common/Loading';
import useAuth from '../../hooks/useAuth';

const TaskDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [animate, setAnimate] = useState(false);

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
                setTimeout(() => setAnimate(true), 100);
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
        return <Loading message="Loading task details" />;
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-6">
                <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-lg shadow-lg border border-red-500/30 mb-4 animate-fade-in">
                    <div className="flex items-center">
                        <svg className="h-6 w-6 text-red-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <p className="text-red-300">{error}</p>
                    </div>
                </div>
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:-translate-y-1"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16l-4-4m0 0l4-4m-4 4h18"></path>
                    </svg>
                    Go Back
                </button>
            </div>
        );
    }

    if (!task) {
        return (
            <div className="container mx-auto px-4 py-6">
                <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-lg shadow-lg border border-yellow-500/30 mb-4 animate-fade-in">
                    <div className="flex items-center">
                        <svg className="h-6 w-6 text-yellow-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-yellow-300">Task not found or you don't have permission to view it.</p>
                    </div>
                </div>
                <button
                    onClick={() => navigate('/tasks')}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:-translate-y-1"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                    </svg>
                    View All Tasks
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6 relative">
            {/* Decorative elements */}
            <div className="absolute top-20 right-10 w-3 h-3 bg-indigo-500 rounded-full opacity-20 animate-float"></div>
            <div className="absolute bottom-10 left-20 w-2 h-2 bg-purple-400 rounded-full opacity-30 animate-float-delayed"></div>

            <div className={`transition-all duration-700 transform ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="mr-4 text-gray-400 hover:text-white transition-colors duration-200 flex items-center group"
                    >
                        <svg className="w-5 h-5 mr-1 transform transition-transform duration-200 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16l-4-4m0 0l4-4m-4 4h18"></path>
                        </svg>
                        Back
                    </button>
                    <h1 className="text-lg font-medium text-white">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
                            Task Details
                        </span>
                    </h1>
                </div>

                <TaskDetails task={task} onTaskUpdate={handleTaskUpdate} />
            </div>
        </div>
    );
};

export default TaskDetail;
