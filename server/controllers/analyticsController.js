/**
 * Analytics Controller
 * Provides comprehensive task analytics and reporting features
 */
const Task = require("../models/taskModel");
const User = require("../models/userModel");
const AppError = require("../utils/appError");

/**
 * Get task completion statistics over time
 */
exports.getCompletionStats = async (req, res, next) => {
	try {
		// Default to last 6 months if no timeframe specified
		const { period = "month", count = 6 } = req.query;

		let timeGrouping;
		let dateFormat;
		let startDate = new Date();

		// Set up time period grouping based on period parameter
		switch (period) {
			case "day":
				timeGrouping = {
					$dateToString: { format: "%Y-%m-%d", date: "$completedAt" },
				};
				dateFormat = "%Y-%m-%d";
				startDate.setDate(startDate.getDate() - count);
				break;
			case "week":
				timeGrouping = {
					$dateToString: {
						format: "%G-W%V",
						date: "$completedAt",
					},
				};
				dateFormat = "%G-W%V";
				startDate.setDate(startDate.getDate() - count * 7);
				break;
			case "month":
			default:
				timeGrouping = {
					$dateToString: { format: "%Y-%m", date: "$completedAt" },
				};
				dateFormat = "%Y-%m";
				startDate.setMonth(startDate.getMonth() - count);
				break;
		}

		// Query for completed tasks in the specified time range
		const completedTasks = await Task.aggregate([
			{
				$match: {
					status: "completed",
					completedAt: { $gte: startDate },
				},
			},
			{
				$group: {
					_id: timeGrouping,
					count: { $sum: 1 },
				},
			},
			{
				$sort: { _id: 1 },
			},
		]);

		// Generate missing periods with zero counts to ensure consistent data
		const results = fillMissingPeriods(
			completedTasks,
			period,
			count,
			dateFormat
		);

		res.status(200).json({
			status: "success",
			data: {
				period,
				stats: results,
			},
		});
	} catch (err) {
		next(err);
	}
};

/**
 * Get workload distribution across team members
 */
exports.getWorkloadDistribution = async (req, res, next) => {
	try {
		// Get active tasks by assignee
		const workloadStats = await Task.aggregate([
			{
				$match: {
					status: { $in: ["pending", "in_progress"] },
					assignedTo: { $ne: null },
				},
			},
			{
				$group: {
					_id: "$assignedTo",
					totalTasks: { $sum: 1 },
					highPriority: {
						$sum: { $cond: [{ $eq: ["$priority", "high"] }, 1, 0] },
					},
					mediumPriority: {
						$sum: { $cond: [{ $eq: ["$priority", "medium"] }, 1, 0] },
					},
					lowPriority: {
						$sum: { $cond: [{ $eq: ["$priority", "low"] }, 1, 0] },
					},
					averageCompletionTime: {
						$avg: { $subtract: ["$completedAt", "$createdAt"] },
					},
				},
			},
			{
				$lookup: {
					from: "users",
					localField: "_id",
					foreignField: "_id",
					as: "userDetails",
				},
			},
			{
				$project: {
					_id: 1,
					totalTasks: 1,
					highPriority: 1,
					mediumPriority: 1,
					lowPriority: 1,
					averageCompletionTime: {
						$divide: [
							{ $ifNull: ["$averageCompletionTime", 0] },
							86400000,
						],
					}, // Convert to days
					userName: { $arrayElemAt: ["$userDetails.name", 0] },
					department: { $arrayElemAt: ["$userDetails.department", 0] },
				},
			},
			{
				$sort: { totalTasks: -1 },
			},
		]);

		res.status(200).json({
			status: "success",
			results: workloadStats.length,
			data: {
				workload: workloadStats,
			},
		});
	} catch (err) {
		next(err);
	}
};

/**
 * Get task status breakdown per department
 */
