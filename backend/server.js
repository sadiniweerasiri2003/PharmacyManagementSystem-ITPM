const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require("./config/db");
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const supplierRoutes = require("./routes/supplierRoutes");
const supplierOrderRoutes = require("./routes/supplierOrderRoutes");
dotenv.config(); // Load environment variables
const medicineRoutes = require("./routes/medicineRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Parse JSON bodies



connectDB();


// MongoDB connection
const uri = process.env.MONGO_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.log('Error connecting to MongoDB:', err);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/supplierorders", supplierOrderRoutes);
app.use("/api/medicines", medicineRoutes);

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});





const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
