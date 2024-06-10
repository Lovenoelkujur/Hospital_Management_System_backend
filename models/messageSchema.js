const mongoose = require("mongoose");
const validator = require("validator");

const messageSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
        minLength : [3, "First Name Must Contain At Least 3 Characters !"],
    },
    lastName : {
        type : String,
        required : true,
        minLength : [3, "First Name Must Contain At Least 3 Characters !"],
    },
    email : {
        type : String,
        required : true,
        validate : [validator.isEmail, "Please Provid a Valid Email !"],
    },
    phone : {
        type : String,
        required : true,
        minLength : [11, "Phone Number must contain exact 11 Digits !"],
        maxLength : [11, "Phone Number must contain exact 11 Digits !"],
    },
    message : {
        type : String,
        required : true,
        minLength : [10, "Message must contain atleast 10 Characters !"],
    },
});

const messageModel = mongoose.model("message", messageSchema);

module.exports = messageModel;