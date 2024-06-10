const express = require("express");
const {patientRegistration, login} = require("../controllers/userController");

const router = express.Router();

// Registration
router.post("/patient/register", patientRegistration);

// Login
router.post("/login", login);

module.exports = router;