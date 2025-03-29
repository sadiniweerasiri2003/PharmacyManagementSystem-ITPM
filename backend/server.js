const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require("./config/db");
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const supplierRoutes = require("./routes/supplierRoutes");
const supplierOrderRoutes = require("./routes/supplierOrderRoutes");
const medicineRoutes = require("./routes/medicineRoutes");

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
app.use("/api/medicines", medicineRoutes);

// Start server on a single port
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
