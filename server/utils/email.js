/**
 * Email utility for sending notifications
 */
const nodemailer = require("nodemailer");

/**
 * Email class for handling all email operations
 */
class Email {
	constructor(user, url) {
		this.to = user.email;
		this.firstName = user.name.split(" ")[0];
		this.url = url;
		this.from = process.env.EMAIL_FROM;
	}

	/**
	 * Create a transporter based on environment
	 * @returns {nodemailer.Transporter} - Configured nodemailer transporter
	 */
	newTransport() {
		return nodemailer.createTransport({
			service: process.env.EMAIL_SERVICE,
			auth: {
				user: process.env.EMAIL_USERNAME,
				pass: process.env.EMAIL_PASSWORD,
			},
		});
	}

	/**
	 * Send an email using the configured transporter
	 * @param {string} subject - Email subject
	 * @param {string} text - Email content as plain text
	 * @param {string} html - Email content as HTML (optional)
	 * @returns {Promise} - Result of sending email
	 */
	async send(subject, text, html = "") {
		// Define email options
		const mailOptions = {
			from: this.from,
			to: this.to,
			subject,
			text,
			html: html || text,
		};

		// Create a transport and send email
		await this.newTransport().sendMail(mailOptions);
	}

	/**
	 * Send task assignment notification
	 * @param {Object} task - The task object that was assigned
	 * @returns {Promise} - Result of sending email
	 */
	async sendTaskAssignment(task) {
		const subject = `New Task Assigned: ${task.title}`;
		const text = `
      Hello ${this.firstName},
      
      You have been assigned a new task:
      
      Title: ${task.title}
      Description: ${task.description || "No description provided"}
      Priority: ${task.priority}
      Deadline: ${new Date(task.deadline).toLocaleDateString()}
      
      Please log in to the Task Management System to see more details.
      
      Best regards,
      Task Management System Team
    `;

		await this.send(subject, text);
	}

	/**
	 * Send task deadline reminder
	 * @param {Object} task - The task object with approaching deadline
	 * @param {number} daysLeft - Days left until the deadline
	 * @returns {Promise} - Result of sending email
	 */
	async sendDeadlineReminder(task, daysLeft) {
		const subject = `Reminder: Task Deadline Approaching - ${task.title}`;
		const text = `
      Hello ${this.firstName},
      
      This is a reminder that the deadline for task "${
			task.title
		}" is approaching.
      
      Days left: ${daysLeft}
      Deadline: ${new Date(task.deadline).toLocaleDateString()}
      Current Status: ${task.status}
      
      Please log in to the Task Management System to update the status or request an extension if needed.
      
      Best regards,
      Task Management System Team
    `;

		await this.send(subject, text);
	}
}

module.exports = Email;
