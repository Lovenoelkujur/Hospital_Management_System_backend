const catchAsyncErrors = require("../middlewares/catchAsyncError");
const {ErrorHandler} = require("../middlewares/error");
const userModel = require("../models/userSchema");

const patientRegistration = catchAsyncErrors(async(req, res, next) => {
    // console.log(req.body);
    const {firstName, lastName, email, phone, nic, dob, gender, password, role} = req.body;

    if(!firstName || !lastName || !email || !phone || !nic || !dob || !gender || !password || !role){
        return next(new ErrorHandler("Please Complete all the Details", 400));
    }

    let user = await userModel.findOne({email});
    if(user){
        return next(new ErrorHandler("User Already Registered !", 400));
    }
    user = await userModel.create({
        firstName, lastName, email, phone, nic, dob, gender, password, role,
    });

    res.status(200).json({
        success : true,
        message : "User Registered Successfully.",
    })
});

module.exports = patientRegistration;
