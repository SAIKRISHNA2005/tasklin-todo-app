const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const healthRoutes = require('./routes/health');
const todoRoutes = require('./routes/todo.routes');

app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/todos', todoRoutes);

// Error handler (must be last)
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

module.exports = app;
