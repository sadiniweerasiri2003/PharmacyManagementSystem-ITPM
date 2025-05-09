const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const db = req.app.locals.client.db('test');
        const predictions = await db.collection('medicine_predictions').find({}).toArray();
        
        if (!predictions || predictions.length === 0) {
            return res.status(404).json({ message: 'No predictions found' });
        }
        
        res.json(predictions);
    } catch (error) {
        console.error('Error fetching predictions:', error);
        res.status(500).json({ message: 'Error fetching predictions', error: error.message });
    }
});

module.exports = router;
