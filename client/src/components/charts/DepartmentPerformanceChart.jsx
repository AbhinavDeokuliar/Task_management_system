import React from 'react';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from 'recharts';

const DepartmentPerformanceChart = ({ departmentData }) => {
    // Format data for the chart
    const formatData = () => {
        if (!departmentData || Object.keys(departmentData).length === 0) {
            return [];
        }

        return Object.entries(departmentData).map(([department, data]) => ({
            name: department,
            completed: data.completed,
            pending: data.pending,
            inProgress: data.in_progress,
            onTime: data.onTime,
            overdue: data.overdue,
            completionRate: data.completed / data.total * 100
        }));
    };

    const data = formatData();

    if (data.length === 0) {
        return (
            <div className="h-full flex items-center justify-center">
                <p className="text-gray-400">No department performance data available</p>
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#444" vertical={false} />
                <XAxis
                    dataKey="name"
                    axisLine={{ stroke: '#666' }}
                    tick={{ fill: '#bbb' }}
                />
                <YAxis
                    axisLine={{ stroke: '#666' }}
                    tick={{ fill: '#bbb' }}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#1f2937',
                        borderColor: '#4338ca',
                        color: '#e2e8f0',
                        borderRadius: '0.375rem',
                    }}
                />
                <Legend
                    wrapperStyle={{ color: '#e2e8f0' }}
                    verticalAlign="top"
                />
                <Bar dataKey="completed" name="Completed" stackId="a" fill="#10b981" />
                <Bar dataKey="inProgress" name="In Progress" stackId="a" fill="#6366f1" />
                <Bar dataKey="pending" name="Pending" stackId="a" fill="#f59e0b" />
                <Bar dataKey="overdue" name="Overdue" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default DepartmentPerformanceChart;
