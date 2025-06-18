import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

// Register required Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const TaskTrendChart = ({ trendData = [] }) => {
    // Default data if none provided
    const defaultData = [
        { month: 'Jan', completed: 5, created: 8 },
        { month: 'Feb', completed: 7, created: 6 },
        { month: 'Mar', completed: 10, created: 9 },
        { month: 'Apr', completed: 8, created: 12 },
        { month: 'May', completed: 12, created: 10 },
        { month: 'Jun', completed: 14, created: 11 }
    ];

    const chartData = trendData.length > 0 ? trendData : defaultData;

    const data = {
        labels: chartData.map(item => item.month),
        datasets: [
            {
                label: 'Tasks Created',
                data: chartData.map(item => item.created),
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                tension: 0.3,
            },
            {
                label: 'Tasks Completed',
                data: chartData.map(item => item.completed),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.3,
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0
                }
            }
        },
        plugins: {
            legend: {
                position: 'bottom',
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            },
        },
    };

    return (
        <div style={{ height: '300px' }}>
            <Line data={data} options={options} />
        </div>
    );
};

export default TaskTrendChart;
