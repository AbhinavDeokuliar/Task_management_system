/**
 * Initial system setup routes
 */
const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const AppError = require("../utils/appError");

// Initial setup - create first admin (can only be used when no users exist)
router.post("/initial-setup", async (req, res, next) => {
	try {
		// Check if any users already exist
		const userCount = await User.countDocuments();

		if (userCount > 0) {
			return next(
				new AppError(
					"System is already set up. Cannot create initial admin.",
					400
				)
			);
		}

		// Validate required fields
		const { name, email, password } = req.body;
		if (!name || !email || !password) {
			return next(
				new AppError("Please provide name, email and password", 400)
			);
		}

		// Create the admin user
		const adminUser = await User.create({
			name,
			email,
			password,
			role: "admin",
			department: req.body.department || "Administration",
			position: req.body.position || "System Administrator",
		});

		// Remove password from response
		adminUser.password = undefined;

		res.status(201).json({
			status: "success",
			message: "Initial admin user created successfully",
			data: {
				user: adminUser,
			},
		});
	} catch (err) {
		next(err);
	}
});

module.exports = router;
