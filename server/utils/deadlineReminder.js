/**
 * Utility for checking and sending deadline reminders
 */
const Task = require("../models/taskModel");
const User = require("../models/userModel");
const Email = require("./email");

/**
 * Send deadline reminders for tasks approaching their deadlines
 * This can be scheduled to run daily
 */
exports.sendDeadlineReminders = async () => {
	try {
		const today = new Date();
		const threeDaysFromNow = new Date();
		threeDaysFromNow.setDate(today.getDate() + 3);

		// Find tasks that are:
		// 1. Not completed
		// 2. Have a deadline within 3 days
		const tasks = await Task.find({
			status: { $ne: "completed" },
			deadline: {
				$gte: today,
				$lte: threeDaysFromNow,
			},
			assignedTo: { $ne: null }, // Must be assigned to someone
		}).populate({
			path: "assignedTo",
			select: "name email",
		});

		console.log(`Found ${tasks.length} tasks with approaching deadlines`);

		// Send emails for each task
		for (const task of tasks) {
			if (!task.assignedTo) continue;

			const daysLeft = Math.ceil(
				(task.deadline - today) / (1000 * 60 * 60 * 24)
			);

			try {
				const url = `${process.env.FRONTEND_URL}/tasks/${task._id}`;
				await new Email(task.assignedTo, url).sendDeadlineReminder(
					task,
					daysLeft
				);
				console.log(
					`Reminder sent for task "${task.title}" to ${task.assignedTo.email}`
				);
			} catch (err) {
				console.error(`Failed to send reminder for task ${task._id}:`, err);
			}
		}

		return {
			success: true,
			remindersSent: tasks.length,
		};
	} catch (err) {
		console.error("Error in sendDeadlineReminders:", err);
		return {
			success: false,
			error: err.message,
		};
	}
};
