const express = require('express');
const mongoose = require('mongoose');
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

// Initialize express and load environment variables
dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/supplierorders", supplierOrderRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/medicineNames", medicineNameFetchRoutes);

// Start the server
const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
