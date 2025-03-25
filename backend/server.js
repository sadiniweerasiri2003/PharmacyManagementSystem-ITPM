require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");


const authRoutes = require("./routes/authRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const supplierOrderRoutes = require("./routes/supplierOrderRoutes");

const app = express();
app.use(express.json());
app.use(cors());



connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/supplierorders", supplierOrderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
