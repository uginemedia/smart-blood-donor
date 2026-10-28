const Donation = require("../models/Donation");

// Donor responds to a blood request
const respondToRequest = async (req, res) => {
  try {
    const { donor, bloodRequest, status } = req.body;

    let donation = await Donation.findOne({
      donor,
      bloodRequest,
    });

    if (donation) {
      donation.status = status;
      await donation.save();
    } else {
      donation = await Donation.create({
        donor,
        bloodRequest,
        status,
      });

      res.status(201).json({
        success: true,
        message: "Response submitted successfully.",
        donation,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getRequestDonations = async (req, res) => {
  try {
    const { bloodRequestId } = req.params;

    const donations = await Donation.find({
      bloodRequest: bloodRequestId,
    })
      .populate("donor", "fullName email phone bloodGroup state city")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: donations.length,
      donations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  respondToRequest,
  getRequestDonations,
};
