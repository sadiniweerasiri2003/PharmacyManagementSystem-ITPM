const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Create the user schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['admin', 'cashier', 'supplier'],
  },
  cashierId: {
    type: String,
    unique: true,
  },
});

// Static method to generate a cashier ID
userSchema.statics.generateCashierId = async function () {
  const count = await this.countDocuments({ role: 'cashier' });
  const newCashierId = `C${(count + 1).toString().padStart(3, '0')}`;
  return newCashierId;
};

// Pre-save hook to auto-generate the cashier ID for cashiers
userSchema.pre('save', async function (next) {
  if (this.role === 'cashier' && !this.cashierId) {
    try {
      // Generate a cashier ID
      this.cashierId = await this.constructor.generateCashierId();
    } catch (err) {
      return next(err);
    }
  }

  // Hash the password before saving
  if (this.isModified('password')) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    } catch (err) {
      return next(err);
    }
  }

  next();
});

// Method to compare entered password with the stored hash
userSchema.methods.comparePassword = async function (enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (err) {
    throw new Error('Error comparing passwords');
  }
};

const User = mongoose.model('User', userSchema);
module.exports = User;
