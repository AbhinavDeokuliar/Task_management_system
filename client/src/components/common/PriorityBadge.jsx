import { useState } from 'react';

const PriorityBadge = ({ priority }) => {
    const [isHovered, setIsHovered] = useState(false);

    const getPriorityClass = () => {
        switch (priority?.toLowerCase()) {
            case 'high':
                return 'bg-gradient-to-r from-red-800 to-red-600 text-red-100 border-red-500';
            case 'medium':
                return 'bg-gradient-to-r from-yellow-800 to-yellow-600 text-yellow-100 border-yellow-500';
            case 'low':
                return 'bg-gradient-to-r from-green-800 to-green-600 text-green-100 border-green-500';
            default:
                return 'bg-gradient-to-r from-gray-800 to-gray-600 text-gray-100 border-gray-500';
        }
    };

    const getPriorityIcon = () => {
        switch (priority?.toLowerCase()) {
            case 'high':
                return (
                    <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                );
            case 'medium':
                return (
                    <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            case 'low':
                return (
                    <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                );
            default:
                return null;
        }
    };

    const formatPriority = () => {
        if (!priority) return 'Unknown';
        return priority.charAt(0).toUpperCase() + priority.slice(1);
    };

    return (
        <span
            className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-medium items-center rounded-full border ${getPriorityClass()} shadow-sm transition-all duration-300 ${isHovered ? 'scale-110' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {getPriorityIcon()}
            {formatPriority()}
        </span>
    );
};

export default PriorityBadge;
