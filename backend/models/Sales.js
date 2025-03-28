const mongoose = require("mongoose");

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
            // Find the last inserted invoiceId and extract the numeric part
            const lastSale = await Sales.findOne().sort({ invoiceId: -1 }).exec();
            let lastInvoiceId = lastSale ? lastSale.invoiceId : 'IN00000';

            // Extract numeric part and increment by 1
            let lastNumber = parseInt(lastInvoiceId.replace('IN', ''), 10);
            let newInvoiceId = `IN${String(lastNumber + 1).padStart(5, '0')}`;

            // Assign the new invoiceId
            this.invoiceId = newInvoiceId;
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
