import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create an axios instance with default config
const api = axios.create({
	baseURL: API_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

// Add request interceptor to include auth token in all requests
api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		// Handle token expiration
		if (error.response?.status === 401) {
			localStorage.removeItem("token");
			localStorage.removeItem("user");
			window.location.href = "/login";
		}
		return Promise.reject(error);
	}
);

// Auth services
export const authService = {
	login: async (email, password) => {
		const response = await api.post("/users/login", { email, password });
		return response.data;
	},

	updatePassword: async (currentPassword, password) => {
		const response = await api.patch("/users/update-password", {
			currentPassword,
			password,
		});
		return response.data;
	},
};

// User services
export const userService = {
	// For admin
	getAllUsers: async () => {
		const response = await api.get("/users");
		return response.data;
	},

	getUser: async (id) => {
		const response = await api.get(`/users/${id}`);
		return response.data;
	},

	createUser: async (userData) => {
		const response = await api.post("/users", userData);
		return response.data;
	},

	updateUser: async (id, userData) => {
		const response = await api.patch(`/users/${id}`, userData);
		return response.data;
	},

	deleteUser: async (id) => {
		const response = await api.delete(`/users/${id}`);
		return response.data;
	},

	// For all authenticated users
	getProfile: async () => {
		const response = await api.get("/users/me");
		return response.data;
	},

	updateProfile: async (userData) => {
		const response = await api.patch("/users/update-me", userData);
		return response.data;
	},

	deactivateAccount: async () => {
		const response = await api.delete("/users/delete-me");
		return response.data;
	},
};

// Task services
export const taskService = {
	getAllTasks: async (filters = {}) => {
		const queryParams = new URLSearchParams(filters).toString();
		const response = await api.get(
			`/tasks${queryParams ? `?${queryParams}` : ""}`
		);
		return response.data;
	},

	getTask: async (id) => {
		const response = await api.get(`/tasks/${id}`);
		return response.data;
	},

	createTask: async (taskData) => {
		const response = await api.post("/tasks", taskData);
		return response.data;
	},

	updateTask: async (id, taskData) => {
		const response = await api.patch(`/tasks/${id}`, taskData);
		return response.data;
	},

	deleteTask: async (id) => {
		const response = await api.delete(`/tasks/${id}`);
		return response.data;
	},

	addComment: async (id, text) => {
		const response = await api.post(`/tasks/${id}/comments`, { text });
		return response.data;
	},

	getCalendarTasks: async (startDate, endDate) => {
		const response = await api.get(
			`/tasks/calendar?startDate=${startDate}&endDate=${endDate}`
		);
		return response.data;
	},

	getTaskStats: async () => {
		const response = await api.get("/tasks/stats");
		return response.data;
	},
};

export default api;
