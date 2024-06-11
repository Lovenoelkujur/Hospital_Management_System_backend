const express = require("express");
const {patientRegistration, login, addNewAdmin} = require("../controllers/userController");
const {isAdminAuthenticated, isPatientAuthenticated} = require("../middlewares/auth");

const router = express.Router();

// User Registration
router.post("/patient/register", patientRegistration);

// User Login
router.post("/login", login);

// Admin Registration
router.post("/admin/addnew", isAdminAuthenticated, addNewAdmin);

module.exports = router;