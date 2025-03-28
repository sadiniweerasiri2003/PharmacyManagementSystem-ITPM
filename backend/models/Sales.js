const mongoose = require("mongoose");

const CounterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 1 }
});

const Counter = mongoose.model("Counter", CounterSchema);

const SalesSchema = new mongoose.Schema({
    invoiceId: { type: String, unique: true }, // Auto-generated invoice ID
    medicineId: { type: String, required: true, default: "M001" },
    qty_sold: { type: Number, required: true },
    unitprice: { type: Number, required: true },
    totalprice: { type: Number, required: true },
    orderdate_time: { type: Date, default: Date.now },
    payment_type: { type: String, enum: ["Cash", "Credit"], required: true },
    cashier_id: { type: String, required: true }
});

// Pre-save middleware to generate invoiceId
SalesSchema.pre("save", async function (next) {
    if (!this.invoiceId) {
        try {
            const counter = await Counter.findByIdAndUpdate(
                { _id: "invoiceId" },
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );

            this.invoiceId = `IN${String(counter.seq).padStart(3, "0")}`;
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});

module.exports = mongoose.model("Sales", SalesSchema);
