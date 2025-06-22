import { useState, useEffect } from 'react';
import Modal from '../../components/common/Modal';
import Loading from '../../components/common/Loading';
import UserForm from '../../components/forms/UserForm';
import { userService } from '../../services/api';
import { toast } from 'react-toastify';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [animate, setAnimate] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    // Fetch users from the API
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const response = await userService.getAllUsers();
                // Make sure we're getting the data in the expected structure
                if (response.status === 'success' && response.data.users) {
                    setUsers(response.data.users);
                } else {
                    throw new Error('Invalid response format');
                }
            } catch (error) {
                console.error('Error fetching users:', error);
                toast.error('Failed to load users. Please try again later.');
            } finally {
                setLoading(false);
                setTimeout(() => setAnimate(true), 100);
            }
        };

        fetchUsers();
    }, []);

    const handleAddUser = async (userData) => {
        try {
            setLoading(true);
            const response = await userService.createUser(userData);
            if (response.status === 'success') {
                toast.success('User created successfully!');
                // Add the new user to the list
                setUsers([...users, response.data.user]);
            }
        } catch (error) {
            console.error('Error creating user:', error);
            toast.error(error.response?.data?.message || 'Failed to create user');
        } finally {
            setLoading(false);
            setShowModal(false);
        }
    };

    const handleUpdateUser = async (userData) => {
        try {
            setLoading(true);
            const response = await userService.updateUser(selectedUser.id, userData);
            if (response.status === 'success') {
                toast.success('User updated successfully!');
                // Update the user in the list
                setUsers(users.map(user => 
                    user.id === selectedUser.id ? response.data.user : user
                ));
            }
        } catch (error) {
            console.error('Error updating user:', error);
            toast.error(error.response?.data?.message || 'Failed to update user');
        } finally {
            setLoading(false);
            setShowModal(false);
            setSelectedUser(null);
            setIsEditMode(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                setLoading(true);
                await userService.deleteUser(userId);
                toast.success('User deleted successfully!');
                // Remove the user from the list
                setUsers(users.filter(user => user.id !== userId));
            } catch (error) {
                console.error('Error deleting user:', error);
                toast.error(error.response?.data?.message || 'Failed to delete user');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleEditClick = (user) => {
        setSelectedUser(user);
        setIsEditMode(true);
        setShowModal(true);
    };

    const handleToggleStatus = async (user) => {
        try {
            setLoading(true);
            // In a real implementation, this would call an API endpoint to toggle the user status
            const updatedUser = await userService.updateUser(user.id, { 
                active: !user.active 
            });
            
            if (updatedUser.status === 'success') {
                toast.success(`User ${user.active ? 'deactivated' : 'activated'} successfully`);
                // Update the user in the list
                setUsers(users.map(u => 
                    u.id === user.id ? { ...u, active: !u.active } : u
                ));
            }
        } catch (error) {
            console.error('Error updating user status:', error);
            toast.error(error.response?.data?.message || 'Failed to update user status');
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedUser(null);
        setIsEditMode(false);
    };

    if (loading && !users.length) {
        return <Loading message="Loading users" />;
    }

    return (
        <div className="container mx-auto px-4 py-6 relative">
            {/* Decorative elements */}
            <div className="absolute top-10 left-1/4 w-3 h-3 bg-indigo-500 rounded-full opacity-30 animate-float"></div>
            <div className="absolute bottom-10 right-1/4 w-2 h-2 bg-purple-400 rounded-full opacity-20 animate-float-delayed"></div>

            <div className={`transition-all duration-700 transform ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-white">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
                            User Management
                        </span>
                    </h1>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-md hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg flex items-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                        Add User
                    </button>
                </div>

                <div className="bg-gradient-to-b from-gray-800 to-gray-900 shadow-lg rounded-lg overflow-hidden border border-indigo-500/30">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead className="bg-gray-900/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">Department</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {users.map((user, index) => (
                                    <tr
                                        key={user.id || user._id}
                                        className="hover:bg-gray-800/50 transition-colors duration-150"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white shadow-md border border-indigo-400/30">
                                                    <span className="font-medium">{user.name.charAt(0)}</span>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-white">{user.name}</div>
                                                    <div className="text-sm text-gray-400">{user.position}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${user.role === 'admin'
                                                    ? 'bg-purple-900/50 text-purple-300 border border-purple-500/30'
                                                    : 'bg-blue-900/50 text-blue-300 border border-blue-500/30'}`}>
                                                {user.role === 'admin' ? 'Admin' : 'Team Member'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            {user.department}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${user.active !== false
                                                    ? 'bg-green-900/50 text-green-300 border border-green-500/30'
                                                    : 'bg-red-900/50 text-red-300 border border-red-500/30'}`}>
                                                {user.active !== false ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button 
                                                onClick={() => handleEditClick(user)}
                                                className="text-indigo-400 hover:text-indigo-300 hover:underline transition-colors duration-150 mr-3"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleToggleStatus(user)}
                                                className={`${user.active !== false ? 'text-red-400 hover:text-red-300' : 'text-green-400 hover:text-green-300'} hover:underline transition-colors duration-150`}
                                            >
                                                {user.active !== false ? 'Deactivate' : 'Activate'}
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
                onClose={closeModal}
                title={isEditMode ? "Edit User" : "Add New User"}
                size="md"
            >
                <UserForm
                    onSubmit={isEditMode ? handleUpdateUser : handleAddUser}
                    onCancel={closeModal}
                    initialData={selectedUser}
                    isEditMode={isEditMode}
                />
            </Modal>
        </div>
    );
};

export default UserManagement;
