const cloudinary = require("cloudinary");

const catchAsyncErrors = require("../middlewares/catchAsyncError");
const {ErrorHandler} = require("../middlewares/error");
const userModel = require("../models/userSchema");
const generateToken = require("../utils/jwtToken");

// Registration
const patientRegistration = catchAsyncErrors(async(req, res, next) => {
    // console.log(req.body);
    const {firstName, lastName, email, phone, uid, dob, gender, password, role} = req.body;
    
    if(!firstName || !lastName || !email || !phone || !uid || !dob || !gender || !password || !role){
        return next(new ErrorHandler("Please Complete all the Details", 400));
    }

    let user = await userModel.findOne({email});
    if(user){
        return next(new ErrorHandler("User Already Registered !", 400));
    }
    user = await userModel.create({
        firstName, lastName, email, phone, uid, dob, gender, password, role,
    });

    generateToken(user, "User Registered Successfully.", 200, res);

});

// Login
const login = catchAsyncErrors(async(req, res, next) => { 
    // console.log(req.body);

    const {email, password, confirmPassword, role} = req.body;

    if(!email || !password || !confirmPassword || !role){
        return next(new ErrorHandler("Please provide all details !", 400));
    }
    if(password !== confirmPassword){
        return next(new ErrorHandler("Password and confirm password do not match !", 400));
    }

    const user = await userModel.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("Invalid Email or Password !", 400));
    }
    
    const isPasswordMatched = await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid Email or Password !", 400));
    }
    if(role !== user.role){
        return next(new ErrorHandler("User with this role not found !", 400));
    }

    generateToken(user, "User Logged in Successfully.", 200, res);

});

// Admin Registration
const addNewAdmin = catchAsyncErrors(async(req, res, next) => {

    const {firstName, lastName, email, phone, uid, dob, gender, password, role} = req.body;

    if(!firstName || !lastName || !email || !phone || !uid || !dob || !gender || !password){
        return next(new ErrorHandler("Please Complete all the Details", 400));
    }

    const isRegistered = await userModel.findOne({email});
    if(isRegistered){
        return next(new ErrorHandler(`${isRegistered.role} with this Email already exists !`));
    }

    const admin = await userModel.create({
        firstName, lastName, email, phone, uid, dob, gender, password, role : "Admin"
    });
    res.status(200).json({
        success : true,
        message : "New Admin Register Successfully.",
    });
});

// Get Doctors Details
const getAllDoctor = catchAsyncErrors(async(req, res, next) => {

    const doctor = await userModel.find({role : "Doctor"});
    res.status(200).json({
        success : true,
        doctor,
    })
});

// Get User Details
const getUserDetails = catchAsyncErrors(async(req, res, next) => {

    const user = req.user;
    res.status(200).json({
        success : true,
        user,
    });
});

// Logout Admin
const logoutAdmin = catchAsyncErrors(async(req, res, next) => {
    res
        .status(200)
        .cookie("adminToken", "", {
            httpOnly : true,
            expires : new Date(Date.now()),
        })
        .json({
            success : true,
            message : "Admin Logged Out Successfully.",
    });
});

// Logout Patient
const logoutPatient = catchAsyncErrors(async(req, res, next) => {
    res
        .status(200)
        .cookie("patientToken", "", {
            httpOnly : true,
            expires : new Date(Date.now()),
        })
        .json({
            success : true,
            message : "Patient Logged Out Successfully.",
    });
});

// Add New Doctor
const addNewDoctor = catchAsyncErrors(async(req, res, next) => {

    if(!req.files || Object.keys(req.files).length === 0){
        return next(new ErrorHandler("Doctor Avatar Required !", 400));
    }

    const {docAvatar} = req.files;
    const allowedFormats = ["image/png", "image/jpeg", "image/webp", "image/avif"]; // File format to add
    if(!allowedFormats.includes(docAvatar.mimetype)){
        return next(new ErrorHandler("File Format Not Supported !", 400));
    }

    const {firstName, lastName, email, phone, uid, dob, gender, password, docterDepartment} = req.body;

    if(!firstName || !lastName || !email || !phone || !uid || !dob || !gender || !password || !docterDepartment){
        return next(new ErrorHandler("Please Complete all the Details !", 400));
    }

    const isRegistered = await userModel.findOne({email});
    if(isRegistered){
        return next(new ErrorHandler(`${isRegistered.role} already registered with this email !`, 400));
    }

    // Upload Avator in Cloud
    const cloudinaryResponse = await cloudinary.uploader.upload(
        docAvatar.tempFilePath
    );

    if(!cloudinaryResponse || cloudinaryResponse.error){
        console.error(
            "Cloudinary Error : ",
            cloudinaryResponse.error || "unknown Cloudinary Error"
        );
    }

    const doctor = await userModel.create({
        firstName, lastName, email, phone, uid, dob, gender, password, role : "Doctor",  docterDepartment, 
        docAvatar : {
            public_id : cloudinaryResponse.public_id, 
            url : cloudinaryResponse.secure_url,
        }
    });
    res.status(200).json({
        success : true,
        message : "New Doctor Registration Successfully!",
        doctor,
    })
});


// Container to export funtions
const userContainer = {
    patientRegistration,
    login,
    addNewAdmin,
    getAllDoctor,
    getUserDetails,
    logoutAdmin,
    logoutPatient,
    addNewDoctor,
}

module.exports = userContainer;