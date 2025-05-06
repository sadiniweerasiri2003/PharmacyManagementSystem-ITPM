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

// Pre-save hook to hash password and generate cashier ID
userSchema.pre('save', async function (next) {
  // Skip if password is not modified and cashierId exists
  if (!this.isModified('password') && (!this.role === 'cashier' || this.cashierId)) {
    return next();
  }

  try {
    // Generate cashier ID if needed
    if (this.role === 'cashier' && !this.cashierId) {
      this.cashierId = await this.constructor.generateCashierId();
    }

    // Hash password if modified
    if (this.isModified('password')) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }

    next();
  } catch (err) {
    next(err);
  }
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
