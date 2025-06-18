import { useState, useEffect } from 'react';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Fetch users - in a real app, this would be an API call
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 800));

                // Mock data
                setUsers([
                    {
                        id: '1',
                        name: 'John Doe',
                        email: 'john@example.com',
                        role: 'admin',
                        department: 'Management',
                        position: 'Project Manager',
                        active: true
                    },
                    {
                        id: '2',
                        name: 'Jane Smith',
                        email: 'jane@example.com',
                        role: 'team_member',
                        department: 'Development',
                        position: 'Frontend Developer',
                        active: true
                    },
                    {
                        id: '3',
                        name: 'Robert Johnson',
                        email: 'robert@example.com',
                        role: 'team_member',
                        department: 'Development',
                        position: 'Backend Developer',
                        active: false
                    }
                ]);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) {
        return <div className="h-full flex items-center justify-center">Loading users...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">User Management</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                    Add User
                </button>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                            <span className="text-indigo-700 font-medium">{user.name.charAt(0)}</span>
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                            <div className="text-sm text-gray-500">{user.position}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {user.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                                        }`}>
                                        {user.role === 'admin' ? 'Admin' : 'Team Member'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {user.department}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {user.active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                                    <button className="text-red-600 hover:text-red-900">
                                        {user.active ? 'Deactivate' : 'Activate'}
                                    </button>
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
                        <h2 className="text-xl font-bold mb-4">Add New User</h2>
                        <p>User creation form would go here</p>
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

export default UserManagement;
