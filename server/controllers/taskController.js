/**
 * Task Controller
 * Handles all task-related operations
 */
const Task = require("../models/taskModel");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const Email = require("../utils/email");

/**
 * Get all tasks
 * - Admin: all tasks
 * - Team member: only assigned tasks
 */
exports.getAllTasks = async (req, res, next) => {
	try {
		let filter = {};

		// If user is team member, only show their tasks
		if (req.user.role === "team_member") {
			filter = { assignedTo: req.user.id };
		}

		// Apply additional filters from query params
		if (req.query.status) filter.status = req.query.status;
		if (req.query.priority) filter.priority = req.query.priority;

		// Build query
		const tasks = await Task.find(filter);

		// SEND RESPONSE
		res.status(200).json({
			status: "success",
			results: tasks.length,
			data: {
				tasks,
			},
		});
	} catch (err) {
		next(err);
	}
};

/**
 * Get a single task by ID
 */
exports.getTask = async (req, res, next) => {
	try {
		const task = await Task.findById(req.params.id);

		if (!task) {
			return next(new AppError("No task found with that ID", 404));
		}

		// Check if team member has access to this task
		if (
			req.user.role === "team_member" &&
			task.assignedTo._id.toString() !== req.user.id
		) {
			return next(
				new AppError("You do not have permission to access this task", 403)
			);
		}

		res.status(200).json({
			status: "success",
			data: {
				task,
			},
		});
	} catch (err) {
		next(err);
	}
};

/**
 * Create a new task (Admin only)
 */
exports.createTask = async (req, res, next) => {
	try {
		// Add current user as creator
		req.body.createdBy = req.user.id;

		const newTask = await Task.create(req.body);

		// If task is assigned to someone, send email notification
		if (newTask.assignedTo) {
			const user = await User.findById(newTask.assignedTo);
			if (user) {
				try {
					const url = `${req.protocol}://${req.get("host")}/tasks/${
						newTask._id
					}`;
					await new Email(user, url).sendTaskAssignment(newTask);
				} catch (err) {
					console.error("Email could not be sent", err);
					// Don't block the API response if email fails
				}
			}
		}

		res.status(201).json({
			status: "success",
			data: {
				task: newTask,
			},
		});
	} catch (err) {
		next(err);
	}
};

/**
 * Update a task
 * - Admin: can update any task
 * - Team member: can only update status of assigned tasks
 */
exports.updateTask = async (req, res, next) => {
	try {
		const task = await Task.findById(req.params.id);

		if (!task) {
			return next(new AppError("No task found with that ID", 404));
		}

		// Restrict team members to only updating status of their own tasks
		if (req.user.role === "team_member") {
			// Check if task is assigned to current user
			if (task.assignedTo._id.toString() !== req.user.id) {
				return next(
					new AppError("You can only update tasks assigned to you", 403)
				);
			}

			// Only allow status updates
			const allowedFields = ["status"];
			Object.keys(req.body).forEach((key) => {
				if (!allowedFields.includes(key)) {
					delete req.body[key];
				}
			});

			// If status is being updated to completed, set completedAt
			if (req.body.status === "completed") {
				req.body.completedAt = Date.now();
			}
		}

		// Check if assignee is being changed
		const previousAssignee = task.assignedTo
			? task.assignedTo._id.toString()
			: null;
		const newAssignee = req.body.assignedTo;

		const updatedTask = await Task.findByIdAndUpdate(
			req.params.id,
			req.body,
			{
				new: true,
				runValidators: true,
			}
		);

		// If assignee has changed, send email notification
		if (newAssignee && newAssignee !== previousAssignee) {
			const user = await User.findById(newAssignee);
			if (user) {
				try {
					const url = `${req.protocol}://${req.get("host")}/tasks/${
						updatedTask._id
					}`;
					await new Email(user, url).sendTaskAssignment(updatedTask);
				} catch (err) {
					console.error("Email could not be sent", err);
					// Don't block the API response if email fails
				}
			}
		}

		res.status(200).json({
			status: "success",
			data: {
				task: updatedTask,
			},
		});
	} catch (err) {
		next(err);
	}
};

/**
 * Delete a task (Admin only)
 */
exports.deleteTask = async (req, res, next) => {
	try {
		const task = await Task.findByIdAndDelete(req.params.id);

		if (!task) {
			return next(new AppError("No task found with that ID", 404));
		}

		res.status(204).json({
			status: "success",
			data: null,
		});
	} catch (err) {
		next(err);
	}
};

/**
 * Get task statistics for analytics (Admin only)
 */
exports.getTaskStats = async (req, res, next) => {
	try {
		const stats = await Task.aggregate([
			{
				$facet: {
					statusStats: [
						{
							$group: {
								_id: "$status",
								count: { $sum: 1 },
							},
						},
					],
					priorityStats: [
						{
							$group: {
								_id: "$priority",
								count: { $sum: 1 },
							},
						},
					],
					overdueTasks: [
						{
							$match: {
								deadline: { $lt: new Date() },
								status: { $ne: "completed" },
							},
						},
						{ $count: "count" },
					],
					userAssignmentStats: [
						{
							$group: {
								_id: "$assignedTo",
								count: { $sum: 1 },
							},
						},
						{
							$lookup: {
								from: "users",
								localField: "_id",
								foreignField: "_id",
								as: "user",
							},
						},
						{
							$project: {
								_id: 1,
								count: 1,
								name: { $arrayElemAt: ["$user.name", 0] },
							},
						},
					],
				},
			},
		]);

		res.status(200).json({
			status: "success",
			data: {
				stats: stats[0],
			},
		});
	} catch (err) {
		next(err);
	}
};

/**
 * Get tasks for calendar view
 */
exports.getTasksForCalendar = async (req, res, next) => {
	try {
		const { startDate, endDate } = req.query;
		let filter = {};

		// Filter by date range if provided
		if (startDate && endDate) {
			filter.deadline = {
				$gte: new Date(startDate),
				$lte: new Date(endDate),
			};
		}

		// Team members can only see their tasks
		if (req.user.role === "team_member") {
			filter.assignedTo = req.user.id;
		}

		const tasks = await Task.find(filter).select(
			"title description deadline status priority"
		);

		res.status(200).json({
			status: "success",
			results: tasks.length,
			data: {
				tasks,
			},
		});
	} catch (err) {
		next(err);
	}
};

/**
 * Add comment to task
 */
exports.addComment = async (req, res, next) => {
	try {
		const task = await Task.findById(req.params.id);

		if (!task) {
			return next(new AppError("No task found with that ID", 404));
		}

		// Team members can only comment on tasks assigned to them
		if (
			req.user.role === "team_member" &&
			task.assignedTo._id.toString() !== req.user.id
		) {
			return next(
				new AppError("You can only comment on tasks assigned to you", 403)
			);
		}

		const comment = {
			text: req.body.text,
			createdBy: req.user.id,
		};

		task.comments.push(comment);
		await task.save();

		res.status(201).json({
			status: "success",
			data: {
				task,
			},
		});
	} catch (err) {
		next(err);
	}
};
