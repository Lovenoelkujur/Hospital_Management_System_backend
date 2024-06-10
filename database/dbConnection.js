const mongoose = require("mongoose");

const dbConnection = () => {
    mongoose.connect(process.env.MONGO_URL, {
        dbName : "HOSPITAL_MANAGEMENT_SYSTEM"
    })
    .then(() => {
        console.log("DB Connection Successfull.");
    })
    .catch(error => {
        console.log(`Some Error Occured while connecting to database : ${error}`);
    })
}

module.exports = dbConnection;