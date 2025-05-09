const express = require('express');
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require("./config/db");
const bodyParser = require('body-parser');

// Import routes
const authRoutes = require('./routes/authRoutes');
const supplierRoutes = require("./routes/supplierRoutes.js");
const supplierOrderRoutes = require("./routes/supplierOrderRoutes");
const salesRoutes = require("./routes/salesRoutes");
const medicineRoutes = require("./routes/medicineRoutes");
const medicineNameFetchRoutes = require("./routes/medicineNameFetch");
const predictionRoutes = require('./routes/predictionRoutes');

// Initialize express and load environment variables
dotenv.config();
const app = express();

// Enhanced CORS configuration
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Store MongoDB client for predictions
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function initializeMongoClient() {
  try {
    await client.connect();
    console.log('MongoDB Client Connected');
    app.locals.client = client;
  } catch (err) {
    console.error('Failed to connect MongoDB client:', err);
  }
}

initializeMongoClient();

// Routes
app.use('/api/auth', authRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/supplierorders", supplierOrderRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/medicineNames", medicineNameFetchRoutes);
app.use('/api/predictions', predictionRoutes);

// Start the server
const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Handle server shutdown
process.on('SIGINT', async () => {
  await client.close();
  process.exit(0);
});
