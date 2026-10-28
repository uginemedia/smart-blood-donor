const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    bloodRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BloodRequest",
    },

    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: [
        "blood_request",
        "general",
        "donor_response",
        "request_update",
        "account_update",
      ],
      default: "general",
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Notification", notificationSchema);

// const mongoose = require("mongoose");

// const notificationSchema = new mongoose.Schema(
//   {
//     recipient: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     sender: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//     },

//     bloodRequest: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "BloodRequest",
//     },

//     title: {
//       type: String,
//       required: true,
//     },

//     message: {
//       type: String,
//       required: true,
//     },

//     type: {
//       type: String,
//       enum: ["blood_request", "general"],
//       default: "blood_request",
//     },

//     isRead: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   {
//     timestamps: true,
//   },
// );

// module.exports = mongoose.model("Notification", notificationSchema);
