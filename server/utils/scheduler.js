/**
 * Scheduler for running periodic tasks
 */
const { sendDeadlineReminders } = require("../utils/deadlineReminder");

/**
 * Schedule all periodic tasks
 */
const scheduleJobs = () => {
	// Run deadline reminders daily at 8:00 AM
	setInterval(async () => {
		const now = new Date();
		if (now.getHours() === 8 && now.getMinutes() === 0) {
			console.log("Running scheduled deadline reminders check...");
			await sendDeadlineReminders();
		}
	}, 60 * 1000); // Check every minute
};

module.exports = scheduleJobs;
