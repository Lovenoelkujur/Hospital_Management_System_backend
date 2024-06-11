const express = require("express");

const {
    patientRegistration, 
    login, 
    addNewAdmin, 
    getAllDoctor, 
    getUserDetails, 
    logoutAdmin, 
    logoutPatient, 
    addNewDoctor
} = require("../controllers/userController");
const {isAdminAuthenticated, isPatientAuthenticated} = require("../middlewares/auth");

const router = express.Router();

// User Registration
router.post("/patient/register", patientRegistration);

// User Login
router.post("/login", login);

// Admin Registration
router.post("/admin/addnew", isAdminAuthenticated, addNewAdmin);

// Get Doctors Details
router.get("/doctors", getAllDoctor);

// Get Admin Details
router.get("/admin/me", isAdminAuthenticated, getUserDetails);

// Get Patient Details
router.get("/patient/me", isPatientAuthenticated, getUserDetails);

// Get Admin Logout
router.get("/admin/logout", isAdminAuthenticated, logoutAdmin);

// Get Patient Logout
router.get("/patient/logout", isPatientAuthenticated, logoutPatient);

// Add New Doctor
router.post("/doctor/addnew", isAdminAuthenticated, addNewDoctor);

module.exports = router;