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
app.use('/api/v1/health', healthRoutes);

module.exports = app;
