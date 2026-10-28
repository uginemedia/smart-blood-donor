const express = require("express");

const router = express.Router();

const { getNotifications } = require("../controllers/notificationController");

router.get("/user/:userId", getNotifications);

module.exports = router;
