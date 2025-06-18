import { format, formatDistance, addDays, parseISO, isValid } from "date-fns";

/**
 * Format a date string to a human-readable format
 * @param {string} dateString - ISO date string
 * @param {string} formatStr - date-fns format string (default: 'MMM d, yyyy')
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, formatStr = "MMM d, yyyy") => {
	if (!dateString) return "";

	try {
		const date =
			typeof dateString === "string" ? parseISO(dateString) : dateString;
		if (!isValid(date)) return "Invalid date";
		return format(date, formatStr);
	} catch (error) {
		console.error("Error formatting date:", error);
		return "Invalid date";
	}
};

/**
 * Get relative time (e.g., "2 days ago", "in 3 days")
 * @param {string} dateString - ISO date string
 * @returns {string} Relative time string
 */
export const getRelativeTime = (dateString) => {
	if (!dateString) return "";

	try {
		const date =
			typeof dateString === "string" ? parseISO(dateString) : dateString;
		if (!isValid(date)) return "Invalid date";
		return formatDistance(date, new Date(), { addSuffix: true });
	} catch (error) {
		console.error("Error getting relative time:", error);
		return "Invalid date";
	}
};

/**
 * Calculate days remaining until a deadline
 * @param {string} deadlineString - ISO date string
 * @returns {object} Object with daysRemaining and isOverdue properties
 */
export const getDaysRemaining = (deadlineString) => {
	if (!deadlineString) {
		return { daysRemaining: null, isOverdue: false };
	}

	try {
		const deadline =
			typeof deadlineString === "string"
				? parseISO(deadlineString)
				: deadlineString;
		if (!isValid(deadline)) return { daysRemaining: null, isOverdue: false };

		const today = new Date();
		// Reset hours to compare dates only
		today.setHours(0, 0, 0, 0);
		const deadlineCopy = new Date(deadline);
		deadlineCopy.setHours(0, 0, 0, 0);

		const diffTime = deadlineCopy - today;
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		return {
			daysRemaining: diffDays,
			isOverdue: diffDays < 0,
		};
	} catch (error) {
		console.error("Error calculating days remaining:", error);
		return { daysRemaining: null, isOverdue: false };
	}
};

/**
 * Format a date for calendar view
 * @param {number} year - Year
 * @param {number} month - Month (0-11)
 * @param {number} day - Day of month
 * @returns {string} ISO date string (YYYY-MM-DD)
 */
export const formatCalendarDate = (year, month, day) => {
	return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(
		2,
		"0"
	)}`;
};

export default {
	formatDate,
	getRelativeTime,
	getDaysRemaining,
	formatCalendarDate,
};
