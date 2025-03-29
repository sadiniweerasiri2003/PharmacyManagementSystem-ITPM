const mongoose = require("mongoose");

const supplierOrderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true }, // Auto-generated order ID
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
});

// 🔹 Auto-generate orderId before saving a new order
supplierOrderSchema.pre("save", async function (next) {
  if (this.isNew && !this.orderId) {
    const lastOrder = await this.constructor.findOne().sort({ orderId: -1 }).lean();

    if (lastOrder && !isNaN(lastOrder.orderId)) {
      let lastId = parseInt(lastOrder.orderId, 10);
      this.orderId = String(lastId + 1).padStart(7, "0"); // Increment last order ID
    } else {
      this.orderId = "0000001"; // First order
    }
  }

  // Ensure totalAmount is calculated correctly
  this.totalAmount = this.medicines.reduce((sum, med) => sum + (med.totalAmount || 0), 0);
  
  next();
});

// Check if the model already exists before defining it
const SupplierOrder = mongoose.models.SupplierOrder || mongoose.model("SupplierOrder", supplierOrderSchema);

module.exports = SupplierOrder;
