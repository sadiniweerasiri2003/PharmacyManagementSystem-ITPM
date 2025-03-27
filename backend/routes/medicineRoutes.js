const express = require("express");
const router = express.Router();
const Medicine = require("../models/Medicine"); 

const {
    addMedicine,
    getMedicines,
    getMedicineById,
    updateMedicine,
    deleteMedicine,
    getPurchaseHistory
} = require("../controllers/medicineController");

router.post("/", addMedicine);
router.get("/", getMedicines);
router.get("/purchases/history", getPurchaseHistory); // Move this above /:id route
router.get("/:id", getMedicineById);
router.put("/:id", updateMedicine);
router.delete("/:id", deleteMedicine);

// Add this temporary route to clean up duplicates (remove in production)
router.delete("/cleanup/duplicates", async (req, res) => {
    try {
        const result = await Medicine.aggregate([
            { $group: { _id: "$medicineId", count: { $sum: 1 }, ids: { $push: "$_id" } } },
            { $match: { count: { $gt: 1 } } }
        ]);
        
        for (let duplicate of result) {
            // Keep the first one, delete the rest
            const [keep, ...remove] = duplicate.ids;
            await Medicine.deleteMany({ _id: { $in: remove } });
        }
        
        res.json({ message: "Duplicates cleaned up" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
