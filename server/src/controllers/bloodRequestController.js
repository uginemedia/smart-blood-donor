const BloodRequest = require("../models/BloodRequest");
const User = require("../models/User");
const Notification = require("../models/Notification");

// Create a new blood request

const createBloodRequest = async (req, res) => {
  try {
    // 1. Create the blood request
    const bloodRequest = await BloodRequest.create({
      ...req.body,
      status: req.body.status || "Pending",
    });
    // 2. Find matching donors
    const donors = await User.find({
      role: "donor",
      bloodGroup: bloodRequest.bloodGroup,
      state: bloodRequest.state,
      isAvailable: true,
    }).select("-password");

    // 3. Create ONE notification for all users
    const notification = await Notification.create({
      recipient: null,
      sender: bloodRequest.hospital,
      bloodRequest: bloodRequest._id,
      title: "Emergency Blood Request",
      message: `${bloodRequest.unitsNeeded} unit(s) of ${bloodRequest.bloodGroup} blood is needed in ${bloodRequest.city}, ${bloodRequest.state}. All users can view this request.`,
      type: "blood_request",
    });

    // 4. Return the result
    return res.status(201).json({
      success: true,
      message: "Blood request created and notification published successfully.",
      totalMatches: donors.length,
      bloodRequest,
      notification,
      matchedDonors: donors,
    });
  } catch (error) {
    console.error("Create Blood Request Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Find Matching Donors
const findMatchingDonors = async (req, res) => {
  try {
    const { requestId } = req.params;

    // 1. Find the blood request
    const request = await BloodRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Blood request not found.",
      });
    }

    // 2. Search for donors in the same city
    let donors = await User.find({
      role: "donor",
      bloodGroup: request.bloodGroup,
      state: request.state,
      city: request.city,
      isAvailable: true,
    })
      .select("-password")
      .sort({ createdAt: -1 });

    // 3. If no city matches, search the same state
    if (donors.length === 0) {
      donors = await User.find({
        role: "donor",
        bloodGroup: request.bloodGroup,
        state: request.state,
        isAvailable: true,
      })
        .select("-password")
        .sort({ createdAt: -1 });
    }

    // 4. Return matching donors
    res.status(200).json({
      success: true,
      totalMatches: donors.length,
      donors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Hopsital Requests
const getHospitalRequests = async (req, res) => {
  try {
    const { hospitalId } = req.params;

    const requests = await BloodRequest.find({
      hospital: hospitalId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: requests.length,
      requests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Close a blood request created by a hospital
const closeBloodRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { hospitalId } = req.body;

    if (!hospitalId) {
      return res.status(400).json({
        success: false,
        message: "Hospital ID is required.",
      });
    }

    const request = await BloodRequest.findOne({
      _id: requestId,
      hospital: hospitalId,
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Blood request not found for this hospital.",
      });
    }

    if (request.status === "Closed") {
      return res.status(400).json({
        success: false,
        message: "This blood request is already closed.",
      });
    }

    request.status = "Closed";
    await request.save();

    return res.status(200).json({
      success: true,
      message: "Blood request closed successfully.",
      request,
    });
  } catch (error) {
    console.error("Close Blood Request Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Blood Requests
const getBloodRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await BloodRequest.findById(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Blood request not found.",
      });
    }

    res.status(200).json({
      success: true,
      request,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createBloodRequest,
  findMatchingDonors,
  getHospitalRequests,
  getBloodRequest,
  closeBloodRequest,
};
