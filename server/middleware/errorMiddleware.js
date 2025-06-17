/**
 * Global error handling middleware
 */
const AppError = require("../utils/appError");

/**
 * Handle Mongoose CastError (invalid ID)
 * @param {Error} err - Error object
 * @returns {AppError} Formatted error
 */
const handleCastErrorDB = (err) => {
	const message = `Invalid ${err.path}: ${err.value}.`;
	return new AppError(message, 400);
};

/**
 * Handle Mongoose duplicate key error
 * @param {Error} err - Error object
 * @returns {AppError} Formatted error
 */
const handleDuplicateFieldsDB = (err) => {
	const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
	const message = `Duplicate field value: ${value}. Please use another value!`;
	return new AppError(message, 400);
};

/**
 * Handle Mongoose validation errors
 * @param {Error} err - Error object
 * @returns {AppError} Formatted error
 */
const handleValidationErrorDB = (err) => {
	const errors = Object.values(err.errors).map((el) => el.message);
	const message = `Invalid input data. ${errors.join(". ")}`;
	return new AppError(message, 400);
};

/**
 * Handle JWT errors
 */
const handleJWTError = () =>
	new AppError("Invalid token. Please log in again!", 401);

const handleJWTExpiredError = () =>
	new AppError("Your token has expired! Please log in again.", 401);

/**
 * Send detailed error in development
 * @param {Error} err - Error object
 * @param {Object} res - Express response object
 */
const sendErrorDev = (err, res) => {
	res.status(err.statusCode).json({
		status: err.status,
		error: err,
		message: err.message,
		stack: err.stack,
	});
};

/**
 * Send limited error details in production
 * @param {Error} err - Error object
 * @param {Object} res - Express response object
 */
const sendErrorProd = (err, res) => {
	// Operational, trusted error: send message to client
	if (err.isOperational) {
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message,
		});

		// Programming or other unknown error: don't leak error details
	} else {
		// Log error
		console.error("ERROR 💥", err);

		// Send generic message
		res.status(500).json({
			status: "error",
			message: "Something went very wrong!",
		});
	}
};

/**
 * Global error handling middleware
 */
module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || "error";

	if (process.env.NODE_ENV === "development") {
		sendErrorDev(err, res);
	} else if (process.env.NODE_ENV === "production") {
		let error = { ...err };
		error.message = err.message;

		if (error.name === "CastError") error = handleCastErrorDB(error);
		if (error.code === 11000) error = handleDuplicateFieldsDB(error);
		if (error.name === "ValidationError")
			error = handleValidationErrorDB(error);
		if (error.name === "JsonWebTokenError") error = handleJWTError();
		if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

		sendErrorProd(error, res);
	}
};