exports.getDepartmentPerformance = async (req, res, next) => {
	try {
		// Get all users with their departments
		const users = await User.find().select("_id department");

		// Create a map of user ID to department
		const userDepartmentMap = {};
		users.forEach((user) => {
			userDepartmentMap[user._id] = user.department;
		});

		// Get tasks
		const tasks = await Task.find({ assignedTo: { $ne: null } })
			.select("status priority assignedTo createdAt completedAt")
			.populate("assignedTo", "department");

		// Group tasks by department
		const departmentStats = {};

		tasks.forEach((task) => {
			const department = task.assignedTo?.department || "Unassigned";

			if (!departmentStats[department]) {
				departmentStats[department] = {
					total: 0,
					completed: 0,
					pending: 0,
					in_progress: 0,
					archived: 0,
					onTime: 0,
					overdue: 0,
					averageCompletionTime: 0,
					totalCompletionTime: 0,
					completedTasks: 0,
				};
			}

			departmentStats[department].total++;
			departmentStats[department][task.status]++;

			if (task.status === "completed") {
				const isOverdue = task.completedAt > task.deadline;

				if (isOverdue) {
					departmentStats[department].overdue++;
				} else {
					departmentStats[department].onTime++;
				}

				if (task.completedAt && task.createdAt) {
					const completionTime = task.completedAt - task.createdAt;
					departmentStats[department].totalCompletionTime +=
						completionTime;
					departmentStats[department].completedTasks++;
				}
			}
		});

		// Calculate averages
		Object.keys(departmentStats).forEach((dept) => {
			if (departmentStats[dept].completedTasks > 0) {
				departmentStats[dept].averageCompletionTime =
					departmentStats[dept].totalCompletionTime /
					departmentStats[dept].completedTasks /
					(1000 * 60 * 60 * 24); // Convert to days
			}
			delete departmentStats[dept].totalCompletionTime;
			delete departmentStats[dept].completedTasks;
		});

		res.status(200).json({
			status: "success",
			data: {
				departments: departmentStats,
			},
		});
	} catch (err) {
		next(err);
	}
};

/**
 * Get task creation and completion trends
 */
exports.getTaskTrends = async (req, res, next) => {
	try {
		const { period = "week", count = 12 } = req.query;
		let startDate = new Date();
		let timeGrouping;

		// Determine grouping format and start date
		switch (period) {
			case "day":
				startDate.setDate(startDate.getDate() - count);
				timeGrouping = {
					$dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
				};
				break;
			case "month":
				startDate.setMonth(startDate.getMonth() - count);
				timeGrouping = {
					$dateToString: { format: "%Y-%m", date: "$createdAt" },
				};
				break;
			case "week":
			default:
				startDate.setDate(startDate.getDate() - count * 7);
				timeGrouping = {
					$dateToString: {
						format: "%G-W%V", // ISO week format
						date: "$createdAt",
					},
				};
				break;
		}

		// Task creation trend
		const creationTrend = await Task.aggregate([
			{
				$match: {
					createdAt: { $gte: startDate },
				},
			},
			{
				$group: {
					_id: timeGrouping,
					count: { $sum: 1 },
				},
			},
			{
				$sort: { _id: 1 },
			},
		]);

		// Task completion trend
		const completionTrend = await Task.aggregate([
			{
				$match: {
					status: "completed",
					completedAt: { $gte: startDate },
				},
			},
			{
				$group: {
					_id: {
						$dateToString: {
							format:
								period === "day"
									? "%Y-%m-%d"
									: period === "month"
									? "%Y-%m"
									: "%G-W%V",
							date: "$completedAt",
						},
					},
					count: { $sum: 1 },
				},
			},
			{
				$sort: { _id: 1 },
			},
		]);

		res.status(200).json({
			status: "success",
			data: {
				period,
				created: creationTrend,
				completed: completionTrend,
			},
		});
	} catch (err) {
		next(err);
	}
};

/**
 * Get performance metrics for each user
 */
