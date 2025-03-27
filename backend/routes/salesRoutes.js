const express = require("express");
const router = express.Router();
const Sales = require("../models/Sales");

// 📌 CREATE a new sale (POST)
router.post("/", async (req, res) => {
    try {
        const { orderid, medicineId = "M001", qty_sold, unitprice, payment_type, cashier_id = "CASHIER_001" } = req.body;

        // Calculate total price
        const totalprice = qty_sold * unitprice;

        // Create a new sale entry with dummy medicineid and cashier_id
        const newSale = new Sales({
            orderid,
            medicineId,  // Using dummy value for medicineid
            qty_sold,
            unitprice,
            totalprice,
            payment_type,
            cashier_id  // Default cashier ID
        });

        await newSale.save();
        res.status(201).json({ message: "Sale recorded successfully", sale: newSale });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 📌 READ all sales (GET)
router.get("/", async (req, res) => {
    try {
        const sales = await Sales.find().populate("medicineId", "medicine_name current_stock");
        res.status(200).json(sales);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 📌 READ single sale by orderid (GET)
router.get("/:orderid", async (req, res) => {
    try {
        const sale = await Sales.findOne({ orderid: req.params.orderid }).populate("medicineId");
        if (!sale) return res.status(404).json({ message: "Sale not found" });
        res.status(200).json(sale);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 📌 UPDATE a sale (PUT)
router.put("/:orderid", async (req, res) => {
    try {
        const { qty_sold, unitprice, payment_type } = req.body;
        const totalprice = qty_sold * unitprice; // Recalculate total price

        const updatedSale = await Sales.findOneAndUpdate(
            { orderid: req.params.orderid },
            { qty_sold, unitprice, totalprice, payment_type },
            { new: true }
        );

        if (!updatedSale) return res.status(404).json({ message: "Sale not found" });
        res.status(200).json({ message: "Sale updated successfully", sale: updatedSale });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 📌 DELETE a sale (DELETE)
router.delete("/:orderid", async (req, res) => {
    try {
        const deletedSale = await Sales.findOneAndDelete({ orderid: req.params.orderid });

        if (!deletedSale) {
            return res.status(404).json({ message: "Sale not found" });
        }

        res.status(200).json({ message: "Sale deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
