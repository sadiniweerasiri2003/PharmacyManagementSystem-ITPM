const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const db = req.app.locals.client.db('test');
        const medicines = await db.collection('medicines').find({}, {
            projection: { medicineId: 1, name: 1, _id: 0 }
        }).toArray();
        
        if (!medicines || medicines.length === 0) {
            return res.status(404).json({ message: 'No medicines found' });
        }
        
        res.json(medicines);
    } catch (error) {
        console.error('Error fetching medicines:', error);
        res.status(500).json({ message: 'Error fetching medicines', error: error.message });
    }
});

module.exports = router;
