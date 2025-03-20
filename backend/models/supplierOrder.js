const mongoose = require("mongoose");

// Supplier Order Schema
const supplierOrderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true }, // Auto-generated
  supplierId: { type: String, required: true, default: "1" }, // Dummy value for now
  medicineId: { type: String, required: true, default: "001" }, // Dummy value for now
  orderDate: { type: Date, required: true, default: Date.now },
  expectedDeliveryDate: { type: Date, required: true },
  actualDeliveryDate: { type: Date, default: null },
  orderedQuantity: { type: Number, required: true },
  receivedQuantity: { type: Number, default: 0 },
  orderStatus: { type: String, enum: ["Pending", "Completed", "Cancelled"], default: "Pending" },
  totalAmount: { type: Number, required: true }
});

// Auto-generate orderId starting from "0000001"
supplierOrderSchema.pre("save", async function (next) {
  if (!this.orderId) {
    const lastOrder = await this.constructor.findOne().sort({ orderId: -1 });
    if (lastOrder) {
      let lastId = parseInt(lastOrder.orderId, 10);
      this.orderId = String(lastId + 1).padStart(7, "0"); // Increment ID
    } else {
      this.orderId = "0000001"; // First order
    }
  }
  next();
});

module.exports = mongoose.model("SupplierOrder", supplierOrderSchema);
