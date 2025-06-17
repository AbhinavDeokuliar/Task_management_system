/**
 * User Model Schema Definition
 */
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

/**
 * User Schema
 * Defines the structure for user documents in MongoDB
 * - Two roles: admin and team_member
 */
const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Please provide a name"],
			trim: true,
		},
		email: {
			type: String,
			required: [true, "Please provide an email"],
			unique: true,
			lowercase: true,
			validate: [validator.isEmail, "Please provide a valid email"],
		},
		password: {
			type: String,
			required: [true, "Please provide a password"],
			minlength: 8,
			select: false,
		},
		role: {
			type: String,
			enum: ["admin", "team_member"],
			default: "team_member",
		},
		department: {
			type: String,
			trim: true,
		},
		position: {
			type: String,
			trim: true,
		},
		photo: {
			type: String,
			default: "default.jpg",
		},
		passwordChangedAt: Date,
		passwordResetToken: String,
		passwordResetExpires: Date,
		active: {
			type: Boolean,
			default: true,
			select: false,
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

/**
 * Virtual property for assigned tasks
 * Allows us to populate tasks assigned to this user
 */
userSchema.virtual("assignedTasks", {
	ref: "Task",
	foreignField: "assignedTo",
	localField: "_id",
});

/**
 * Document Middleware: Hash password before save
 */
userSchema.pre("save", async function (next) {
	// Only run if password is modified
	if (!this.isModified("password")) return next();

	// Hash password with cost of 12
	this.password = await bcrypt.hash(this.password, 12);

	next();
});

/**
 * Document Middleware: Update passwordChangedAt when password is changed
 */
userSchema.pre("save", function (next) {
	if (!this.isModified("password") || this.isNew) return next();

	// Subtract 1 second to ensure token is created after password changed
	this.passwordChangedAt = Date.now() - 1000;
	next();
});

/**
 * Query Middleware: Only find active users
 */
userSchema.pre(/^find/, function (next) {
	this.find({ active: { $ne: false } });
	next();
});

/**
 * Instance Method: Check if entered password is correct
 * @param {string} candidatePassword - The password to check
 * @param {string} userPassword - The stored hashed password
 * @returns {Promise<boolean>} - True if passwords match
 */
userSchema.methods.correctPassword = async function (
	candidatePassword,
	userPassword
) {
	return await bcrypt.compare(candidatePassword, userPassword);
};

/**
 * Instance Method: Check if user changed password after JWT was issued
 * @param {number} JWTTimestamp - The timestamp when the token was issued
 * @returns {boolean} - True if password was changed after token
 */
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
	if (this.passwordChangedAt) {
		const changedTimestamp = parseInt(
			this.passwordChangedAt.getTime() / 1000,
			10
		);
		return JWTTimestamp < changedTimestamp;
	}
	return false;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
