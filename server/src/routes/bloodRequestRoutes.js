const express = require("express");

const router = express.Router();

const {
  createBloodRequest,
  findMatchingDonors,
  getHospitalRequests,
  getBloodRequest,
  closeBloodRequest,
} = require("../controllers/bloodRequestController");

// Create a new blood request
router.post("/", createBloodRequest);

// Find matching donors
router.get("/:requestId/match", findMatchingDonors);

// Get all requests created by a hospital
router.get("/hospital/:hospitalId", getHospitalRequests);

// Close a blood request
router.patch("/:requestId/close", closeBloodRequest);

// Get a single blood request
router.get("/:id", getBloodRequest);

module.exports = router;
