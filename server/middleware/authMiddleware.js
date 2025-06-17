/**
 * Authentication and authorization middleware
 */
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const User = require("../models/userModel");

/**
 * Generate a JWT token for a user
 * @param {string} id - User ID to encode in token
 * @returns {string} JWT token
 */
const signToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

/**
 * Create and send JWT token in response
 * @param {Object} user - User object
 * @param {number} statusCode - HTTP status code
 * @param {Object} res - Express response object
 */
const createSendToken = (user, statusCode, res) => {
	const token = signToken(user._id);

	// Remove password from output
	user.password = undefined;

	res.status(statusCode).json({
		status: "success",
		token,
		data: {
			user,
		},
	});
};

/**
 * Middleware to protect routes - Requires authenticated user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.protect = async (req, res, next) => {
	try {
		// 1) Check if token exists
		let token;
		if (
			req.headers.authorization &&
			req.headers.authorization.startsWith("Bearer")
		) {
			token = req.headers.authorization.split(" ")[1];
		}

		if (!token) {
			return next(
				new AppError(
					"You are not logged in! Please log in to get access.",
					401
				)
			);
		}

		// 2) Verify token
		const decoded = await promisify(jwt.verify)(
			token,
			process.env.JWT_SECRET
		);

		// 3) Check if user still exists
		const currentUser = await User.findById(decoded.id);
		if (!currentUser) {
			return next(
				new AppError(
					"The user belonging to this token no longer exists.",
					401
				)
			);
		}

		// 4) Check if user changed password after the token was issued
		if (currentUser.changedPasswordAfter(decoded.iat)) {
			return next(
				new AppError(
					"User recently changed password! Please log in again.",
					401
				)
			);
		}

		// Grant access to protected route
		req.user = currentUser;
		next();
	} catch (err) {
		next(new AppError("Authentication failed. Please log in again.", 401));
	}
};

/**
 * Middleware to restrict access to certain roles
 * @param  {...string} roles - Allowed roles
 * @returns {Function} Express middleware
 */
exports.restrictTo = (...roles) => {
	return (req, res, next) => {
		// Check if user's role is in the allowed roles
		if (!roles.includes(req.user.role)) {
			return next(
				new AppError(
					"You do not have permission to perform this action",
					403
				)
			);
		}

		next();
	};
};

// Authentication controller functions
exports.signup = async (req, res, next) => {
	try {
		// Only admins can create admin users
		if (
			req.body.role === "admin" &&
			(!req.user || req.user.role !== "admin")
		) {
			return next(
				new AppError(
					"You do not have permission to create admin users",
					403
				)
			);
		}

		const newUser = await User.create({
			name: req.body.name,
			email: req.body.email,
			password: req.body.password,
			role: req.body.role,
			department: req.body.department,
			position: req.body.position,
		});

		createSendToken(newUser, 201, res);
	} catch (err) {
		next(err);
	}
};

exports.login = async (req, res, next) => {
	try {
		const { email, password } = req.body;

		// Check if email and password exist
		if (!email || !password) {
			return next(new AppError("Please provide email and password!", 400));
		}

		// Check if user exists && password is correct
		const user = await User.findOne({ email }).select("+password");

		if (!user || !(await user.correctPassword(password, user.password))) {
			return next(new AppError("Incorrect email or password", 401));
		}

		// If everything ok, send token to client
		createSendToken(user, 200, res);
	} catch (err) {
		next(err);
	}
};

exports.updatePassword = async (req, res, next) => {
	try {
		// 1) Get user from collection
		const user = await User.findById(req.user.id).select("+password");

		// 2) Check if POSTed current password is correct
		if (
			!(await user.correctPassword(req.body.currentPassword, user.password))
		) {
			return next(new AppError("Your current password is wrong.", 401));
		}

		// 3) If so, update password
		user.password = req.body.password;
		await user.save();

		// 4) Log user in, send JWT
		createSendToken(user, 200, res);
	} catch (err) {
		next(err);
	}
};
