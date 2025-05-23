const express = require("express");
const Supplier = require("../models/Supplier");

const router = express.Router();

// 📌 1️⃣ Create a new supplier
router.post("/", async (req, res) => {
  try {
    const newSupplier = new Supplier(req.body);
    const savedSupplier = await newSupplier.save();
    res.status(201).json(savedSupplier);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 📌 2️⃣ Get all suppliers
router.get("/", async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.status(200).json(suppliers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 3️⃣ Get a single supplier by ID
router.get("/:id", async (req, res) => {
  try {
    const supplier = await Supplier.findOne({ supplierId: req.params.id });
    if (!supplier) return res.status(404).json({ error: "Supplier not found" });
    res.status(200).json(supplier);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 4️⃣ Update supplier details
router.put("/:id", async (req, res) => {
  try {
    const updatedSupplier = await Supplier.findOneAndUpdate(
      { supplierId: req.params.id },
      req.body,
      { new: true }
    );
    if (!updatedSupplier) return res.status(404).json({ error: "Supplier not found" });
    res.status(200).json(updatedSupplier);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 5️⃣ Delete a supplier
router.delete("/:id", async (req, res) => {
  try {
    const deletedSupplier = await Supplier.findOneAndDelete({ supplierId: req.params.id });
    if (!deletedSupplier) return res.status(404).json({ error: "Supplier not found" });
    res.status(200).json({ message: "Supplier deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
