const express = require("express");
const router = express.Router();
const Sales = require("../models/Sales");
const Medicine = require("../models/Medicine");

// Get all sales
router.get("/", async (req, res) => {
    try {
        const sales = await Sales.find();
        res.status(200).json(sales);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error, could not fetch sales" });
    }
});

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
            let { medicineId, newName, newQty } = updatedMedicine;

            // Ensure newQty is a valid number
            newQty = Number(newQty);
            if (isNaN(newQty) || newQty <= 0) {
                return res.status(400).json({ message: `Invalid quantity for medicine ${newName}` });
            }

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
            sale.medicines[medicineIndex].qty_sold = newQty;  // Update quantity sold
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

// Get top selling medicines
router.get("/top-selling", async (req, res) => {
    try {
        const topMedicines = await Sales.aggregate([
            // Unwind the medicines array to treat each medicine as a separate document
            { $unwind: "$medicines" },
            // Group by medicine ID and name, sum up quantities
            {
                $group: {
                    _id: {
                        medicineId: "$medicines.medicineId",
                        name: "$medicines.name"
                    },
                    totalQuantity: { $sum: "$medicines.qty_sold" },
                    totalRevenue: { $sum: "$medicines.totalprice" }
                }
            },
            // Sort by total quantity in descending order
            { $sort: { totalQuantity: -1 } },
            // Limit to top 3
            { $limit: 3 },
            // Project the final format
            {
                $project: {
                    _id: 0,
                    medicineId: "$_id.medicineId",
                    name: "$_id.name",
                    totalQuantity: 1,
                    totalRevenue: 1
                }
            }
        ]);

        res.status(200).json(topMedicines);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error, could not fetch top selling medicines" });
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

// Get annual sales data
router.get('/annual', async (req, res) => {
  try {
    const annualSales = await Sales.aggregate([
      {
        $group: {
          _id: { $year: "$orderdate_time" },
          total: { $sum: { $sum: "$medicines.totalprice" } }
        }
      },
      { $project: { year: "$_id", total: 1, _id: 0 } },
      { $sort: { year: 1 } }
    ]);
    res.json(annualSales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get monthly sales data
router.get('/monthly', async (req, res) => {
  try {
    const monthlyData = await Sales.aggregate([
      {
        $group: {
          _id: { 
            year: { $year: "$orderdate_time" },
            month: { $month: "$orderdate_time" }
          },
          total: { $sum: { $sum: "$medicines.totalprice" } }
        }
      },
      { 
        $project: { 
          month: { $concat: [
            { $toString: "$_id.month" },
            "/",
            { $toString: "$_id.year" }
          ]},
          total: 1,
          _id: 0 
        } 
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);
    res.json(monthlyData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get medicine sales statistics
router.get('/medicine-stats', async (req, res) => {
  try {
    const medicineStats = await Sales.aggregate([
      { $unwind: "$medicines" },
      {
        $group: {
          _id: "$medicines.name",
          quantity: { $sum: "$medicines.qty_sold" }
        }
      },
      { $project: { name: "$_id", quantity: 1, _id: 0 } },
      { $sort: { quantity: -1 } },
      { $limit: 10 }
    ]);
    res.json(medicineStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
