const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("MongoDB Connection Error:", err));

// Import Routes
const authRoutes = require("./routes/authRoutes");
const salesRoutes = require("./routes/salesRoutes");

// Use Routes
app.use("/api/auth", authRoutes); // Handles login, register (admins, suppliers, cashiers)
app.use("/api/sales", salesRoutes); // Handles sales-related requests

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
