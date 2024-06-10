const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
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
    nic : {
        type : String,
        required : true,
        minLength : [13, "NIC must contain exact 13 Digits !"],
        maxLength : [13, "NIC must contain exact 13 Digits !"],
    },
    dob : {
        type : Date,
        required : [true, "DOB is required"],
    },
    gender : {
        type : String,
        required : true,
        enum : ["Male", "Female"],
    },
    password : {
        type : String,
        required : true,
        minLength : [8, "Password Must Contain atlest 8 Character"],
        select : false,
    },
    role : {
        type : String,
        required : true,
        enum : ["Admin", "Patient", "Doctor"],
    },
    docterDepartment : {
        type : String,
    },
    docAvatar : {
        public_id : String,
        url : String,
    }
});

// Bcrypt & Salt & Save user
userSchema.pre("save", async function (next){
    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
};

// Add JWT Token
userSchema.methods.generateJsonWebToken = function(){
    return jwt.sign({id : this._id}, process.env.JWT_SECRET_KEY, {
        expiresIn : process.env.JWT_EXPIRES,
    });
};

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;