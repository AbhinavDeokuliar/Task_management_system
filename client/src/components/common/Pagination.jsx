const Pagination = ({
    currentPage,
    totalPages,
    onPageChange
}) => {
    if (totalPages <= 1) return null;

    // Calculate page numbers to show
    const getPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5;

        if (totalPages <= maxPagesToShow) {
            // Show all pages if there are 5 or fewer
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);

            // Calculate middle pages
            let startPage = Math.max(2, currentPage - 1);
            let endPage = Math.min(totalPages - 1, currentPage + 1);

            // Adjust if we're near the beginning or end
            if (currentPage <= 2) {
                endPage = 4;
            } else if (currentPage >= totalPages - 1) {
                startPage = totalPages - 3;
            }

            // Add ellipsis if needed
            if (startPage > 2) {
                pages.push('...');
            }

            // Add middle pages
            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }

            // Add ellipsis if needed
            if (endPage < totalPages - 1) {
                pages.push('...');
            }

            // Always show last page
            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <div className="flex items-center justify-center mt-6 space-x-1">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${currentPage === 1
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
            >
                Previous
            </button>

            {getPageNumbers().map((page, index) => (
                page === '...' ? (
                    <span key={`ellipsis-${index}`} className="px-3 py-1">...</span>
                ) : (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`px-3 py-1 rounded ${currentPage === page
                                ? 'bg-indigo-600 text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        {page}
                    </button>
                )
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded ${currentPage === totalPages
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
