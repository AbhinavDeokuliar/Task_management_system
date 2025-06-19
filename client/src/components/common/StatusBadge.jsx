import { useState } from 'react';

const StatusBadge = ({ status }) => {
    const [isHovered, setIsHovered] = useState(false);

    const getStatusClass = () => {
        switch (status?.toLowerCase()) {
            case 'completed':
                return 'bg-gradient-to-r from-green-800 to-green-600 text-green-100 border-green-500';
            case 'in_progress':
            case 'in progress':
                return 'bg-gradient-to-r from-blue-800 to-blue-600 text-blue-100 border-blue-500';
            case 'pending':
                return 'bg-gradient-to-r from-yellow-800 to-yellow-600 text-yellow-100 border-yellow-500';
            case 'archived':
                return 'bg-gradient-to-r from-gray-800 to-gray-600 text-gray-100 border-gray-500';
            case 'overdue':
                return 'bg-gradient-to-r from-red-800 to-red-600 text-red-100 border-red-500';
            default:
                return 'bg-gradient-to-r from-gray-800 to-gray-600 text-gray-100 border-gray-500';
        }
    };

    const formatStatus = () => {
        if (!status) return 'Unknown';

        // Convert in_progress to In Progress
        return status
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    return (
        <span
            className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-medium rounded-full border ${getStatusClass()} shadow-sm transition-all duration-300 ${isHovered ? 'scale-110' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <svg className="w-3 h-3 mr-1 self-center" viewBox="0 0 100 100" fill="currentColor" style={{ opacity: 0.8 }}>
                <circle cx="50" cy="50" r="50" />
            </svg>
            {formatStatus()}
        </span>
    );
};

export default StatusBadge;
