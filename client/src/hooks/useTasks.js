import { useState, useEffect, useCallback } from "react";
import { taskService } from "../services/api";

/**
 * Custom hook to fetch and manage tasks
 * @param {Object} filters - Optional filters for tasks
 * @returns {Object} Tasks data and management functions
 */
const useTasks = (filters = {}) => {
	const [tasks, setTasks] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [refreshTrigger, setRefreshTrigger] = useState(0);

	const fetchTasks = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);

			// In a production app, this would be a real API call
			// For now, we'll simulate a delay and use mock data
			await new Promise((resolve) => setTimeout(resolve, 800));

			// Define mock tasks based on filters
			const mockTasks = [
				{
					id: "1",
					title: "Complete frontend for user profile",
					description:
						"Implement the UI components for user profile page based on the approved designs",
					status: "in_progress",
					priority: "high",
					deadline: "2025-07-05T00:00:00.000Z",
					createdAt: "2025-06-20T00:00:00.000Z",
					createdBy: {
						id: "admin1",
						name: "Admin User",
					},
					assignedTo: {
						id: "user1",
						name: "John Doe",
					},
					tags: ["frontend", "ui"],
				},
				{
					id: "2",
					title: "Fix navigation menu issues",
					description:
						"Resolve the navbar collapsing issue on mobile view",
					status: "pending",
					priority: "medium",
					deadline: "2025-07-08T00:00:00.000Z",
					createdAt: "2025-06-22T00:00:00.000Z",
					createdBy: {
						id: "admin1",
						name: "Admin User",
					},
					assignedTo: {
						id: "user1",
						name: "John Doe",
					},
					tags: ["frontend", "bug"],
				},
				{
					id: "3",
					title: "Review API documentation",
					description:
						"Review and suggest improvements for the API documentation",
					status: "completed",
					priority: "low",
					deadline: "2025-06-28T00:00:00.000Z",
					createdAt: "2025-06-15T00:00:00.000Z",
					completedAt: "2025-06-27T00:00:00.000Z",
					createdBy: {
						id: "admin1",
						name: "Admin User",
					},
					assignedTo: {
						id: "user2",
						name: "Jane Smith",
					},
					tags: ["documentation", "api"],
				},
				{
					id: "4",
					title: "Implement data validation",
					description: "Add form validation for all user input fields",
					status: "pending",
					priority: "high",
					deadline: "2025-06-30T00:00:00.000Z",
					createdAt: "2025-06-25T00:00:00.000Z",
					createdBy: {
						id: "admin1",
						name: "Admin User",
					},
					assignedTo: {
						id: "user2",
						name: "Jane Smith",
					},
					tags: ["frontend", "validation"],
				},
			];

			// Apply filters if provided
			let filteredTasks = [...mockTasks];

			if (filters.status) {
				filteredTasks = filteredTasks.filter(
					(task) => task.status === filters.status
				);
			}

			if (filters.priority) {
				filteredTasks = filteredTasks.filter(
					(task) => task.priority === filters.priority
				);
			}

			if (filters.assignedTo) {
				filteredTasks = filteredTasks.filter(
					(task) => task.assignedTo.id === filters.assignedTo
				);
			}

			setTasks(filteredTasks);

			// In a real app, we would use the API service:
			// const response = await taskService.getAllTasks(filters);
			// setTasks(response.data.tasks);
		} catch (err) {
			console.error("Error fetching tasks:", err);
			setError("Failed to fetch tasks. Please try again.");
		} finally {
			setLoading(false);
		}
	}, [filters, refreshTrigger]);

	useEffect(() => {
		fetchTasks();
	}, [fetchTasks]);

	const refreshTasks = () => {
		setRefreshTrigger((prev) => prev + 1);
	};

	const updateTaskStatus = async (taskId, newStatus) => {
		try {
			// In a real app:
			// await taskService.updateTask(taskId, { status: newStatus });

			// For now, update the local state
			setTasks((prevTasks) =>
				prevTasks.map((task) =>
					task.id === taskId ? { ...task, status: newStatus } : task
				)
			);

			return true;
		} catch (err) {
			console.error("Error updating task status:", err);
			return false;
		}
	};

	return {
		tasks,
		loading,
		error,
		refreshTasks,
		updateTaskStatus,
	};
};

export default useTasks;
