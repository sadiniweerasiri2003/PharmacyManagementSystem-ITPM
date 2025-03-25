const mongoose = require("mongoose");

// Check if the model already exists before defining it
const SupplierOrder = mongoose.models.SupplierOrder || mongoose.model("SupplierOrder", new mongoose.Schema({
  supplierId: { type: String, required: true },
  orderDate: { type: Date, required: true, default: Date.now },
  expectedDeliveryDate: { type: Date, required: true },
  actualDeliveryDate: { type: Date, default: null },
  medicines: [
    {
      medicineId: { type: String, required: true },
      orderedQuantity: { type: Number, required: true },
      receivedQuantity: { type: Number, default: 0 },
      totalAmount: { type: Number, required: true }
    }
  ],
  orderStatus: { type: String, enum: ["Pending", "Completed", "Cancelled", "Approved"], default: "Pending" },
  totalAmount: { type: Number, required: true, default: 0 }
}));

module.exports = SupplierOrder;
