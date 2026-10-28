const express = require("express");
const {
  register,
  registerHospital,
  login,
  loginHospital,
  updateProfile,
  getProfile,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);

router.post("/hospital-register", registerHospital);

router.post("/login", login);
router.post("/hospital-login", loginHospital);
router.put("/profile/:userId", updateProfile);
router.get("/profile/:id", getProfile);

module.exports = router;
