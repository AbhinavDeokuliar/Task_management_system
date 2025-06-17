/**
 * Task Model Schema Definition
 */
const mongoose = require("mongoose");

/**
 * Task Schema
 * Defines the structure for task documents in MongoDB
 */
const taskSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, "A task must have a title"],
			trim: true,
		},
		description: {
			type: String,
			trim: true,
		},
		status: {
			type: String,
			enum: ["pending", "in_progress", "completed", "archived"],
			default: "pending",
		},
		priority: {
			type: String,
			enum: ["low", "medium", "high"],
			default: "medium",
		},
		createdBy: {
			type: mongoose.Schema.ObjectId,
			ref: "User",
			required: [true, "A task must have a creator"],
		},
		assignedTo: {
			type: mongoose.Schema.ObjectId,
			ref: "User",
		},
		deadline: {
			type: Date,
			required: [true, "A task must have a deadline"],
		},
		createdAt: {
			type: Date,
			default: Date.now(),
		},
		completedAt: {
			type: Date,
		},
		attachments: [
			{
				name: String,
				path: String,
				uploadedAt: {
					type: Date,
					default: Date.now,
				},
			},
		],
		comments: [
			{
				text: {
					type: String,
					required: [true, "Comment text is required"],
				},
				createdBy: {
					type: mongoose.Schema.ObjectId,
					ref: "User",
					required: [true, "Comment must have an author"],
				},
				createdAt: {
					type: Date,
					default: Date.now,
				},
			},
		],
		tags: [String],
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

/**
 * Indexes for faster queries
 */
taskSchema.index({ status: 1 });
taskSchema.index({ assignedTo: 1 });
taskSchema.index({ deadline: 1 });

/**
 * Query Middleware: Populate creator and assignee
 */
taskSchema.pre(/^find/, function (next) {
	this.populate({
		path: "createdBy",
		select: "name email",
	}).populate({
		path: "assignedTo",
		select: "name email",
	});

	next();
});

/**
 * Calculate days remaining before deadline
 */
taskSchema.virtual("daysRemaining").get(function () {
	if (!this.deadline) return null;

	const today = new Date();
	const diffTime = this.deadline - today;
	return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

/**
 * Virtual field to determine if task is overdue
 */
taskSchema.virtual("isOverdue").get(function () {
	if (!this.deadline) return false;
	if (this.status === "completed") return false;

	return this.deadline < new Date();
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
