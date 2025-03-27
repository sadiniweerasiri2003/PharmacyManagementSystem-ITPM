const mongoose = require("mongoose");

const SalesSchema = new mongoose.Schema({
    orderid: { type: String, required: true, unique: true },
    medicineId: { type: String, required: true, default: 'M001' }, // Dummy value (string format)
    qty_sold: { type: Number, required: true },
    unitprice: { type: Number, required: true },
    totalprice: { type: Number, required: true },
    orderdate_time: { type: Date, default: Date.now },
    payment_type: { type: String, enum: ["Cash", "Credit"], required: true }, // Checkbox selection
    cashier_id: { type: String, default: "CASHIER_001" } // Dummy value
});

module.exports = mongoose.model("Sales", SalesSchema);
