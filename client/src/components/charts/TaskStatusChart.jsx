import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const TaskStatusChart = ({ statusData }) => {
    // Transform the object data into array format for the chart
    const formatData = () => {
        // Check if we have valid data
        if (!statusData || typeof statusData !== 'object' || Object.keys(statusData).length === 0) {
            return [];
        }

        // Status display names (for better readability)
        const statusNames = {
            'pending': 'Pending',
            'in_progress': 'In Progress',
            'completed': 'Completed',
            'archived': 'Archived'
        };

        // Colors for each status
        const statusColors = {
            'pending': '#f59e0b',  // amber-500
            'in_progress': '#6366f1', // indigo-500
            'completed': '#10b981', // emerald-500
            'archived': '#6b7280'  // gray-500
        };

        // Create array data for the chart
        return Object.entries(statusData).map(([status, count]) => ({
            name: statusNames[status] || status,
            value: count,
            color: statusColors[status] || '#6b7280' // default to gray if status not recognized
        }));
    };

    const data = formatData();

    // Handle empty data
    if (data.length === 0) {
        return (
            <div className="h-full flex items-center justify-center">
                <p className="text-gray-400">No status data available</p>
            </div>
        );
    }

    // Custom tooltip
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-gray-800 border border-indigo-500/30 p-3 rounded-md shadow-lg">
                    <p className="text-sm font-medium text-white">
                        {payload[0].name}: <span className="font-bold">{payload[0].value}</span>
                    </p>
                    <p className="text-xs text-gray-300 mt-1">
                        {Math.round((payload[0].value / data.reduce((sum, item) => sum + item.value, 0)) * 100)}% of total
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    innerRadius={50}
                    fill="#8884d8"
                    dataKey="value"
                    paddingAngle={2}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="#27272a" strokeWidth={2} />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    formatter={(value) => <span className="text-sm text-gray-300">{value}</span>}
                />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default TaskStatusChart;
