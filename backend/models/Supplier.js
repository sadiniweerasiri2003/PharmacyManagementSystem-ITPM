const mongoose = require("mongoose");

// Define Supplier Schema
const supplierSchema = new mongoose.Schema({
  supplierId: { type: String, unique: true }, // Auto-generated
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  leadTimeDays: { type: Number, default: 0 },
  lastOrderDate: { type: Date, default: null },
  totalOrdersSupplied: { type: Number, default: 0 },
  rating: { type: Number, min: 0, max: 5, default: 0 },
});

// Auto-generate supplierId starting from "SUP001"
supplierSchema.pre("save", async function (next) {
  if (!this.supplierId) {
    const lastSupplier = await this.constructor.findOne().sort({ supplierId: -1 });
    if (lastSupplier && lastSupplier.supplierId.startsWith("SUP")) {
      let lastId = parseInt(lastSupplier.supplierId.replace("SUP", ""), 10);
      this.supplierId = `SUP${String(lastId + 1).padStart(3, "0")}`;
    } else {
      this.supplierId = "SUP001"; // First supplier
    }
  }
  next();
});

module.exports = mongoose.model("Supplier", supplierSchema);
