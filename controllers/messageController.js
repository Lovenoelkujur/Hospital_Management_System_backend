const catchAsyncError = require("../middlewares/catchAsyncError");
const messageModel = require("../models/messageSchema");
const {ErrorHandler} = require("../middlewares/error");

const sendMessage = catchAsyncError(async (req, res, next) => {

    const {firstName, lastName, email, phone, message} = req.body;
    
    if(!firstName || !lastName || !email || !phone || !message){
        return next(new ErrorHandler("Please Complete all the Field", 400));
    }
    
    await messageModel.create({firstName, lastName, email, phone, message});
    res.status(200).json({
        success : true,
        message : "Message Sent Successfully."
    });

})

module.exports = sendMessage;