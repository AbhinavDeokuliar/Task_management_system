import React from 'react';
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from 'recharts';

const TaskTrendChart = ({ trendData }) => {
    // Handle empty or invalid data
    if (!trendData || !Array.isArray(trendData) || trendData.length === 0) {
        return (
            <div className="h-full flex items-center justify-center">
                <p className="text-gray-400">No trend data available</p>
            </div>
        );
    }

    // Custom tooltip to make it look better
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-gray-800 border border-indigo-500/30 p-3 rounded-md shadow-lg">
                    <p className="text-sm font-medium text-white mb-2">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={`item-${index}`} style={{ color: entry.color }} className="text-xs flex justify-between">
                            <span>{entry.name}: </span>
                            <span className="font-medium ml-4">{entry.value}</span>
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
                data={trendData}
                margin={{
                    top: 5,
                    right: 30,
                    left: 5,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis
                    dataKey="month"
                    tick={{ fill: '#bbb' }}
                    axisLine={{ stroke: '#666' }}
                />
                <YAxis
                    tick={{ fill: '#bbb' }}
                    axisLine={{ stroke: '#666' }}
                    allowDecimals={false}
                    domain={[0, 'auto']}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                    wrapperStyle={{ color: '#e2e8f0' }}
                    verticalAlign="top"
                />
                <Line
                    type="monotone"
                    dataKey="created"
                    name="Tasks Created"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    activeDot={{ r: 6 }}
                    dot={{ stroke: '#8b5cf6', strokeWidth: 2, r: 4, fill: '#1f2937' }}
                />
                <Line
                    type="monotone"
                    dataKey="completed"
                    name="Tasks Completed"
                    stroke="#10b981"
                    strokeWidth={2}
                    activeDot={{ r: 6 }}
                    dot={{ stroke: '#10b981', strokeWidth: 2, r: 4, fill: '#1f2937' }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default TaskTrendChart;
