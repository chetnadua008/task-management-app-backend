const Task = require('../models/Task');

// @route  POST /api/tasks
const createTask = async (req, res) => {
    const { title, description, priority, status } = req.body;
    try {
        const task = await Task.create({
            user: req.user._id,   // from protect middleware
            title,
            description,
            priority,
            status,
        });
        res.status(201).json({ message: 'Task created', task });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// NEW - replace with this
const getTasks = async (req, res) => {
    const { status, priority } = req.query;  // read query params

    try {
        const filter = { user: req.user._id };  // always filter by logged-in user

        if (status) filter.status = status;    // add status filter if provided
        if (priority) filter.priority = priority;  // add priority filter if provided

        const tasks = await Task.find(filter).sort({ createdAt: -1 });
        res.json({ count: tasks.length, tasks });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route  GET /api/tasks/:id
const getTaskById = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json({ task });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route  PUT /api/tasks/:id
const updateTask = async (req, res) => {
    const { title, description, priority, status } = req.body;
    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
        if (!task) return res.status(404).json({ message: 'Task not found' });

        task.title = title ?? task.title;
        task.description = description ?? task.description;
        task.priority = priority ?? task.priority;
        task.status = status ?? task.status;

        await task.save();
        res.json({ message: 'Task updated', task });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route  DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route  PATCH /api/tasks/:id/status
const updateTaskStatus = async (req, res) => {
    const { status } = req.body;
    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
        if (!task) return res.status(404).json({ message: 'Task not found' });

        task.status = status;
        await task.save();
        res.json({ message: `Task marked as ${status}`, task });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createTask, getTasks, getTaskById, updateTask, deleteTask, updateTaskStatus };