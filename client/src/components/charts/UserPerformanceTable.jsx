import React, { useState } from 'react';

const UserPerformanceTable = ({ performanceData }) => {
    const [sortField, setSortField] = useState('tasksCompleted');
    const [sortDirection, setSortDirection] = useState('desc');

    if (!performanceData || performanceData.length === 0) {
        return (
            <div className="rounded-lg border border-gray-700 p-6 text-center">
                <p className="text-gray-400">No user performance data available</p>
            </div>
        );
    }

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('desc');
        }
    };

    const sortedData = [...performanceData].sort((a, b) => {
        let valueA = a[sortField];
        let valueB = b[sortField];

        // Handle numeric sorting
        if (typeof valueA === 'number' && typeof valueB === 'number') {
            return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
        }

        // Handle string sorting
        valueA = String(valueA).toLowerCase();
        valueB = String(valueB).toLowerCase();

        if (valueA < valueB) {
            return sortDirection === 'asc' ? -1 : 1;
        }
        if (valueA > valueB) {
            return sortDirection === 'asc' ? 1 : -1;
        }
        return 0;
    });

    // Function to render sort indicator
    const renderSortIndicator = (field) => {
        if (sortField !== field) return null;
        return (
            <span className="ml-1">
                {sortDirection === 'asc' ? '↑' : '↓'}
            </span>
        );
    };

    // Function to determine completion speed style
    const getCompletionSpeedStyle = (speed) => {
        // Negative speed means faster than deadline
        if (speed <= -1) return "text-green-400";
        if (speed < 0) return "text-emerald-400";
        if (speed === 0) return "text-yellow-400";
        if (speed <= 1) return "text-amber-400";
        return "text-red-400";
    };

    // Function to format completion speed text
    const formatCompletionSpeed = (speed) => {
        if (speed < 0) return `${Math.abs(speed).toFixed(1)} days ahead`;
        if (speed === 0) return "On time";
        return `${speed.toFixed(1)} days late`;
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-800/50">
                    <tr>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                            onClick={() => handleSort('name')}
                        >
                            User {renderSortIndicator('name')}
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                            onClick={() => handleSort('department')}
                        >
                            Department {renderSortIndicator('department')}
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                            onClick={() => handleSort('tasksCompleted')}
                        >
                            Tasks Completed {renderSortIndicator('tasksCompleted')}
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                            onClick={() => handleSort('onTimePercentage')}
                        >
                            On Time % {renderSortIndicator('onTimePercentage')}
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                            onClick={() => handleSort('averageCompletionSpeed')}
                        >
                            Avg. Completion {renderSortIndicator('averageCompletionSpeed')}
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-gray-900/30 divide-y divide-gray-700">
                    {sortedData.map((user, index) => (
                        <tr key={user.userId || index} className="hover:bg-gray-800/30 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center mr-3 text-white text-sm font-medium">
                                        {user.name?.charAt(0) || "U"}
                                    </div>
                                    <div className="text-sm font-medium text-white">{user.name}</div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                {user.department}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-white">{user.tasksCompleted}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div
                                        className={`text-sm font-medium ${user.onTimePercentage >= 90 ? 'text-green-400' :
                                                user.onTimePercentage >= 75 ? 'text-emerald-400' :
                                                    user.onTimePercentage >= 60 ? 'text-yellow-400' : 'text-red-400'
                                            }`}
                                    >
                                        {user.onTimePercentage?.toFixed(1)}%
                                    </div>
                                    <div className="ml-3 w-16 bg-gray-700 rounded-full h-1.5">
                                        <div
                                            className={`h-1.5 rounded-full ${user.onTimePercentage >= 90 ? 'bg-green-500' :
                                                    user.onTimePercentage >= 75 ? 'bg-emerald-500' :
                                                        user.onTimePercentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                                }`}
                                            style={{ width: `${user.onTimePercentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={getCompletionSpeedStyle(user.averageCompletionSpeed)}>
                                    {formatCompletionSpeed(user.averageCompletionSpeed)}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserPerformanceTable;
