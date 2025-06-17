/**
 * User Routes
 */
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

// Public routes
router.post("/login", authMiddleware.login);

// Protected routes - require authentication
router.use(authMiddleware.protect);

// Routes for all authenticated users
router.get("/me", userController.getMe, userController.getUser);
router.patch("/update-me", userController.updateMe);
router.patch("/update-password", authMiddleware.updatePassword);
router.delete("/delete-me", userController.deleteMe);

// Admin-only routes
router.use(authMiddleware.restrictTo("admin"));

router
	.route("/")
	.get(userController.getAllUsers)
	.post(userController.createUser);

router
	.route("/:id")
	.get(userController.getUser)
	.patch(userController.updateUser)
	.delete(userController.deleteUser);

module.exports = router;
