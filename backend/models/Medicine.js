const mongoose = require("mongoose");

const MedicineSchema = new mongoose.Schema({
    medicineId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    batchNumber: { type: String, required: true },
    expiryDate: { type: Date, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    restockedDate: { type: Date, required: true },
    supplierId: { type: String, required: true },
},
{ timestamps: true }
);

module.exports = mongoose.model("Medicine", MedicineSchema);
