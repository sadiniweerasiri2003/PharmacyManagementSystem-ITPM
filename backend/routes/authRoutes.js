const express = require("express");
const { register, login, loginCashier, registerCashier } = require("../controllers/authController");

const router = express.Router();

router.post("/register", register); // For system admins & suppliers
router.post("/login", login); // For system admins & suppliers
router.post("/login/cashier", loginCashier); // For cashiers
router.post("/register/cashier", registerCashier); //  Add this line for cashier registration

module.exports = router;
