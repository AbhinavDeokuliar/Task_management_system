import React from 'react';
import {
    ResponsiveContainer,
    ComposedChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Line
} from 'recharts';

const WorkloadDistributionChart = ({ workloadData }) => {
    // Format data for the chart
    const formatData = () => {
        if (!workloadData || workloadData.length === 0) {
            return [];
        }

        return workloadData.map(user => ({
            name: user.userName,
            high: user.highPriority || 0,
            medium: user.mediumPriority || 0,
            low: user.lowPriority || 0,
            averageTime: user.averageCompletionTime || 0,
            department: user.department
        }));
    };

    const data = formatData();

    if (data.length === 0) {
        return (
            <div className="h-full flex items-center justify-center">
                <p className="text-gray-400">No workload distribution data available</p>
            </div>
        );
    }

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-gray-800 border border-indigo-500/30 p-3 rounded-md shadow-lg">
                    <p className="text-sm font-medium text-white mb-1">{label}</p>
                    <p className="text-xs text-gray-300 mb-1">Department: {payload[0]?.payload.department || 'N/A'}</p>
                    <div className="space-y-1">
                        {payload.map((entry, index) => (
                            <p key={`item-${index}`} style={{ color: entry.color }} className="text-xs flex justify-between">
                                <span>{entry.name}: </span>
                                <span className="font-medium">{entry.value}</span>
                            </p>
                        ))}
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 20 }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#444" vertical={false} />
                <XAxis
                    dataKey="name"
                    axisLine={{ stroke: '#666' }}
                    tick={{ fill: '#bbb' }}
                    tickLine={{ stroke: '#666' }}
                    angle={-25}
                    height={60}
                    textAnchor="end"
                />
                <YAxis
                    yAxisId="left"
                    axisLine={{ stroke: '#666' }}
                    tick={{ fill: '#bbb' }}
                    label={{
                        value: 'Tasks',
                        angle: -90,
                        position: 'insideLeft',
                        style: { fill: '#bbb' }
                    }}
                />
                <YAxis
                    yAxisId="right"
                    orientation="right"
                    axisLine={{ stroke: '#666' }}
                    tick={{ fill: '#bbb' }}
                    label={{
                        value: 'Avg. Days',
                        angle: -90,
                        position: 'insideRight',
                        style: { fill: '#bbb' }
                    }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                    wrapperStyle={{ color: '#e2e8f0' }}
                    verticalAlign="top"
                />
                <Bar dataKey="high" name="High Priority" stackId="a" fill="#ef4444" yAxisId="left" />
                <Bar dataKey="medium" name="Medium Priority" stackId="a" fill="#f59e0b" yAxisId="left" />
                <Bar dataKey="low" name="Low Priority" stackId="a" fill="#3b82f6" yAxisId="left" />
                <Line
                    type="monotone"
                    dataKey="averageTime"
                    name="Avg. Completion Time (days)"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    yAxisId="right"
                    dot={{ stroke: '#8b5cf6', strokeWidth: 2, r: 4, fill: '#1f2937' }}
                />
            </ComposedChart>
        </ResponsiveContainer>
    );
};

export default WorkloadDistributionChart;
