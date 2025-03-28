const mongoose = require("mongoose");

// Counter Schema for generating unique invoice IDs
const CounterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 1 }
});

const Counter = mongoose.model("Counter", CounterSchema);

// Sales Schema to handle multiple medicines per sale
const SalesSchema = new mongoose.Schema({
    invoiceId: { type: String, unique: true },
    medicines: [{
        medicineId: { type: String, required: true },
        name: { type: String, required: true }, // This is the field for storing the medicine name
        qty_sold: { type: Number, required: true },
        unitprice: { type: Number, required: true },
        totalprice: { type: Number, required: true },
    }],
    orderdate_time: { type: Date, default: Date.now },
    payment_type: { type: String, enum: ["Cash", "Credit"], required: true },
    cashier_id: { type: String, required: true }
});

// Pre-save middleware to generate invoiceId correctly
SalesSchema.pre("save", async function (next) {
    if (!this.invoiceId) {
        try {
            let counter = await Counter.findByIdAndUpdate(
                { _id: "invoiceId" },
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );
            this.invoiceId = `IN${String(counter.seq).padStart(5, "0")}`;
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});

const Sales = mongoose.model("Sales", SalesSchema);

module.exports = Sales;
