const express = require("express");
const SupplierOrder = require("../models/supplierOrder");

const router = express.Router();

// Function to generate the next order ID in "OD001" format
const generateOrderId = async () => {
  const lastOrder = await SupplierOrder.findOne().sort({ orderId: -1 }).lean();

  let nextOrderId = "OD001"; // Default for first order

  if (lastOrder && /^OD\d{3}$/.test(lastOrder.orderId)) {
    const lastIdNumber = parseInt(lastOrder.orderId.slice(2), 10); // Extract numeric part
    nextOrderId = `OD${String(lastIdNumber + 1).padStart(3, "0")}`; // Increment and format
  }

  return nextOrderId;
};

// Create a new Supplier Order
router.post("/", async (req, res) => {
  try {
    const { supplierId, orderDate, expectedDeliveryDate, medicines, orderStatus } = req.body;

    if (!medicines || !Array.isArray(medicines) || medicines.length === 0) {
      return res.status(400).json({ error: "At least one medicine must be included in the order." });
    }

    for (const med of medicines) {
      if (!med.medicineId || !med.orderedQuantity) {
        return res.status(400).json({ error: "Invalid medicine format. Each item must have 'medicineId' and 'orderedQuantity'." });
      }
      med.totalAmount = med.totalAmount || 0; // Default to 0 if not provided
    }

    const totalAmount = medicines.reduce((sum, med) => sum + med.totalAmount, 0);
    const orderId = await generateOrderId();

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
    res.status(500).json({ error: err.message });
  }
});

// Get all Supplier Orders with optional search query
router.get("/", async (req, res) => {
  try {
    const { search } = req.query; // Get the search term from query parameters
    let filter = {}; // Default to no filter

    if (search) {
      // If search term is provided, create a case-insensitive regex filter
      filter = {
        $or: [
          { orderId: { $regex: search, $options: "i" } }, // Search in orderId
          { supplierId: { $regex: search, $options: "i" } }, // Search in supplierId
          { orderStatus: { $regex: search, $options: "i" } }, // Search in orderStatus
        ]
      };
    }

    // Fetch orders with the filter applied (if any)
    const orders = await SupplierOrder.find(filter);
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single Supplier Order by ID
router.get("/:id", async (req, res) => {
  try {
    const order = await SupplierOrder.findOne({ orderId: req.params.id });
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Supplier Order (Including Actual Delivery Date for Completed Orders)
router.put("/:id", async (req, res) => {
  try {
    const { medicines, orderStatus, expectedDeliveryDate, actualDeliveryDate } = req.body;

    // Ensure totalAmount is calculated if medicines are present
    let totalAmount = 0;
    if (medicines && medicines.length > 0) {
      totalAmount = medicines.reduce((sum, med) => sum + (med.totalAmount || 0), 0);
    }

    // Set actual delivery date only if order is marked as completed
    let updateFields = { medicines, orderStatus, expectedDeliveryDate, totalAmount };

    if (orderStatus === "Completed" && !actualDeliveryDate) {
      updateFields.actualDeliveryDate = new Date(); // Set to current date if not provided
    } else if (actualDeliveryDate) {
      updateFields.actualDeliveryDate = actualDeliveryDate;
    }

    // Ensure the order exists before trying to update
    const updatedOrder = await SupplierOrder.findOneAndUpdate(
      { orderId: req.params.id }, // Use orderId for lookup
      updateFields,
      { new: true } // Return the updated order
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" }); // Order not found
    }

    res.status(200).json(updatedOrder); // Respond with updated order
  } catch (err) {
    res.status(500).json({ error: err.message }); // Handle errors
  }
});

// Delete a Supplier Order
router.delete("/:id", async (req, res) => {
  try {
    const deletedOrder = await SupplierOrder.findOneAndDelete({ orderId: req.params.id });
    
    if (!deletedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;