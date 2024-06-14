const catchAsyncError = require("../middlewares/catchAsyncError");
const {ErrorHandler} = require("../middlewares/error");
const appointmentModel = require("../models/appointmentSchema");
const userModel = require("../models/userSchema");

// Create a Appointment
const postAppointment = catchAsyncError(async(req, res, next) => {

    const {
        firstName, lastName, email, phone, uid, dob, gender, appointment_date, department, doctor_firstName, 
        doctor_lastName, hasVisited, address,
    } = req.body;

    if(!firstName || !lastName || !email || !phone || !uid || !dob || !gender || !appointment_date || 
        !department || !doctor_firstName || !doctor_lastName || !address)
    {
        return next(new ErrorHandler("Please Complete all the Details!", 400));
    }

    const isConflict = await userModel.find({
        firstName : doctor_firstName,
        lastName : doctor_lastName,
        role : "Doctor",
        doctorDepartment : department
    })
    if(isConflict.length === 0){
        return next(new ErrorHandler("Doctor not found!", 404));
    }
    if(isConflict.length > 1){
        return next(new ErrorHandler("Doctors Conflict ! Please Contact through Email or Phone!", 400));
    }

    const doctorId = isConflict[0]._id;
    const patientId = req.user._id;
    const appointment = await appointmentModel.create({
        firstName, lastName, email, phone, uid, dob, gender, appointment_date, department,  
        doctor : {
            firstName : doctor_firstName,
            lastName : doctor_lastName,
        },  
        hasVisited, address, doctorId, patientId,
    });
    res.status(200).json({
        success : true,
        message : "Appoiment Created Successfully.",
        appointment,
    });
});

// Get all Appointment Details
const getAllAppointments = catchAsyncError(async(req, res, next) => {

    const appointment = await appointmentModel.find();
    res.status(200).json({
        success : true,
        appointment,
    });

});

// Update Appointment Status
const updateAppointmentStatus = catchAsyncError(async(req, res, next) => {
    
    const {id} = req.params;
    // console.log(id);
    let appointment = await appointmentModel.findById(id);
    if(!appointment){
        return next(new ErrorHandler("Appointment Not Found !", 404));
    }
    appointment = await appointmentModel.findByIdAndUpdate(id, req.body, {
        new : true,
        runValidators : true,
        useFindAndModify : false,
    });
    res.status(200).json({
        success : true,
        message : "Appointment Status Updated Successfully.",
        appointment,
    })
});

// Delete Appointment
const deleteAppointment = catchAsyncError(async(req, res, next) => {

    const {id} = req.params;
    let appointment = await appointmentModel.findById(id);
    if(!appointment){
        return next(new ErrorHandler("Appointment Not Found !", 404));
    }
    await appointment.deleteOne();
    res.status(200).json({
        success : true,
        message : "Appointment Deleted Successfully.",
    });
    
});

const appointmentContainer = {
    postAppointment,
    getAllAppointments,
    updateAppointmentStatus,
    deleteAppointment,
}

module.exports = appointmentContainer;

