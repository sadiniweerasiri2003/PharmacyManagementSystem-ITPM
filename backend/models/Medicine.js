const mongoose = require("mongoose");

const MedicineSchema = new mongoose.Schema(
  {
    medicineId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    batchNumber: { type: String, required: true, unique: true },
    expiryDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return value > today;
        },
        message: "Expiry date must be in the future",
      },
    },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    restockedDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          value.setHours(0, 0, 0, 0);
          return value <= today;
        },
        message: "Restock date cannot be in the future",
      },
    },
    supplierId: { type: String, required: true },
  },
  { timestamps: true }
);

// Add validation for date relationships
MedicineSchema.pre("save", function (next) {
  if (this.restockedDate >= this.expiryDate) {
    next(new Error("Restock date must be before expiry date"));
    return;
  }
  next();
});

// Auto-generate medicineId and batchNumber before saving
MedicineSchema.pre("save", async function (next) {
  if (!this.medicineId || !this.batchNumber) {
    try {
      const lastMedicine = await mongoose
        .model("Medicine")
        .findOne({}, {}, { sort: { createdAt: -1 } });

      let newMedicineId = "MED001";
      let newBatchNumber = "B000001";

      if (lastMedicine) {
        // Get last Medicine ID and extract the numeric part
        const lastIdNumber = parseInt(lastMedicine.medicineId.replace("MED", ""), 10) || 0;
        newMedicineId = `MED${String(lastIdNumber + 1).padStart(3, "0")}`;

        // Get last Batch Number and extract the numeric part
        const lastBatchNumber = parseInt(lastMedicine.batchNumber.replace("B", ""), 10) || 0;
        newBatchNumber = `B${String(lastBatchNumber + 1).padStart(6, "0")}`;
      }

      if (!this.medicineId) this.medicineId = newMedicineId;
      if (!this.batchNumber) this.batchNumber = newBatchNumber;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

module.exports = mongoose.model("Medicine", MedicineSchema);
