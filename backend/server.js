require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const salesRoutes = require("./routes/salesRoutes");  // Import the sales routes
const medicineRoutes = require("./routes/medicineRoutes");
const medicineNameFetchRoutes = require("./routes/medicineNameFetch"); // Import the medicine name fetch routes

const app = express();
app.use(express.json());

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Parse JSON bodies

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
app.use("/api/sales", salesRoutes);  // Link the sales routes here
app.use("/api/medicines", medicineRoutes);
app.use("/api/medicineNames", medicineNameFetchRoutes); // Link the medicine name fetch routes

// Start the server
const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
