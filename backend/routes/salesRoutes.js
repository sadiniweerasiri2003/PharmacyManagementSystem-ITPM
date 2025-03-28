const express = require("express");
const router = express.Router();
const Sales = require("../models/Sales");

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

module.exports = router;
