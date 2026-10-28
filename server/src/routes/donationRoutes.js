const express = require("express");

const router = express.Router();

const {
  respondToRequest,
  getRequestDonations,
} = require("../controllers/donationController");

router.post("/respond", respondToRequest);
router.get("/request/:bloodRequestId", getRequestDonations);

module.exports = router;
