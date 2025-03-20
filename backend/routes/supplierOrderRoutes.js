const express = require("express");
const SupplierOrder = require("../models/supplierOrder");

const router = express.Router();

// 📌 1️⃣ Create a new Supplier Order
router.post("/", async (req, res) => {
  try {
    console.log("Request Body:", req.body);  // Log the body to check the data
    
    const { supplierId, orderDate = new Date(), medicines, orderStatus = "Pending" } = req.body;

    // Validate if at least one medicine is provided
    if (!medicines || medicines.length === 0) {
      return res.status(400).json({ error: "At least one medicine must be included in the order." });
    }

    // Validate each medicine (excluding expectedDeliveryDate)
    for (const med of medicines) {
      if (!med.medicineId || !med.orderedQuantity || !med.totalAmount) {
        return res.status(400).json({ error: "Each medicine must have a valid medicineId, orderedQuantity, and totalAmount." });
      }
    }

    // Calculate total amount from all medicines
    const totalAmount = medicines.reduce((sum, med) => sum + med.totalAmount, 0);

    // Create the new order with an auto-generated orderId based on the current timestamp
    const orderId = `ORD-${Date.now()}`;

    const newOrder = new SupplierOrder({
      orderId,
      supplierId,
      orderDate,
      medicines,
      orderStatus,
      totalAmount,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error("Error:", err.message);  // Log error details for debugging
    res.status(400).json({ error: err.message });
  }
});

// 📌 2️⃣ Get all Supplier Orders
router.get("/", async (req, res) => {
  try {
    const orders = await SupplierOrder.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 3️⃣ Get a single Supplier Order by ID
router.get("/:id", async (req, res) => {
  try {
    const order = await SupplierOrder.findOne({ orderId: req.params.id });
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 4️⃣ Update Supplier Order details
router.put("/:id", async (req, res) => {
  try {
    const { medicines, orderStatus } = req.body;

    // Validate each medicine (excluding expectedDeliveryDate)
    for (const med of medicines) {
      if (!med.medicineId || !med.orderedQuantity || !med.totalAmount) {
        return res.status(400).json({ error: "Each medicine must have a valid medicineId, orderedQuantity, and totalAmount." });
      }
    }

    let totalAmount = 0;
    if (medicines && medicines.length > 0) {
      totalAmount = medicines.reduce((sum, med) => sum + med.totalAmount, 0);
    }

    // Update the order with the new data
    const updatedOrder = await SupplierOrder.findOneAndUpdate(
      { orderId: req.params.id },
      { medicines, orderStatus, totalAmount },
      { new: true }
    );

    if (!updatedOrder) return res.status(404).json({ error: "Order not found" });

    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 5️⃣ Delete a Supplier Order
router.delete("/:id", async (req, res) => {
  try {
    const deletedOrder = await SupplierOrder.findOneAndDelete({ orderId: req.params.id });
    if (!deletedOrder) return res.status(404).json({ error: "Order not found" });
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
