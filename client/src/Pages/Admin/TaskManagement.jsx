import { useState, useEffect } from 'react';
import Modal from '../../components/common/Modal';
import Loading from '../../components/common/Loading';
import TaskForm from '../../components/forms/TaskForm';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';

const TaskManagement = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [animate, setAnimate] = useState(false);

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
                setTimeout(() => setAnimate(true), 100);
            }
        };

        fetchTasks();
    }, []);

    const handleAddTask = (taskData) => {
        console.log('Creating task:', taskData);
        // In a real app, this would call an API endpoint
        setShowModal(false);
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

    if (loading) {
        return <Loading message="Loading tasks" />;
    }

    return (
        <div className="container mx-auto px-4 py-6 relative">
            {/* Decorative elements */}
            <div className="absolute top-20 right-1/4 w-3 h-3 bg-purple-500 rounded-full opacity-30 animate-float-slow"></div>
            <div className="absolute bottom-20 left-1/4 w-2 h-2 bg-indigo-400 rounded-full opacity-20 animate-float"></div>

            <div className={`transition-all duration-700 transform ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-white">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
                            Task Management
                        </span>
                    </h1>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-md hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg flex items-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                        Create Task
                    </button>
                </div>

                <div className="bg-gradient-to-b from-gray-800 to-gray-900 shadow-lg rounded-lg overflow-hidden border border-indigo-500/30">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead className="bg-gray-900/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">Task</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">Priority</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">Assignee</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">Deadline</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {tasks.map((task, index) => (
                                    <tr
                                        key={task.id}
                                        className="hover:bg-gray-800/50 transition-colors duration-150"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-white hover:text-indigo-300 cursor-pointer transition-colors">{task.title}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <StatusBadge status={task.status} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <PriorityBadge priority={task.priority} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            {task.assignee}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            {formatDate(task.deadline)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button className="text-indigo-400 hover:text-indigo-300 hover:underline transition-colors duration-150 mr-3">
                                                Edit
                                            </button>
                                            <button className="text-red-400 hover:text-red-300 hover:underline transition-colors duration-150">
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Create New Task"
                size="md"
            >
                <TaskForm
                    onSubmit={handleAddTask}
                    onCancel={() => setShowModal(false)}
                />
            </Modal>
        </div>
    );
};

export default TaskManagement;
