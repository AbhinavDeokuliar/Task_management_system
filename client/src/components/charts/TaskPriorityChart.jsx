import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';

const TaskPriorityChart = ({ priorityData }) => {
    // Transform the object data into array format for the chart
    const formatData = () => {
        // Check if we have valid data
        if (!priorityData || typeof priorityData !== 'object' || Object.keys(priorityData).length === 0) {
            return [];
        }

        // Priority display names (for better readability)
        const priorityNames = {
            'low': 'Low',
            'medium': 'Medium',
            'high': 'High'
        };

        // Create array data for the chart
        return Object.entries(priorityData)
            .map(([priority, count]) => ({
                name: priorityNames[priority] || priority,
                count: count,
                // Store the original key for color assignment
                priority: priority
            }))
            .sort((a, b) => {
                // Sort by priority: high, medium, low
                const order = { 'high': 1, 'medium': 2, 'low': 3 };
                return order[a.priority] - order[b.priority];
            });
    };

    const data = formatData();

    // Handle empty data
    if (data.length === 0) {
        return (
            <div className="h-full flex items-center justify-center">
                <p className="text-gray-400">No priority data available</p>
            </div>
        );
    }

    // Custom tooltip
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-gray-800 border border-indigo-500/30 p-3 rounded-md shadow-lg">
                    <p className="text-sm font-medium text-white">
                        {payload[0].payload.name}: <span className="font-bold">{payload[0].value}</span>
                    </p>
                    <p className="text-xs text-gray-300 mt-1">
                        {Math.round((payload[0].value / data.reduce((sum, item) => sum + item.count, 0)) * 100)}% of total
                    </p>
                </div>
            );
        }
        return null;
    };

    // Get color based on priority
    const getBarColor = (priority) => {
        switch (priority) {
            case 'high':
                return '#ef4444'; // red-500
            case 'medium':
                return '#f59e0b'; // amber-500
            case 'low':
                return '#3b82f6'; // blue-500
            default:
                return '#6b7280'; // gray-500
        }
    };

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={data}
                margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis
                    dataKey="name"
                    tick={{ fill: '#bbb' }}
                    axisLine={{ stroke: '#666' }}
                />
                <YAxis
                    tick={{ fill: '#bbb' }}
                    axisLine={{ stroke: '#666' }}
                    allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                    wrapperStyle={{ color: '#e2e8f0' }}
                    verticalAlign="top"
                />
                <Bar
                    dataKey="count"
                    name="Tasks"
                    radius={[4, 4, 0, 0]}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getBarColor(entry.priority)} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

export default TaskPriorityChart;
