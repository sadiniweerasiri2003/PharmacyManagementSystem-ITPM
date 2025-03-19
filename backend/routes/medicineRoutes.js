const express = require("express");
const router = express.Router();
const Medicine = require("../models/Medicine"); // Import Medicine model

const {
    addMedicine,
    getMedicines,
    getMedicineById,
    updateMedicine,
    deleteMedicine
} = require("../controllers/medicineController");

router.post("/", addMedicine);
router.get("/", getMedicines);
router.get("/:id", getMedicineById);
router.put("/:id", updateMedicine);
router.delete("/:id", deleteMedicine);


module.exports = router;
