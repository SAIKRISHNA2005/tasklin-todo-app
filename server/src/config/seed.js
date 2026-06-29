const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const Todo = require('../models/todo.model');

const seedData = [
  {
    title: 'Complete project proposal',
    description: 'Write and submit the Q3 project proposal to the team lead',
    status: 'pending',
    priority: 'high',
    dueDate: new Date('2026-07-15'),
    tags: ['work', 'proposal', 'urgent'],
  },
  {
    title: 'Review code changes',
    description: 'Review pull requests from team members',
    status: 'completed',
    priority: 'high',
    dueDate: new Date('2026-06-20'),
    tags: ['code-review', 'development'],
  },
  {
    title: 'Update documentation',
    description: 'Update API documentation with new endpoints',
    status: 'pending',
    priority: 'medium',
    dueDate: new Date('2026-07-30'),
    tags: ['documentation', 'api'],
  },
  {
    title: 'Fix bug in authentication module',
    description: 'Address the login timeout issue reported in issue #243',
    status: 'pending',
    priority: 'high',
    dueDate: new Date('2026-06-25'),
    tags: ['bug', 'authentication', 'critical'],
  },
  {
    title: 'Organize team meeting',
    description: 'Schedule and prepare agenda for monthly sync',
    status: 'completed',
    priority: 'low',
    dueDate: new Date('2026-06-15'),
    tags: ['meeting', 'admin'],
  },
  {
    title: 'Refactor database queries',
    description: 'Optimize slow queries in the user module',
    status: 'pending',
    priority: 'medium',
    dueDate: new Date('2026-08-10'),
    tags: ['optimization', 'database'],
  },
  {
    title: 'Deploy to staging environment',
    description: 'Push latest changes to staging and run QA tests',
    status: 'pending',
    priority: 'high',
    dueDate: new Date('2026-07-05'),
    tags: ['deployment', 'staging', 'qa'],
  },
];

const seed = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    await mongoose.connect(mongoURI);
    console.log('✓ MongoDB connected for seeding');

    // Clear existing todos
    await Todo.deleteMany({});
    console.log('✓ Cleared existing todos');

    // Insert seed data
    const insertedTodos = await Todo.insertMany(seedData);
    console.log(`✓ Seeded ${insertedTodos.length} todos successfully`);

    // Display inserted todos
    console.log('\nInserted todos:');
    insertedTodos.forEach((todo, index) => {
      console.log(`${index + 1}. ${todo.title} [${todo.status}] [${todo.priority}]`);
    });

    await mongoose.connection.close();
    console.log('\n✓ Seeding complete and database connection closed');
  } catch (error) {
    console.error('✗ Seeding error:', error.message);
    process.exit(1);
  }
};

seed();
