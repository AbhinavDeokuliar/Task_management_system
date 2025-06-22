import { useState, useEffect } from 'react';
import Modal from '../../components/common/Modal';
import Loading from '../../components/common/Loading';
import TaskForm from '../../components/forms/TaskForm';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import { taskService } from '../../services/api';

const TaskManagement = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formLoading, setFormLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [animate, setAnimate] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [error, setError] = useState(null);
    const [formError, setFormError] = useState(null);

    // Fetch tasks using the API service
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await taskService.getAllTasks();

                // Handle the actual response structure
                if (response.status === 'success' && response.data && response.data.tasks) {
                    setTasks(response.data.tasks);
                } else {
                    console.warn('Unexpected response format:', response);
                    setTasks([]); // Fallback to empty array if structure is unexpected
                }
            } catch (error) {
                console.error('Error fetching tasks:', error);
                setError('Failed to load tasks. Please try again later.');
            } finally {
                setLoading(false);
                setTimeout(() => setAnimate(true), 100);
            }
        };

        fetchTasks();
    }, []);

    // Function to fetch a single task's complete details
    const fetchTaskDetails = async (taskId) => {
        try {
            setFormLoading(true);
            setFormError(null);
            const response = await taskService.getTask(taskId);

            let taskDetails;
            if (response.status === 'success' && response.data && response.data.task) {
                taskDetails = response.data.task;
            } else {
                taskDetails = response.data || response;
            }

            return taskDetails;
        } catch (error) {
            console.error('Error fetching task details:', error);
            setFormError('Could not load task details. Please try again.');
            throw error;
        } finally {
            setFormLoading(false);
        }
    };

    const handleAddTask = async (taskData) => {
        try {
            setFormLoading(true);
            setFormError(null);
            const response = await taskService.createTask(taskData);

            // Handle the response based on the API structure
            if (response.status === 'success' && response.data && response.data.task) {
                setTasks(prev => [...prev, response.data.task]);
            } else {
                // If the response doesn't match expected structure, check if task exists directly in response
                const newTask = response.data?.task || response.task || response;
                setTasks(prev => [...prev, newTask]);
            }
            setShowModal(false);
        } catch (error) {
            console.error('Error creating task:', error);
            setFormError('Failed to create task. Please try again.');
        } finally {
            setFormLoading(false);
        }
    };

    const handleEditTask = async (taskData) => {
        try {
            setFormLoading(true);
            setFormError(null);
            // Make sure we're using the correct ID (could be _id or id)
            const taskId = editingTask.id || editingTask._id;

            const response = await taskService.updateTask(taskId, taskData);

            // Handle the response based on API structure
            let updatedTask;
            if (response.status === 'success' && response.data && response.data.task) {
                updatedTask = response.data.task;
            } else {
                updatedTask = response.data?.task || response.task || response;
            }

            setTasks(prev =>
                prev.map(task => (task.id === taskId || task._id === taskId) ? updatedTask : task)
            );

            setShowModal(false);
            setEditingTask(null);
        } catch (error) {
            console.error('Error updating task:', error);
            setFormError('Failed to update task. Please try again.');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDeleteTask = async (id) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                setLoading(true);
                const response = await taskService.deleteTask(id);

                if (response.status === 'success' || response.status === 200) {
                    setTasks(prev => prev.filter(task => task.id !== id && task._id !== id));
                } else {
                    throw new Error('Failed to delete task');
                }
            } catch (error) {
                console.error('Error deleting task:', error);
                setError('Failed to delete task. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };

    const openEditModal = async (task) => {
        try {
            // Fetch complete task details before opening the edit modal
            const taskId = task.id || task._id;
            const fullTaskDetails = await fetchTaskDetails(taskId);

            setEditingTask(fullTaskDetails);
            setShowModal(true);
        } catch (error) {
            // Error handling is done in fetchTaskDetails function
            console.error('Failed to open edit modal:', error);
        }
    };

    const openCreateModal = () => {
        setEditingTask(null);
        setFormError(null);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setEditingTask(null);
        setFormError(null);
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

    // Get assignee name from the nested response structure
    const getAssigneeName = (task) => {
        if (task.assignedTo) {
            if (typeof task.assignedTo === 'object') {
                return task.assignedTo.name || task.assignedTo.email || 'Unnamed';
            }
            return task.assignedTo;
        }
        return 'Unassigned';
    };

    if (loading && tasks.length === 0) {
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
                        onClick={openCreateModal}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-md hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg flex items-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                        Create Task
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 text-red-100 rounded-md">
                        {error}
                    </div>
                )}

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
                                    <th className="px-6 py-3 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">Tags</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {tasks.length > 0 ? (
                                    tasks.map((task, index) => (
                                        <tr
                                            key={task.id || task._id}
                                            className="hover:bg-gray-800/50 transition-colors duration-150"
                                            style={{ animationDelay: `${index * 100}ms` }}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-white hover:text-indigo-300 cursor-pointer transition-colors">{task.title}</div>
                                                {task.description && (
                                                    <div className="text-xs text-gray-400 mt-1 truncate max-w-xs">
                                                        {task.description.length > 60 ?
                                                            `${task.description.substring(0, 60)}...` :
                                                            task.description}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <StatusBadge status={task.status} />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <PriorityBadge priority={task.priority} />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                {getAssigneeName(task)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <div className={`${task.isOverdue ? 'text-red-400' : 'text-gray-300'}`}>
                                                    {formatDate(task.deadline)}
                                                    {task.daysRemaining !== undefined && (
                                                        <div className="text-xs mt-1">
                                                            {task.isOverdue ?
                                                                <span className="text-red-400">Overdue</span> :
                                                                <span className="text-gray-400">{task.daysRemaining} days left</span>
                                                            }
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-wrap gap-1">
                                                    {task.tags && task.tags.map(tag => (
                                                        <span
                                                            key={tag}
                                                            className="px-2 py-1 text-xs rounded-full bg-indigo-900/40 text-indigo-300 border border-indigo-500/30"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    className="text-indigo-400 hover:text-indigo-300 hover:underline transition-colors duration-150 mr-3"
                                                    onClick={() => openEditModal(task)}
                                                    disabled={formLoading}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="text-red-400 hover:text-red-300 hover:underline transition-colors duration-150"
                                                    onClick={() => handleDeleteTask(task.id || task._id)}
                                                    disabled={loading}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-4 text-center text-gray-400">
                                            No tasks found. Create a new task to get started.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={showModal}
                onClose={handleModalClose}
                title={editingTask ? "Edit Task" : "Create New Task"}
                size="md"
            >
                {formLoading ? (
                    <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                        <span className="ml-3 text-gray-300">Loading task data...</span>
                    </div>
                ) : (
                    <>
                        {formError && (
                            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 text-red-100 rounded-md text-sm">
                                {formError}
                            </div>
                        )}
                        <TaskForm
                            initialData={editingTask}
                            onSubmit={editingTask ? handleEditTask : handleAddTask}
                            onCancel={handleModalClose}
                            isSubmitting={formLoading}
                        />
                    </>
                )}
            </Modal>
        </div>
    );
};

export default TaskManagement;
