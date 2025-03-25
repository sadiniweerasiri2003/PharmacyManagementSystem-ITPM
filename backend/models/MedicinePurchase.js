const mongoose = require("mongoose");

const MedicinePurchaseSchema = new mongoose.Schema({
    medicineId: { 
        type: String, 
        required: true,
        ref: 'Medicine' 
    },
    quantity: { 
        type: Number, 
        required: true 
    },
    price: {
        type: Number,
        required: true
    },
    actionType: {
        type: String,
        enum: ['NEW', 'UPDATE'],
        required: true
    },
    lastStockDate: {
        type: Date,
        required: true,
        validate: {
            validator: function(value) {
                return value <= new Date();
            },
            message: "Last stock date cannot be in the future"
        }
    },
    expiryDate: {
        type: Date,
        required: true,
        validate: {
            validator: function(value) {
                const today = new Date();
                return value > today;
            },
            message: "Expiry date must be in the future"
        }
    }
}, { timestamps: true });

// Validate dates before saving
MedicinePurchaseSchema.pre('save', function(next) {
    const today = new Date();
    
    if (this.lastStockDate > today) {
        next(new Error('Last stock date cannot be in the future'));
        return;
    }
    
    if (this.expiryDate <= today) {
        next(new Error('Expiry date must be in the future'));
        return;
    }
    
    if (this.lastStockDate >= this.expiryDate) {
        next(new Error('Last stock date must be before expiry date'));
        return;
    }
    
    next();
});

module.exports = mongoose.model("MedicinePurchase", MedicinePurchaseSchema);