exports.getUserPerformance = async (req, res, next) => {
	try {
		// Get tasks with completion data
		const tasks = await Task.find({
			assignedTo: { $ne: null },
			status: "completed",
			completedAt: { $exists: true },
		}).select("assignedTo createdAt deadline completedAt priority");

		// Group tasks by user
		const userStats = {};

		tasks.forEach((task) => {
			const userId = task.assignedTo.toString();

			if (!userStats[userId]) {
				userStats[userId] = {
					tasksCompleted: 0,
					onTimeCompletion: 0,
					averageCompletionSpeed: 0, // Days before/after deadline (negative is good)
					totalTasks: 0,
					totalCompletionSpeed: 0,
				};
			}

			const onTime = task.completedAt <= task.deadline;
			const completionSpeed =
				(task.completedAt - task.deadline) / (1000 * 60 * 60 * 24); // Days

			userStats[userId].tasksCompleted++;
			userStats[userId].onTimeCompletion += onTime ? 1 : 0;
			userStats[userId].totalCompletionSpeed += completionSpeed;
			userStats[userId].totalTasks++;
		});

		// Calculate averages and percentages
		const userPerformance = [];
		for (const userId in userStats) {
			const stats = userStats[userId];

			if (stats.totalTasks > 0) {
				const user = await User.findById(userId).select(
					"name department position"
				);

				userPerformance.push({
					userId,
					name: user ? user.name : "Unknown User",
					department: user ? user.department : "Unknown",
					position: user ? user.position : "Unknown",
					tasksCompleted: stats.tasksCompleted,
					onTimePercentage:
						(stats.onTimeCompletion / stats.totalTasks) * 100,
					averageCompletionSpeed:
						stats.totalCompletionSpeed / stats.totalTasks,
				});
			}
		}

		// Sort by on-time percentage descending
		userPerformance.sort((a, b) => b.onTimePercentage - a.onTimePercentage);

		res.status(200).json({
			status: "success",
			results: userPerformance.length,
			data: {
				performance: userPerformance,
			},
		});
	} catch (err) {
		next(err);
	}
};

/**
 * Get task priority distribution with status breakdown
 */
exports.getPriorityDistribution = async (req, res, next) => {
	try {
		const distribution = await Task.aggregate([
			{
				$group: {
					_id: {
						priority: "$priority",
						status: "$status",
					},
					count: { $sum: 1 },
				},
			},
			{
				$group: {
					_id: "$_id.priority",
					total: { $sum: "$count" },
					statusBreakdown: {
						$push: {
							status: "$_id.status",
							count: "$count",
						},
					},
				},
			},
		]);

		res.status(200).json({
			status: "success",
			data: {
				distribution,
			},
		});
	} catch (err) {
		next(err);
	}
};

/**
 * Get overdue tasks analytics
 */
exports.getOverdueTasksAnalysis = async (req, res, next) => {
	try {
		const currentDate = new Date();

		// Find all tasks that are overdue
		const overdueTasks = await Task.find({
			status: { $nin: ["completed", "archived"] },
			deadline: { $lt: currentDate },
		}).populate("assignedTo", "name department");

		// Group by department and user
		const departmentStats = {};
		const userStats = {};

		overdueTasks.forEach((task) => {
			// Department statistics
			const department = task.assignedTo?.department || "Unassigned";
			if (!departmentStats[department]) {
				departmentStats[department] = {
					count: 0,
					highPriority: 0,
					mediumPriority: 0,
					lowPriority: 0,
					averageOverdueDays: 0,
					totalOverdueDays: 0,
				};
			}

			const overdueDays = Math.floor(
				(currentDate - task.deadline) / (1000 * 60 * 60 * 24)
			);

			departmentStats[department].count++;
			departmentStats[department][`${task.priority}Priority`]++;
			departmentStats[department].totalOverdueDays += overdueDays;

			// User statistics
			if (task.assignedTo) {
				const userId = task.assignedTo._id.toString();
				const userName = task.assignedTo.name;

				if (!userStats[userId]) {
					userStats[userId] = {
						userId,
						userName,
						department: task.assignedTo.department,
						count: 0,
						tasks: [],
					};
				}

				userStats[userId].count++;
				userStats[userId].tasks.push({
					taskId: task._id,
					title: task.title,
					priority: task.priority,
					deadline: task.deadline,
					overdueDays,
				});
			}
		});

		// Calculate average overdue days
		Object.keys(departmentStats).forEach((dept) => {
			if (departmentStats[dept].count > 0) {
				departmentStats[dept].averageOverdueDays =
					departmentStats[dept].totalOverdueDays /
					departmentStats[dept].count;
			}
			delete departmentStats[dept].totalOverdueDays;
		});

		// Sort users by number of overdue tasks
		const userStatsArray = Object.values(userStats).sort(
			(a, b) => b.count - a.count
		);

		res.status(200).json({
			status: "success",
			data: {
				totalOverdue: overdueTasks.length,
				departments: departmentStats,
				users: userStatsArray,
			},
		});
	} catch (err) {
		next(err);
	}
};

/**
 * Helper function to fill in missing time periods
 */
const fillMissingPeriods = (data, period, count, dateFormat) => {
	// Implementation depends on period type
	// For simplicity, we're returning the data as is
	return data;
};
