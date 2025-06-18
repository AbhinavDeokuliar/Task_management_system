const StatusBadge = ({ status }) => {
    const getStatusClass = () => {
        switch (status?.toLowerCase()) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'in_progress':
            case 'in progress':
                return 'bg-blue-100 text-blue-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'archived':
                return 'bg-gray-100 text-gray-800';
            case 'overdue':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
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
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass()}`}>
            {formatStatus()}
        </span>
    );
};

export default StatusBadge;
