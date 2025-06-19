import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Loading from '../../components/common/Loading';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';

const Calendar = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [animate, setAnimate] = useState(false);

    // Fetch calendar data - in a real app, this would be an API call
    useEffect(() => {
        const fetchCalendarData = async () => {
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 800));

                // Mock data
                setEvents([
                    {
                        id: '1',
                        title: 'Complete frontend for user profile',
                        date: '2025-07-05',
                        priority: 'high',
                        status: 'in_progress'
                    },
                    {
                        id: '2',
                        title: 'Fix navigation menu issues',
                        date: '2025-07-08',
                        priority: 'medium',
                        status: 'pending'
                    },
                    {
                        id: '3',
                        title: 'Review API documentation',
                        date: '2025-06-28',
                        priority: 'low',
                        status: 'completed'
                    },
                    {
                        id: '4',
                        title: 'Implement data validation',
                        date: '2025-06-30',
                        priority: 'high',
                        status: 'pending'
                    }
                ]);
            } catch (error) {
                console.error('Error fetching calendar data:', error);
            } finally {
                setLoading(false);
                setTimeout(() => setAnimate(true), 100);
            }
        };

        fetchCalendarData();
    }, []);

    // Generate calendar days for the current month
    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay();
    };

    // Function to check if a day has events
    const hasEvents = (date) => {
        return events.some(event => event.date === date);
    };

    // Function to get event dot color based on highest priority event for that day
    const getEventDotColor = (date) => {
        const dayEvents = events.filter(event => event.date === date);
        if (dayEvents.length === 0) return '';

        if (dayEvents.some(e => e.priority === 'high')) return 'bg-red-400';
        if (dayEvents.some(e => e.priority === 'medium')) return 'bg-yellow-400';
        return 'bg-green-400';
    };

    const generateCalendar = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();

        const daysInMonth = getDaysInMonth(year, month);
        const firstDayOfMonth = getFirstDayOfMonth(year, month);

        const days = [];

        // Add empty cells for days before the first day of month
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className="h-28 border border-gray-700 bg-gray-800/50"></div>);
        }

        // Current date for highlighting today
        const today = new Date();
        const isToday = (day) => {
            return today.getDate() === day &&
                today.getMonth() === month &&
                today.getFullYear() === year;
        };

        // Add cells for each day of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayEvents = events.filter(event => event.date === date);
            const highlightToday = isToday(day);
            const eventDotColor = getEventDotColor(date);

            days.push(
                <div
                    key={day}
                    className={`h-28 border border-gray-700 p-1 transition-all duration-200
                        ${highlightToday ? 'bg-indigo-900/30 border-indigo-500' : 'bg-gray-800/80'}
                        ${selectedDate === date ? 'ring-2 ring-indigo-500' : ''}
                        hover:bg-gray-700/50 cursor-pointer`}
                    onClick={() => setSelectedDate(date)}
                >
                    <div className="flex justify-between">
                        <span className={`font-medium text-sm px-1 rounded-full ${highlightToday ? 'bg-indigo-500 text-white' : 'text-white'}`}>
                            {day}
                        </span>
                        {dayEvents.length > 0 && (
                            <span className="flex items-center space-x-1">
                                <span className={`h-2 w-2 rounded-full ${eventDotColor}`}></span>
                                <span className="text-xs bg-gray-900/70 text-indigo-300 px-1.5 py-0.5 rounded-full">
                                    {dayEvents.length}
                                </span>
                            </span>
                        )}
                    </div>
                    <div className="mt-1 max-h-20 overflow-y-auto space-y-1">
                        {dayEvents.slice(0, 2).map(event => (
                            <div
                                key={event.id}
                                className="text-xs py-1 px-1.5 rounded truncate bg-gray-900/50 border-l-2 border-indigo-500 text-white hover:bg-gray-900 transition-colors"
                            >
                                <Link to={`/tasks/${event.id}`} className="hover:text-indigo-300 transition-colors">
                                    {event.title}
                                </Link>
                            </div>
                        ))}
                        {dayEvents.length > 2 && (
                            <div className="text-xs text-indigo-400 pl-1">
                                + {dayEvents.length - 2} more
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return days;
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    if (loading) {
        return <Loading message="Loading calendar" />;
    }

    return (
        <div className="container mx-auto px-4 py-6 relative">
            {/* Decorative elements */}
            <div className="absolute top-20 left-1/3 w-3 h-3 bg-indigo-500 rounded-full opacity-20 animate-float"></div>
            <div className="absolute bottom-10 right-1/4 w-2 h-2 bg-purple-400 rounded-full opacity-30 animate-float-delayed"></div>
            <div className="absolute top-1/2 right-10 w-4 h-4 bg-indigo-400 rounded-full opacity-10 animate-float-slow"></div>

            <div className={`transition-all duration-700 transform ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <h1 className="text-3xl font-bold mb-8 text-white">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
                        Task Calendar
                    </span>
                </h1>

                <div className="flex justify-between items-center mb-6 bg-gradient-to-b from-gray-800 to-gray-900 p-4 rounded-lg shadow-md border border-indigo-500/30">
                    <button
                        onClick={prevMonth}
                        className="px-4 py-2 bg-gray-800 text-indigo-300 rounded-md border border-indigo-500/30 hover:bg-gray-700 transition-all duration-200 transform hover:-translate-x-1 flex items-center"
                    >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                        </svg>
                        Previous
                    </button>

                    <h2 className="text-xl font-medium text-white">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-400">
                            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                        </span>
                    </h2>

                    <button
                        onClick={nextMonth}
                        className="px-4 py-2 bg-gray-800 text-indigo-300 rounded-md border border-indigo-500/30 hover:bg-gray-700 transition-all duration-200 transform hover:translate-x-1 flex items-center"
                    >
                        Next
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </button>
                </div>

                <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg shadow-md border border-indigo-500/30 overflow-hidden">
                    <div className="grid grid-cols-7 gap-0">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="text-center font-medium py-3 bg-gray-900/50 text-indigo-300 border-b border-gray-700">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-0">
                        {generateCalendar()}
                    </div>
                </div>

                {selectedDate && (
                    <div className="mt-8 animate-fade-in">
                        <h3 className="text-xl font-medium mb-4 text-white flex items-center">
                            <svg className="w-5 h-5 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
                                Tasks for {selectedDate}
                            </span>
                        </h3>

                        {events.filter(event => event.date === selectedDate).length === 0 ? (
                            <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-10 rounded-lg shadow-md border border-indigo-500/30 text-center">
                                <svg className="h-16 w-16 text-indigo-400 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="text-lg font-medium text-white">No tasks scheduled for this day</p>
                                <p className="mt-2 text-gray-400">Enjoy your free time or plan a new task</p>
                            </div>
                        ) : (
                            <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg shadow-md border border-indigo-500/30 overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-700">
                                    <thead className="bg-gray-900/50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">Task</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">Priority</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700">
                                        {events
                                            .filter(event => event.date === selectedDate)
                                            .map((event, index) => (
                                                <tr
                                                    key={event.id}
                                                    className="hover:bg-gray-800/50 transition-colors duration-150"
                                                    style={{ animationDelay: `${index * 100}ms` }}
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-white">{event.title}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <StatusBadge status={event.status} />
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <PriorityBadge priority={event.priority} />
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <Link
                                                            to={`/tasks/${event.id}`}
                                                            className="text-indigo-400 hover:text-indigo-300 transition-colors duration-200 flex items-center group"
                                                        >
                                                            View details
                                                            <svg className="w-4 h-4 ml-1 opacity-0 transform transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                                            </svg>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Calendar;
