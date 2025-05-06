const express = require("express");
const router = express.Router();
const Medicine = require("../models/Medicine.js");  // Import the Medicine model


// Route to get medicineId and price by medicine name
router.get("/getauto", async (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ message: "Medicine name is required" });
  }

  try {
    // Log the name parameter
    console.log("Searching for medicine with name:", name);

    // Search for the medicine by name using a case-insensitive regex
    const medicine = await Medicine.findOne({
      name: { $regex: name, $options: "i" },
    });

    if (!medicine) {
      return res.status(404).json({ message: `Medicine with name "${name}" not found` });
    }

    // Return the medicineId and price
    const { medicineId, price } = medicine;
    res.status(200).json({ medicineId, price });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error, could not fetch medicine details" });
  }
});
// Route to get all medicine names
router.get("/getallnames", async (req, res) => {
    try {
      // Fetch all medicines and extract only the 'name' field
      const medicines = await Medicine.find({}, "name");
  
      if (medicines.length === 0) {
        return res.status(404).json({ message: "No medicines found in the database" });
      }
  
      // Return all medicine names
      res.status(200).json(medicines);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error, could not fetch medicine names" });
    }
  });

  
module.exports = router;
