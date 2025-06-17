/**
 * Script to create an admin user
 * Run this script with: node scripts/createAdmin.js
 */
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/userModel");
const connectDB = require("../config/db");

async function createAdminUser() {
	try {
		// Connect to the database
		await connectDB();

		const adminData = {
			name: "Admin User",
			email: "admin@example.com",
			password: "admin123", // You should use a stronger password
			role: "admin",
			department: "Administration",
			position: "System Administrator",
		};

		// Check if admin already exists
		const existingAdmin = await User.findOne({ email: adminData.email });

		if (existingAdmin) {
			console.log("Admin user already exists!");
		} else {
			// Create the admin user
			const admin = await User.create(adminData);
			console.log("Admin user created successfully:");
			console.log({
				name: admin.name,
				email: admin.email,
				role: admin.role,
			});
		}

		// Disconnect from database
		await mongoose.connection.close();
		console.log("Database connection closed");
	} catch (error) {
		console.error("Error creating admin user:", error);
	}
}

// Execute the function
createAdminUser();
