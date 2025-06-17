const express = require("express");
const router = express.Router();

// Get all tasks
router.get("/", (req, res) => {
	res.json({ message: "Get all tasks" });
});

// Get a single task
router.get("/:id", (req, res) => {
	res.json({ message: `Get task with id ${req.params.id}` });
});

// Create a new task
router.post("/", (req, res) => {
	res.json({ message: "Create new task", data: req.body });
});

// Update a task
router.put("/:id", (req, res) => {
	res.json({
		message: `Update task with id ${req.params.id}`,
		data: req.body,
	});
});

// Delete a task
router.delete("/:id", (req, res) => {
	res.json({ message: `Delete task with id ${req.params.id}` });
});

module.exports = router;
