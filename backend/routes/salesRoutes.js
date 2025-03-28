const express = require("express");
const router = express.Router();
const Sales = require("../models/Sales");
const Medicine = require("../models/Medicine");

// Create a new sale with multiple medicines
router.post("/", async (req, res) => {
    try {
        const { medicines, payment_type, cashier_id } = req.body;

        // Validate required fields
        if (!medicines || medicines.length === 0 || !payment_type || !cashier_id) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Calculate total price for each medicine
        for (let item of medicines) {
            item.totalprice = item.qty_sold * item.unitprice;  // Calculate total price for each medicine
        }

        // Calculate the overall invoice total price
        let totalInvoicePrice = medicines.reduce((total, item) => total + item.totalprice, 0);

        // Create the new sale record
        const newSale = new Sales({
            medicines,
            payment_type,
            cashier_id,
            orderdate_time: new Date(),
        });

        // Save the new sale record to the database
        await newSale.save();
        res.status(201).json(newSale);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error, could not create sale" });
    }
});

// Get today's sales records
router.get("/today", async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date();
        tomorrow.setHours(23, 59, 59, 999);

        const sales = await Sales.find({
            orderdate_time: { $gte: today, $lt: tomorrow }
        });

        res.status(200).json(sales);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Update multiple medicines in a sale
router.put("/update-medicines/:invoiceId", async (req, res) => {
    try {
        const { invoiceId } = req.params;
        const { updatedMedicines } = req.body;  // Array of medicines to be updated

        // Find the sale by invoiceId
        const sale = await Sales.findOne({ invoiceId });

        if (!sale) {
            return res.status(404).json({ message: "Sale not found" });
        }

        // Loop through each updated medicine and update it in the sale
        for (const updatedMedicine of updatedMedicines) {
            const { medicineId, newName, newQty } = updatedMedicine;

            // Find the specific medicine entry within the sale
            const medicineIndex = sale.medicines.findIndex(med => med.medicineId === medicineId);

            if (medicineIndex === -1) {
                return res.status(404).json({ message: `Medicine with ID ${medicineId} not found in sale` });
            }

            // Find the new medicine details by name
            const medicineDetails = await Medicine.findOne({ name: newName });

            if (!medicineDetails) {
                return res.status(404).json({ message: `Medicine with name ${newName} not found in database` });
            }

            // Update the medicine details in the sale
            sale.medicines[medicineIndex].medicineId = medicineDetails.medicineId;  // Update medicineId
            sale.medicines[medicineIndex].name = newName;  // Update medicine name
            sale.medicines[medicineIndex].unitprice = medicineDetails.price;  // Update unit price
            sale.medicines[medicineIndex].totalprice = newQty * medicineDetails.price;  // Recalculate total price
        }

        // Save the updated sale
        await sale.save();

        res.status(200).json({ message: "Medicines updated successfully", sale });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error, could not update medicines" });
    }
});

// Delete a sale by invoiceId
router.delete("/:invoiceId", async (req, res) => {
    try {
        const { invoiceId } = req.params;
        
        // Find and delete the sale by invoiceId
        const deletedSale = await Sales.findOneAndDelete({ invoiceId });

        if (!deletedSale) {
            return res.status(404).json({ message: "Sale not found" });
        }

        res.status(200).json({ message: "Sale deleted successfully", deletedSale });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error, could not delete sale" });
    }
});


module.exports = router;
