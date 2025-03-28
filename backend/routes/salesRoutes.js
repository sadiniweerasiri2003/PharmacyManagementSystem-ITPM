const express = require('express');
const router = express.Router();
const Sales = require('../models/Sales');

// Create a new sale
router.post('/', async (req, res) => {
    try {
        const { medicineId, qty_sold, unitprice, totalprice, payment_type, cashier_id } = req.body;

        if (!medicineId || !qty_sold || !unitprice || !totalprice || !payment_type || !cashier_id) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Create new sale object
        const newSale = new Sales({
            medicineId,
            qty_sold,
            unitprice,
            totalprice,
            payment_type,
            cashier_id,
        });

        // Save the sale
        await newSale.save();
        res.status(201).json(newSale);  // Return the newly created sale
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error, could not create sale" });
    }
});

// Get all sales records
router.get("/", async (req, res) => {
    try {
        const sales = await Sales.find();
        res.status(200).json(sales);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get a specific sale by invoiceId
router.get("/:invoiceId", async (req, res) => {
    try {
        const sale = await Sales.findOne({ invoiceId: req.params.invoiceId });
        if (!sale) {
            return res.status(404).json({ message: "Sale not found" });
        }
        res.status(200).json(sale);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update a sale by invoiceId
router.put("/sales/:invoiceId", async (req, res) => {
    try {
        const { medicineId, qty_sold, unitprice, totalprice, payment_type, cashier_id } = req.body;

        // Find the sale by invoiceId and update it
        const updatedSale = await Sales.findOneAndUpdate(
            { invoiceId: req.params.invoiceId },
            {
                medicineId,
                qty_sold,
                unitprice,
                totalprice,
                payment_type,
                cashier_id
            },
            { new: true }
        );

        if (!updatedSale) {
            return res.status(404).json({ message: "Sale not found" });
        }

        res.status(200).json(updatedSale);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a sale by invoiceId
router.delete("/sales/:invoiceId", async (req, res) => {
    try {
        const deletedSale = await Sales.findOneAndDelete({ invoiceId: req.params.invoiceId });
        if (!deletedSale) {
            return res.status(404).json({ message: "Sale not found" });
        }
        res.status(200).json({ message: "Sale deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
