import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const TaskStatusChart = ({ statusData = {} }) => {
    const { pending = 0, in_progress = 0, completed = 0, archived = 0 } = statusData;

    const data = {
        labels: ['Pending', 'In Progress', 'Completed', 'Archived'],
        datasets: [
            {
                data: [pending, in_progress, completed, archived],
                backgroundColor: [
                    'rgba(255, 206, 86, 0.7)',  // Yellow for pending
                    'rgba(54, 162, 235, 0.7)',  // Blue for in progress
                    'rgba(75, 192, 192, 0.7)',  // Green for completed
                    'rgba(201, 203, 207, 0.7)', // Grey for archived
                ],
                borderColor: [
                    'rgba(255, 206, 86, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(201, 203, 207, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        plugins: {
            legend: {
                position: 'bottom',
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                        return `${label}: ${value} (${percentage}%)`;
                    }
                }
            }
        },
        responsive: true,
        maintainAspectRatio: false,
    };

    return (
        <div style={{ height: '250px' }}>
            <Pie data={data} options={options} />
        </div>
    );
};

export default TaskStatusChart;
