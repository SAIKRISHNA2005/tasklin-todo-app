const Todo = require('../models/todo.model');
const mongoose = require('mongoose');

// GET all todos with filtering, searching, sorting, and pagination
exports.getTodos = async (req, res, next) => {
  try {
    const { status, priority, tag, search, sort, page = 1, limit = 10 } = req.query;

    // Build filter object
    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (priority) {
      filter.priority = priority;
    }

    if (tag) {
      filter.tags = tag;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Build sort object
    const sortObj = {};
    if (sort) {
      const sortParams = sort.split(',');
      sortParams.forEach((param) => {
        if (param.startsWith('-')) {
          sortObj[param.substring(1)] = -1;
        } else {
          sortObj[param] = 1;
        }
      });
    } else {
      sortObj.createdAt = -1; // Default sort by newest first
    }

    // Calculate pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit))); // Max 100 per page
    const skip = (pageNum - 1) * limitNum;

    // Query todos
    const todos = await Todo.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const total = await Todo.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        todos,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          pages: Math.ceil(total / limitNum),
        },
      },
      message: `Found ${todos.length} todos`,
    });
  } catch (error) {
    next(error);
  }
};

// GET single todo by ID
exports.getTodoById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid todo ID format',
      });
    }

    const todo = await Todo.findById(id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        error: 'Todo not found',
      });
    }

    res.status(200).json({
      success: true,
      data: todo,
      message: 'Todo retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};

// POST create todo
exports.createTodo = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate, tags } = req.body;

    const todo = new Todo({
      title,
      description,
      status,
      priority,
      dueDate,
      tags,
    });

    await todo.save();

    res.status(201).json({
      success: true,
      data: todo,
      message: 'Todo created successfully',
    });
  } catch (error) {
    next(error);
  }
};

// PUT full update todo
exports.updateTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, dueDate, tags } = req.body;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid todo ID format',
      });
    }

    const todo = await Todo.findByIdAndUpdate(
      id,
      {
        title,
        description,
        status,
        priority,
        dueDate,
        tags,
      },
      { new: true, runValidators: true }
    );

    if (!todo) {
      return res.status(404).json({
        success: false,
        error: 'Todo not found',
      });
    }

    res.status(200).json({
      success: true,
      data: todo,
      message: 'Todo updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// PATCH partial update todo
exports.partialUpdateTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid todo ID format',
      });
    }

    const todo = await Todo.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!todo) {
      return res.status(404).json({
        success: false,
        error: 'Todo not found',
      });
    }

    res.status(200).json({
      success: true,
      data: todo,
      message: 'Todo partially updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// DELETE todo
exports.deleteTodo = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid todo ID format',
      });
    }

    const todo = await Todo.findByIdAndDelete(id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        error: 'Todo not found',
      });
    }

    res.status(200).json({
      success: true,
      data: todo,
      message: 'Todo deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
