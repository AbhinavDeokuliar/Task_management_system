/**
 * Analytics Routes
 */
const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analyticsController");
const authMiddleware = require("../middleware/authMiddleware");

// All routes require authentication
router.use(authMiddleware.protect);

// Admin-only routes
router.use(authMiddleware.restrictTo("admin"));

// Analytics endpoints
router.get("/completion-stats", analyticsController.getCompletionStats);
router.get(
	"/workload-distribution",
	analyticsController.getWorkloadDistribution
);
router.get(
	"/department-performance",
	analyticsController.getDepartmentPerformance
);
router.get("/task-trends", analyticsController.getTaskTrends);
router.get("/user-performance", analyticsController.getUserPerformance);
router.get(
	"/priority-distribution",
	analyticsController.getPriorityDistribution
);
router.get("/overdue-analysis", analyticsController.getOverdueTasksAnalysis);

module.exports = router;
