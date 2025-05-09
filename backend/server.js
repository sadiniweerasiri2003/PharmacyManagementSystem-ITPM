const express = require('express');
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const predictionRoutes = require('./routes/predictionRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());

// MongoDB connection
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function startServer() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    app.locals.client = client;

    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/predictions', predictionRoutes);

    // Start server
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  }
}

startServer().catch(console.error);

// Handle server shutdown
process.on('SIGINT', async () => {
  await client.close();
  process.exit(0);
});
