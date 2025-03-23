const Medicine = require("../models/Medicine");

// Function to generate the next medicineId and batchNumber
const getNextMedicineIds = async () => {
    try {
        const lastMedicine = await Medicine.findOne({}, {}, { sort: { createdAt: -1 } });

        let newMedicineId = "MED001";
        let newBatchNumber = "B000001";

        if (lastMedicine && lastMedicine.medicineId && lastMedicine.batchNumber) {
            // Ensure medicineId extraction is correct
            const lastIdMatch = lastMedicine.medicineId.match(/^MED(\d+)$/);
            const lastBatchMatch = lastMedicine.batchNumber.match(/^B(\d+)$/);

            const lastIdNumber = lastIdMatch ? parseInt(lastIdMatch[1], 10) : 0;
            newMedicineId = `MED${String(lastIdNumber + 1).padStart(3, "0")}`;

            const lastBatchNumber = lastBatchMatch ? parseInt(lastBatchMatch[1], 10) : 0;
            newBatchNumber = `B${String(lastBatchNumber + 1).padStart(6, "0")}`;
        }

        return { medicineId: newMedicineId, batchNumber: newBatchNumber };
    } catch (error) {
        console.error("Error generating IDs:", error);
        throw error;
    }
};

// ✅ Add a new medicine with correct auto-generated IDs
exports.addMedicine = async (req, res) => {
    try {
        const { medicineId, batchNumber } = await getNextMedicineIds();

        const newMedicine = new Medicine({
            medicineId,  // Ensure the correct format
            batchNumber,
            ...req.body,
        });

        await newMedicine.save();
        res.status(201).json(newMedicine);
    } catch (error) {
        console.error("Error adding medicine:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ✅ API to fetch the next auto-generated IDs for frontend
exports.getNextMedicineId = async (req, res) => {
    try {
        const nextIds = await getNextMedicineIds();
        res.json(nextIds);
    } catch (error) {
        console.error("Error fetching next IDs:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


// ✅ Get all medicines
exports.getMedicines = async (req, res) => {
    try {
        const medicines = await Medicine.find();
        res.json(medicines);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Get medicine by ID
exports.getMedicineById = async (req, res) => {
    try {
        const medicine = await Medicine.findById(req.params.id);
        if (!medicine) return res.status(404).json({ message: "Medicine not found" });
        res.json(medicine);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Update medicine (prevent `medicineId` and `batchNumber` from changing)
exports.updateMedicine = async (req, res) => {
    try {
        const existingMedicine = await Medicine.findById(req.params.id);
        if (!existingMedicine) return res.status(404).json({ message: "Medicine not found" });

        // Ensure medicineId and batchNumber remain unchanged
        const updatedMedicine = await Medicine.findByIdAndUpdate(
            req.params.id,
            { ...req.body, medicineId: existingMedicine.medicineId, batchNumber: existingMedicine.batchNumber },
            { new: true }
        );

        res.json(updatedMedicine);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Delete medicine
exports.deleteMedicine = async (req, res) => {
    try {
        await Medicine.findByIdAndDelete(req.params.id);
        res.json({ message: "Medicine deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ API to fetch the next medicineId & batchNumber for frontend display
exports.getNextMedicineId = async (req, res) => {
    try {
        const nextIds = await getNextMedicineIds();
        res.json(nextIds);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
