const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const mongoose = require('mongoose');
const Todo = require('../models/todo.model');

const verifySeededData = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    await mongoose.connect(mongoURI);
    console.log('✓ Connected to MongoDB\n');

    // Query all todos
    const todos = await Todo.find({});
    
    if (todos.length === 0) {
      console.log('✗ No todos found in the database');
    } else {
      console.log(`✓ Found ${todos.length} todos in the database:\n`);
      todos.forEach((todo, index) => {
        console.log(`${index + 1}. ${todo.title}`);
        console.log(`   Status: ${todo.status}`);
        console.log(`   Priority: ${todo.priority}`);
        console.log(`   Due Date: ${todo.dueDate ? new Date(todo.dueDate).toDateString() : 'N/A'}`);
        console.log(`   Tags: ${todo.tags.join(', ')}`);
        console.log(`   Created: ${new Date(todo.createdAt).toLocaleString()}`);
        console.log('');
      });
    }

    await mongoose.connection.close();
    console.log('✓ Connection closed');
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
};

verifySeededData();
