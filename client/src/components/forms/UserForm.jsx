import { useState, useEffect } from 'react';

const UserForm = ({ user, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'team_member',
        department: '',
        position: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Load existing user data if editing
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                password: '', // Don't populate password for security
                role: user.role || 'team_member',
                department: user.department || '',
                position: user.position || ''
            });
        }
    }, [user]);

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
            // If editing user and password is empty, remove it from submission
            const submitData = { ...formData };
            if (user && !submitData.password) {
                delete submitData.password;
            }

            await onSubmit(submitData);
        } catch (err) {
            setError(err.message || 'Failed to save user. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                    <div className="flex">
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name *
                </label>
                <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                />
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address *
                </label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                    // If editing an existing user, make email read-only
                    readOnly={!!user}
                />
                {user && (
                    <p className="mt-1 text-xs text-gray-500">Email cannot be changed.</p>
                )}
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    {user ? 'New Password (leave blank to keep unchanged)' : 'Password *'}
                </label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required={!user}
                    minLength={8}
                />
                <p className="mt-1 text-xs text-gray-500">
                    {user
                        ? 'Enter a new password only if you want to change it'
                        : 'Password must be at least 8 characters long'
                    }
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                        Role *
                    </label>
                    <select
                        name="role"
                        id="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    >
                        <option value="team_member">Team Member</option>
                        <option value="admin">Administrator</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                        Department
                    </label>
                    <input
                        type="text"
                        name="department"
                        id="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                    Position/Title
                </label>
                <input
                    type="text"
                    name="position"
                    id="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
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
                        user ? 'Update User' : 'Create User'
                    )}
                </button>
            </div>
        </form>
    );
};

export default UserForm;
