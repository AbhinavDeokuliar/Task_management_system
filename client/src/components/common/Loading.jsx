import { useEffect, useState } from 'react';

const Loading = ({ message = 'Loading...', center = true }) => {
    const [dots, setDots] = useState('');
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const dotsInterval = setInterval(() => {
            setDots(prev => prev.length >= 3 ? '' : prev + '.');
        }, 300);

        const showTimer = setTimeout(() => {
            setIsVisible(true);
        }, 100);

        return () => {
            clearInterval(dotsInterval);
            clearTimeout(showTimer);
        };
    }, []);

    const containerClasses = center ?
        'flex justify-center items-center h-full min-h-[200px]' :
        'py-4';

    return (
        <div className={`${containerClasses} transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex flex-col items-center p-6 bg-gray-900/50 rounded-lg border border-indigo-500/30 shadow-lg">
                <div className="relative">
                    <div className="h-16 w-16 rounded-full border-t-2 border-b-2 border-indigo-600 animate-spin"></div>
                    <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-r-2 border-l-2 border-purple-500 animate-pulse opacity-70"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-8 w-8 bg-indigo-500 rounded-full animate-pulse opacity-30"></div>
                    </div>
                </div>
                <p className="text-indigo-300 mt-4 font-medium">{message}{dots}</p>
            </div>
        </div>
    );
};

export default Loading;
