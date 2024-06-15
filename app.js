const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

const dbConnection = require("./database/dbConnection");
const messageRouter = require("./routers/messageRouter");
const {errorMiddleware} = require("./middlewares/error");
const userRouter = require("./routers/userRouter");
const appointmentRouter = require("./routers/appointmentRouter");

const app = express();

dotenv.config({
    path : "./config/config.env"
});

// Link Frontend
app.use(
    cors({
        origin : [process.env.FRONTEND_URL, process.env.DASHBOARD_URL],
        methods : ["GET", "POST", "PUT", "DELETE"],
        credentials : true,
    })
);

// const whitelist = [process.env.FRONTEND_URL, process.env.DASHBOARD_URL]
// const corsOptions = {
//   origin : function (origin, callback) {
//     // if (whitelist.indexOf(origin) !== -1) {
//     //   callback(null, true)
//     // } else {
//     //   callback(new Error('Not allowed by CORS'))
//     // }
//     if (whitelist.indexOf(req.header('Origin')) !== -1) {
//         corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
//       } else {
//         corsOptions = { origin: false } // disable CORS for this request
//       }
//   },
//   methods : ["GET", "POST", "PUT", "DELETE"],
// //   credentials : true,
// }

// app.use(cors(corsOptions));

app.use(cookieParser());    // To pass Cookie
app.use(express.json());    // To pass json data
app.use(express.urlencoded({extended : true}));     // get urlencoded data

// Upload File
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : "/tmp",
}));

// Route
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/appointment", appointmentRouter);

dbConnection();

app.use(errorMiddleware);

module.exports = app;