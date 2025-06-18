import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Calendar = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);

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
            }
        };

        fetchCalendarData();
    }, []);

    const getPriorityClass = (priority) => {
        switch (priority) {
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

    const getStatusClass = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'in_progress':
                return 'bg-blue-100 text-blue-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Generate calendar days for the current month
    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay();
    };

    const generateCalendar = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();

        const daysInMonth = getDaysInMonth(year, month);
        const firstDayOfMonth = getFirstDayOfMonth(year, month);

        const days = [];

        // Add empty cells for days before the first day of month
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className="h-24 border p-1 bg-gray-50"></div>);
        }

        // Add cells for each day of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayEvents = events.filter(event => event.date === date);

            days.push(
                <div
                    key={day}
                    className={`h-24 border p-1 ${selectedDate === date ? 'bg-indigo-50' : 'hover:bg-gray-50'
                        }`}
                    onClick={() => setSelectedDate(date)}
                >
                    <div className="flex justify-between">
                        <span className="font-medium">{day}</span>
                        {dayEvents.length > 0 && (
                            <span className="text-xs bg-indigo-100 text-indigo-800 px-1.5 rounded-full">
                                {dayEvents.length}
                            </span>
                        )}
                    </div>
                    <div className="mt-1 max-h-20 overflow-y-auto">
                        {dayEvents.map(event => (
                            <div
                                key={event.id}
                                className={`text-xs p-1 mb-1 rounded truncate ${getPriorityClass(event.priority)}`}
                            >
                                <Link to={`/tasks/${event.id}`}>
                                    {event.title}
                                </Link>
                            </div>
                        ))}
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
        return <div className="h-full flex items-center justify-center">Loading calendar...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold mb-8">Task Calendar</h1>

            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={prevMonth}
                    className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200"
                >
                    Previous
                </button>
                <h2 className="text-xl font-medium">
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h2>
                <button
                    onClick={nextMonth}
                    className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200"
                >
                    Next
                </button>
            </div>

            <div className="grid grid-cols-7 gap-0 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center font-medium py-2 bg-gray-100">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-0">
                {generateCalendar()}
            </div>

            {selectedDate && (
                <div className="mt-8">
                    <h3 className="text-xl font-medium mb-4">Tasks for {selectedDate}</h3>

                    {events.filter(event => event.date === selectedDate).length === 0 ? (
                        <p className="text-gray-500">No tasks scheduled for this day.</p>
                    ) : (
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {events
                                        .filter(event => event.date === selectedDate)
                                        .map(event => (
                                            <tr key={event.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{event.title}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(event.status)}`}>
                                                        {event.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityClass(event.priority)}`}>
                                                        {event.priority}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <Link to={`/tasks/${event.id}`} className="text-indigo-600 hover:text-indigo-900">View details</Link>
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
    );
};

export default Calendar;
