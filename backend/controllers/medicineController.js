const Medicine = require("../models/Medicine");
const MedicinePurchase = require("../models/MedicinePurchase");

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

// Add this validation function
const validateMedicineName = async (name) => {
    const existingMedicine = await Medicine.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    return !existingMedicine;
};

// ✅ Add a new medicine with correct auto-generated IDs
exports.addMedicine = async (req, res) => {
    try {
        // Validate medicine name
        const isNameValid = await validateMedicineName(req.body.name);
        if (!isNameValid) {
            return res.status(400).json({ 
                message: "Medicine with this name already exists",
                field: "name"
            });
        }

        // Get next available IDs
        const { medicineId, batchNumber } = await getNextMedicineIds();
        
        // Parse dates
        const expiryDate = new Date(req.body.expiryDate);
        const restockedDate = new Date(req.body.restockedDate);

        // Validate dates
        if (restockedDate > new Date()) {
            return res.status(400).json({ 
                message: "Restock date cannot be in the future",
                field: "restockedDate"
            });
        }

        if (expiryDate <= new Date()) {
            return res.status(400).json({ 
                message: "Expiry date must be in the future",
                field: "expiryDate"
            });
        }

        // Create new medicine
        const newMedicine = new Medicine({
            medicineId,
            batchNumber,
            ...req.body,
            expiryDate,
            restockedDate
        });

        const savedMedicine = await newMedicine.save();

        // Create purchase record
        const purchase = new MedicinePurchase({
            medicineId: medicineId,
            quantity: req.body.quantity,
            price: req.body.price,
            actionType: 'NEW',
            lastStockDate: restockedDate,
            expiryDate: expiryDate
        });
        
        await purchase.save();

        res.status(201).json(savedMedicine);
    } catch (error) {
        console.error("Error adding medicine:", error);
        if (error.code === 11000) {
            res.status(400).json({ 
                message: "Duplicate medicine ID. Please try again.",
                field: "medicineId"
            });
        } else {
            res.status(500).json({ 
                message: "Error adding medicine: " + error.message 
            });
        }
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
        if (!existingMedicine) {
            return res.status(404).json({ message: "Medicine not found" });
        }

        // Parse dates and create date objects
        const expiryDate = new Date(req.body.expiryDate);
        const restockedDate = new Date(req.body.restockedDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to start of day for fair comparison

        // Format the dates to exclude time
        restockedDate.setHours(0, 0, 0, 0);
        expiryDate.setHours(0, 0, 0, 0);

        // Validate restock date - allow today's date
        if (restockedDate > today) {
            return res.status(400).json({
                message: "Restock date cannot be in the future",
                field: "restockedDate"
            });
        }

        // Validate expiry date
        if (expiryDate <= today) {
            return res.status(400).json({
                message: "Expiry date must be in the future",
                field: "expiryDate"
            });
        }

        // Validate restock date is before expiry date
        if (restockedDate >= expiryDate) {
            return res.status(400).json({
                message: "Restock date must be before expiry date",
                field: "restockedDate"
            });
        }

        // Create purchase record with validated dates
        const purchase = new MedicinePurchase({
            medicineId: existingMedicine.medicineId,
            quantity: req.body.quantity,
            price: req.body.price,
            actionType: 'UPDATE',
            lastStockDate: restockedDate,
            expiryDate: expiryDate
        });
        await purchase.save();

        // Update medicine with validated dates
        const updatedMedicine = await Medicine.findByIdAndUpdate(
            req.params.id,
            {
                ...req.body,
                medicineId: existingMedicine.medicineId,
                batchNumber: existingMedicine.batchNumber,
                expiryDate: expiryDate,
                restockedDate: restockedDate
            },
            { new: true, runValidators: true }
        );

        res.json(updatedMedicine);
    } catch (error) {
        console.error("Update error:", error);
        // Send more detailed error message
        res.status(500).json({
            message: "Error updating medicine",
            error: error.message,
            details: error.errors ? Object.keys(error.errors).map(key => ({
                field: key,
                message: error.errors[key].message
            })) : null
        });
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

// Add new endpoint to get purchase history
exports.getPurchaseHistory = async (req, res) => {
    try {
        const purchases = await MedicinePurchase.find().sort({ purchaseDate: -1 });
        res.json(purchases);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
