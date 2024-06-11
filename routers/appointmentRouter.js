const express = require("express");

const {postAppointment, getAllAppointments, updateAppointmentStatus, deleteAppointment} = require("../controllers/appointmentController");
const {isAdminAuthenticated, isPatientAuthenticated} = require("../middlewares/auth")

const router = express.Router();

router.post("/post", isPatientAuthenticated, postAppointment);
router.get("/getall", isAdminAuthenticated, getAllAppointments);
router.put("/update/:id", isAdminAuthenticated, updateAppointmentStatus);
router.delete("/delete/:id", isAdminAuthenticated, deleteAppointment);

module.exports = router;