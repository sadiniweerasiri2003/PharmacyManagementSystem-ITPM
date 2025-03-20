const mongoose = require("mongoose");

// Check if the model already exists before defining it
const SupplierOrder = mongoose.models.SupplierOrder || mongoose.model("SupplierOrder", new mongoose.Schema({
  orderId: { type: String, unique: true }, // Auto-generated
  supplierId: { type: String, required: true, default: "1" }, // Dummy value for now
  orderDate: { type: Date, required: true, default: Date.now },
  expectedDeliveryDate: { type: Date, required: true },
  actualDeliveryDate: { type: Date, default: null },
  medicines: [
    {
      medicineId: { type: String, required: true }, // Each medicine has its own ID
      orderedQuantity: { type: Number, required: true },
      receivedQuantity: { type: Number, default: 0 },
      totalAmount: { type: Number, required: true } // Amount for this specific medicine
    }
  ],
  orderStatus: { type: String, enum: ["Pending", "Completed", "Cancelled"], default: "Pending" },
  totalAmount: { type: Number, required: true, default: 0 } // Sum of all medicine amounts
}));

// Auto-generate orderId starting from "0000001"
SupplierOrder.schema.pre("save", async function (next) {
  if (!this.orderId) {
    const lastOrder = await this.constructor.findOne().sort({ orderId: -1 });
    if (lastOrder) {
      let lastId = parseInt(lastOrder.orderId, 10);
      this.orderId = String(lastId + 1).padStart(7, "0"); // Increment ID
    } else {
      this.orderId = "0000001"; // First order
    }
  }

  // Calculate total order amount by summing up all medicine total amounts
  this.totalAmount = this.medicines.reduce((sum, med) => sum + med.totalAmount, 0);

  next();
});

module.exports = SupplierOrder;
