const PriorityBadge = ({ priority }) => {
    const getPriorityClass = () => {
        switch (priority?.toLowerCase()) {
            case 'high':
                return 'bg-red-100 text-red-800';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800';
            case 'low':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatPriority = () => {
        if (!priority) return 'Unknown';
        return priority.charAt(0).toUpperCase() + priority.slice(1);
    };

    return (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityClass()}`}>
            {formatPriority()}
        </span>
    );
};

export default PriorityBadge;
