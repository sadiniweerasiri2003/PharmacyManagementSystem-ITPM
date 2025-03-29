const express = require("express");
const Supplier = require("../models/supplier");

const router = express.Router();

// Function to generate the next Supplier ID (e.g., "SUP001")
const generateSupplierId = async () => {
  const lastSupplier = await Supplier.findOne().sort({ supplierId: -1 }).lean();
  let nextSupplierId = "SUP001"; // Default for the first supplier

  if (lastSupplier && /^SUP\d{3}$/.test(lastSupplier.supplierId)) {
    const lastIdNumber = parseInt(lastSupplier.supplierId.slice(3), 10); // Extract numeric part
    nextSupplierId = `SUP${String(lastIdNumber + 1).padStart(3, "0")}`; // Increment and format
  }

  return nextSupplierId;
};

// Create a new Supplier
router.post("/", async (req, res) => {
  try {
    const { name, phoneNumber, email, address, leadTimeDays } = req.body;
    const supplierId = await generateSupplierId();

    const newSupplier = new Supplier({
      supplierId,
      name,
      phoneNumber,
      email,
      address,
      leadTimeDays,
    });

    const savedSupplier = await newSupplier.save();
    res.status(201).json(savedSupplier);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all Suppliers with optional search query
router.get("/", async (req, res) => {
  try {
    const { search } = req.query; 
    let filter = {}; 

    if (search) {
      filter = {
        $or: [
          { supplierId: { $regex: search, $options: "i" } },
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ]
      };
    }

    const suppliers = await Supplier.find(filter);
    res.status(200).json(suppliers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single Supplier by ID
router.get("/:id", async (req, res) => {
  try {
    const supplier = await Supplier.findOne({ supplierId: req.params.id });
    if (!supplier) {
      return res.status(404).json({ error: "Supplier not found" });
    }
    res.status(200).json(supplier);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a Supplier
router.put("/:id", async (req, res) => {
  try {
    const { name, phoneNumber, email, address, leadTimeDays } = req.body;

    const updatedSupplier = await Supplier.findOneAndUpdate(
      { supplierId: req.params.id },
      { name, phoneNumber, email, address, leadTimeDays },
      { new: true }
    );

    if (!updatedSupplier) {
      return res.status(404).json({ error: "Supplier not found" });
    }

    res.status(200).json(updatedSupplier);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a Supplier
router.delete("/:id", async (req, res) => {
  try {
    const deletedSupplier = await Supplier.findOneAndDelete({ supplierId: req.params.id });

    if (!deletedSupplier) {
      return res.status(404).json({ error: "Supplier not found" });
    }

    res.status(200).json({ message: "Supplier deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
