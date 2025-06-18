const Loading = ({ message = 'Loading...', center = true }) => {
    const containerClasses = center ?
        'flex justify-center items-center h-full min-h-[200px]' :
        'py-4';

    return (
        <div className={containerClasses}>
            <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600 mb-2"></div>
                <p className="text-gray-600">{message}</p>
            </div>
        </div>
    );
};

export default Loading;
