const catchAsyncErrors = require("../middlewares/catchAsyncError");
const {ErrorHandler} = require("../middlewares/error");
const userModel = require("../models/userSchema");

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

    res.status(200).json({
        success : true,
        message : "User Registered Successfully.",
    })
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

    res.status(200).json({
        success : true,
        message : "User Logged in Successfully.",
    })

});

const authContainer = {
    patientRegistration,
    login,
}

module.exports = authContainer;
