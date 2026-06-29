const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todo.controller');
const validateTodo = require('../middlewares/validateTodo');

// GET all todos
router.get('/', todoController.getTodos);

// GET single todo by ID
router.get('/:id', todoController.getTodoById);

// POST create todo
router.post('/', validateTodo, todoController.createTodo);

// PUT full update todo
router.put('/:id', validateTodo, todoController.updateTodo);

// PATCH partial update todo
router.patch('/:id', todoController.partialUpdateTodo);

// DELETE todo
router.delete('/:id', todoController.deleteTodo);

module.exports = router;
