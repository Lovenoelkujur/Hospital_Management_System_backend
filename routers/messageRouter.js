const express = require("express");

const {sendMessage, getAllMessages} = require("../controllers/messageController");
const {isAdminAuthenticated} = require("../middlewares/auth")

const router = express.Router();

// Message Send
router.post("/send", sendMessage);

// Get All Message
router.get("/getall", isAdminAuthenticated, getAllMessages);

module.exports = router;