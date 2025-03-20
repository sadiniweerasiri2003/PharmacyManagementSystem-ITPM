const mongoose = require("mongoose");

const supplierOrderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true },
  supplierId: { type: String, required: true, default: "1" },
  medicines: [
    {
      medicineId: { type: String, required: true },
      orderedQuantity: { type: Number, required: true },
      receivedQuantity: { type: Number, default: 0 },
      totalAmount: { type: Number, required: true },
      actualDeliveryDate: { type: Date, default: null }
    }
  ],
  orderDate: { type: Date, required: true, default: Date.now },
  orderStatus: { type: String, enum: ["Pending", "Completed", "Cancelled"], default: "Pending" },
  totalAmount: { type: Number, required: true }
});

// Pre-save hook to calculate totalAmount based on medicines
supplierOrderSchema.pre("save", function (next) {
  this.totalAmount = this.medicines.reduce((sum, medicine) => sum + medicine.totalAmount, 0);
  next();
});

// Prevent re-compilation error
module.exports = mongoose.models.SupplierOrder || mongoose.model("SupplierOrder", supplierOrderSchema);
