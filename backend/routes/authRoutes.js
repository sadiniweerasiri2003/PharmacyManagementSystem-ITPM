const express = require("express");
const { register, login, loginCashier, registerCashier } = require("../controllers/authController");

const router = express.Router();

// Admin & Supplier Auth
router.post("/register", register);
router.post("/login", login);

// Cashier Auth
router.post("/login/cashier", loginCashier);
router.post("/register/cashier", registerCashier);

module.exports = router;
