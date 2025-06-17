/**
 * Task Routes
 */
const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const authMiddleware = require("../middleware/authMiddleware");

// All routes require authentication
router.use(authMiddleware.protect);

// Routes accessible by both admin and team members
router.get("/calendar", taskController.getTasksForCalendar);

router.route("/").get(taskController.getAllTasks);

router
	.route("/:id")
	.get(taskController.getTask)
	.post("/comments", taskController.addComment);

// Admin-only routes
router.use(authMiddleware.restrictTo("admin"));

router.get("/stats", taskController.getTaskStats);

router.route("/").post(taskController.createTask);

router
	.route("/:id")
	.patch(taskController.updateTask)
	.delete(taskController.deleteTask);

module.exports = router;
