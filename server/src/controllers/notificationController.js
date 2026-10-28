const Notification = require("../models/Notification");

// Get all notifications for all users
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .populate("sender", "fullName hospitalName")
      .populate("bloodRequest")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      total: notifications.length,
      notifications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getNotifications,
};
