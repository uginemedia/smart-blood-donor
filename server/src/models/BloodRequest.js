const mongoose = require("mongoose");

const bloodRequestSchema = new mongoose.Schema(
  {
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    bloodGroup: {
      type: String,
      required: true,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },

    unitsNeeded: {
      type: Number,
      required: true,
    },

    urgency: {
      type: String,
      enum: ["Normal", "Urgent", "Critical"],
      default: "Normal",
    },

    bloodComponentType: {
      type: String,
      enum: [
        "Whole Blood",
        "Packed Red Blood Cells (PRBC)",
        "Platelets",
        "Fresh Frozen Plasma (FFP)",
      ],
      default: "Whole Blood",
    },

    specialProcessingNeeds: {
      type: [String],
      enum: ["Irradiated", "Leukoreduced", "CMV Negative"],
      default: [],
    },

    state: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    hospitalName: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Matched", "Completed", "Closed"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("BloodRequest", bloodRequestSchema);
