const express = require("express");
const SupplierOrder = require("../models/supplierOrder");

const router = express.Router();

// Create a new Supplier Order
router.post("/", async (req, res) => {
  try {
    const { supplierId, orderDate, expectedDeliveryDate, medicines, orderStatus } = req.body;

    if (!medicines || !Array.isArray(medicines) || medicines.length === 0) {
      return res.status(400).json({ error: "At least one medicine must be included in the order." });
    }

    // Validate medicine structure
    if (!medicines.every(med => med.medicineId && med.orderedQuantity && med.totalAmount !== undefined)) {
      return res.status(400).json({ error: "Invalid medicines format." });
    }

    // Calculate total amount
    const totalAmount = medicines.reduce((sum, med) => sum + (med.totalAmount || 0), 0);

    // Get the last order and auto-generate orderId
    const lastOrder = await SupplierOrder.findOne().sort({ orderId: -1 }).lean();
    let orderId = "001"; // Default for first order

    if (lastOrder && !isNaN(lastOrder.orderId)) {
      let lastId = parseInt(lastOrder.orderId, 10);
      orderId = String(lastId + 1).padStart(3, "0"); // Ensuring 3-digit format (e.g., 001, 002, ..., 999)
    }

    const newOrder = new SupplierOrder({
      orderId,
      supplierId,
      orderDate: orderDate || new Date(),
      expectedDeliveryDate,
      medicines,
      orderStatus,
      totalAmount,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all Supplier Orders
router.get("/", async (req, res) => {
  try {
    const orders = await SupplierOrder.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single Supplier Order by orderId
router.get("/:id", async (req, res) => {
  try {
    const order = await SupplierOrder.findOne({ orderId: req.params.id });
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Supplier Order details
router.put("/:id", async (req, res) => {
  try {
    const { medicines, orderStatus, expectedDeliveryDate, actualDeliveryDate } = req.body;

    let totalAmount = 0;
    if (medicines && medicines.length > 0) {
      totalAmount = medicines.reduce((sum, med) => sum + (med.totalAmount || 0), 0);
    }

    const updatedOrder = await SupplierOrder.findOneAndUpdate(
      { orderId: req.params.id },
      { medicines, orderStatus, expectedDeliveryDate, actualDeliveryDate, totalAmount },
      { new: true }
    );

    if (!updatedOrder) return res.status(404).json({ error: "Order not found" });

    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a Supplier Order
router.delete("/:id", async (req, res) => {
  try {
    const deletedOrder = await SupplierOrder.findOneAndDelete({
      $or: [{ orderId: req.params.id }, { _id: req.params.id }]
    });

    if (!deletedOrder) return res.status(404).json({ error: "Order not found" });

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
