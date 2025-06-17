/**
 * Main application file
 * Task Management System API Server
 */
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const errorMiddleware = require("./middleware/errorMiddleware");
const scheduleJobs = require("./utils/scheduler");

// Import routes
const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes");
// Remove setupRoutes - we'll use the script instead

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get("/", (req, res) => {
	res.json({
		message: "Welcome to Task Management System API",
		documentation: "/api/docs",
		status: "Server is running",
	});
});

// Mount routes
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);
// Remove setupRoutes - we'll use the script instead

// Error handling middleware (must be after all routes)
app.use(errorMiddleware);

// Handle undefined routes
app.all("*", (req, res, next) => {
	res.status(404).json({
		status: "fail",
		message: `Can't find ${req.originalUrl} on this server!`,
	});
});

// Start the server
const server = app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

// Start scheduled jobs (like deadline reminders)
scheduleJobs();

// Handle unhandled rejections
process.on("unhandledRejection", (err) => {
	console.error("UNHANDLED REJECTION! 💥 Shutting down...");
	console.error(err.name, err.message, err.stack);

	server.close(() => {
		process.exit(1);
	});
});
