const express = require("express");
const patientRegistration = require("../controllers/userController");

const router = express.Router();

router.post("/patient/register", patientRegistration);

module.exports = router;