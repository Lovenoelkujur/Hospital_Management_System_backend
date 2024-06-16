const jwt = require("jsonwebtoken");

const catchAsyncError = require("./catchAsyncError");
const { ErrorHandler } = require("./error");
const userModel = require("../models/userSchema");

// Admin Authentication
const isAdminAuthenticated = catchAsyncError(async(req, res, next) => {

    const token = req.cookies.adminToken;
    if(!token){
        return next(new ErrorHandler("Admin Not Authenticated", 400));
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await userModel.findById(decode.id);
    if(req.user.role !== "Admin"){
        return next(new ErrorHandler(`${req.user.role} Not Authorized for this Resourse !`, 403));
    }
    next();
});

// Patient Authentication
const isPatientAuthenticated = catchAsyncError(async(req, res, next) => {
    
    const token = req.cookies.patientToken;
    if(!token){
        return next(new ErrorHandler("Patient Not Authenticated", 400));
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await userModel.findById(decode.id);
    if(req.user.role !== "Patient"){
        return next(new ErrorHandler(`${req.user.role} Not Authorized for this Resourse !`, 403));
    }
    next();
});

// Is Authorized
const isAuthorized = (...roles) => {
    return(req, res, next) => {
        if(!roles.includes(req.user.role)){
            return next(
                new ErrorHandler(
                    `${req.user.role} not allowed to access this resource!`
                )
            )
        }
        next();
    }
}

// Container of function to export
const authContainer = {
    isAdminAuthenticated,
    isPatientAuthenticated,
    isAuthorized,
}

module.exports = authContainer;