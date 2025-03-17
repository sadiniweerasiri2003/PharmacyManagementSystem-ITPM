const mongoose = require("mongoose");

const CashierSchema = new mongoose.Schema({
    cashierID: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

module.exports = mongoose.model("Cashier", CashierSchema);
