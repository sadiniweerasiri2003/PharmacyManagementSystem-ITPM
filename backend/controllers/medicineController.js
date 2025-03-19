const Medicine = require("../models/Medicine");

// Add a new medicine
exports.addMedicine = async (req, res) => {
    try {
        const newMedicine = new Medicine(req.body);
        await newMedicine.save();
        res.status(201).json(newMedicine);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all medicines
exports.getMedicines = async (req, res) => {
    try {
        const medicines = await Medicine.find();
        res.json(medicines);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get medicine by ID
exports.getMedicineById = async (req, res) => {
    try {
        const medicine = await Medicine.findById(req.params.id);
        if (!medicine) return res.status(404).json({ message: "Medicine not found" });
        res.json(medicine);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update medicine
exports.updateMedicine = async (req, res) => {
    try {
        const updatedMedicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedMedicine);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete medicine
exports.deleteMedicine = async (req, res) => {
    try {
        await Medicine.findByIdAndDelete(req.params.id);
        res.json({ message: "Medicine deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
