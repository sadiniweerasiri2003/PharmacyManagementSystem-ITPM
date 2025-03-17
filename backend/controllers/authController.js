const User = require("../models/User");
const Cashier = require("../models/Cashier");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "your_jwt_secret_key"; 

// Register User (Admin & Supplier)
exports.register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword, role });
        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error registering user" });
    }
};

// Login User (Admin & Supplier)
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, { expiresIn: "1h" });
        res.json({ token, role: user.role });
    } catch (error) {
        res.status(500).json({ message: "Login error" });
    }
};

// Login Cashier
exports.loginCashier = async (req, res) => {
    try {
        const { cashierID, password } = req.body;
        const cashier = await Cashier.findOne({ cashierID });
        if (!cashier) return res.status(404).json({ message: "Cashier not found" });

        const isMatch = await bcrypt.compare(password, cashier.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: cashier._id }, SECRET_KEY, { expiresIn: "1h" });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: "Login error" });
    }
};
//register cashier
exports.registerCashier = async (req, res) => {
    try {
        const { cashierID, password } = req.body;

        // Check if cashier ID already exists
        const existingCashier = await Cashier.findOne({ cashierID });
        if (existingCashier) {
            return res.status(400).json({ message: "Cashier ID already exists" });
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save cashier
        const newCashier = new Cashier({ cashierID, password: hashedPassword });
        await newCashier.save();

        res.status(201).json({ message: "Cashier registered successfully" });
    } catch (error) {
        res.status(500).json({ error: "Server error: " + error.message });
    }
};