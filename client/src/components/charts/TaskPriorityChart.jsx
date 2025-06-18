import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const TaskPriorityChart = ({ priorityData = {} }) => {
    const { high = 0, medium = 0, low = 0 } = priorityData;

    const data = {
        labels: ['High', 'Medium', 'Low'],
        datasets: [
            {
                data: [high, medium, low],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)', // Red for high
                    'rgba(255, 159, 64, 0.7)', // Orange for medium
                    'rgba(75, 192, 192, 0.7)', // Green for low
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(75, 192, 192, 1)',
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
        cutout: '50%',
    };

    return (
        <div style={{ height: '250px' }}>
            <Doughnut data={data} options={options} />
        </div>
    );
};

export default TaskPriorityChart;
