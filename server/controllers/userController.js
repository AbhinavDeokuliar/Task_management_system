/**
 * User Controller
 * Handles all user-related operations
 */
const User = require("../models/userModel");
const AppError = require("../utils/appError");

/**
 * Filter allowed fields from request body
 * @param {Object} obj - Request body
 * @param {Array} allowedFields - Fields that are allowed to be updated
 * @returns {Object} Filtered object
 */
const filterObj = (obj, ...allowedFields) => {
	const newObj = {};
	Object.keys(obj).forEach((el) => {
		if (allowedFields.includes(el)) newObj[el] = obj[el];
	});
	return newObj;
};

/**
 * Get all users (Admin only)
 */
exports.getAllUsers = async (req, res, next) => {
	try {
		const users = await User.find();

		// SEND RESPONSE
		res.status(200).json({
			status: "success",
			results: users.length,
			data: {
				users,
			},
		});
	} catch (err) {
		next(err);
	}
};

/**
 * Get user profile
 */
exports.getMe = (req, res, next) => {
	req.params.id = req.user.id;
	next();
};

/**
 * Get single user by ID
 */
exports.getUser = async (req, res, next) => {
	try {
		const user = await User.findById(req.params.id);

		if (!user) {
			return next(new AppError("No user found with that ID", 404));
		}

		res.status(200).json({
			status: "success",
			data: {
				user,
			},
		});
	} catch (err) {
		next(err);
	}
};

/**
 * Update current user profile
 */
exports.updateMe = async (req, res, next) => {
	try {
		// 1) Check if user is trying to update password
		if (req.body.password) {
			return next(
				new AppError(
					"This route is not for password updates. Please use /update-password.",
					400
				)
			);
		}

		// 2) Filter out unwanted fields that are not allowed to be updated
		const filteredBody = filterObj(
			req.body,
			"name",
			"email",
			"department",
			"position",
			"photo"
		);

		// 3) Update user document
		const updatedUser = await User.findByIdAndUpdate(
			req.user.id,
			filteredBody,
			{
				new: true,
				runValidators: true,
			}
		);

		res.status(200).json({
			status: "success",
			data: {
				user: updatedUser,
			},
		});
	} catch (err) {
		next(err);
	}
};

/**
 * Create new user (Admin only)
 */
exports.createUser = async (req, res, next) => {
	try {
		const newUser = await User.create({
			name: req.body.name,
			email: req.body.email,
			password: req.body.password,
			role: req.body.role,
			department: req.body.department,
			position: req.body.position,
		});

		// Remove password from response
		newUser.password = undefined;

		res.status(201).json({
			status: "success",
			data: {
				user: newUser,
			},
		});
	} catch (err) {
		next(err);
	}
};

/**
 * Update any user (Admin only)
 */
exports.updateUser = async (req, res, next) => {
	try {
		// Filter out password field
		const filteredBody = { ...req.body };
		delete filteredBody.password;

		const updatedUser = await User.findByIdAndUpdate(
			req.params.id,
			filteredBody,
			{
				new: true,
				runValidators: true,
			}
		);

		if (!updatedUser) {
			return next(new AppError("No user found with that ID", 404));
		}

		res.status(200).json({
			status: "success",
			data: {
				user: updatedUser,
			},
		});
	} catch (err) {
		next(err);
	}
};

/**
 * Delete user (Admin only)
 */
exports.deleteUser = async (req, res, next) => {
	try {
		const user = await User.findByIdAndDelete(req.params.id);

		if (!user) {
			return next(new AppError("No user found with that ID", 404));
		}

		res.status(204).json({
			status: "success",
			data: null,
		});
	} catch (err) {
		next(err);
	}
};

/**
 * Deactivate current user (self)
 */
exports.deleteMe = async (req, res, next) => {
	try {
		await User.findByIdAndUpdate(req.user.id, { active: false });

		res.status(204).json({
			status: "success",
			data: null,
		});
	} catch (err) {
		next(err);
	}
};
