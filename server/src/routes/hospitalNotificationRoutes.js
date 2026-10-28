const express = require("express");
const router = express.Router();

const {
  getHospitalNotifications,
  markHospitalNotificationAsRead,
  markAllHospitalNotificationsAsRead,
} = require("../controllers/hospitalNotificationController");

// Get all notifications for a hospital
router.get("/hospital/:hospitalId", getHospitalNotifications);

// Mark all notifications as read
router.patch(
  "/hospital/:hospitalId/read-all",
  markAllHospitalNotificationsAsRead,
);

// Mark one notification as read
router.patch("/:notificationId/read", markHospitalNotificationAsRead);

module.exports = router;
