const User = require("../models/User.js");
const Hospital = require("../models/Hospital");

/** Register User */
const register = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      phone,
      role,
      address,
      state,
      city,
      genotype,
      bloodGroup,
      gender,
      weight,
    } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Full name, email, and password are required",
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const user = await User.create({
      fullName,
      email,
      password,
      phone,
      address,
      state,
      city,
      genotype,
      bloodGroup,
      gender,
      weight,
    });

    res.status(201).json({
      success: true,
      message: "Registration successful",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/** Register Hospital */
const registerHospital = async (req, res) => {
  try {
    const { hospitalName, email, password, phone, address, state, city } =
      req.body;

    // Validate required fields
    if (
      !hospitalName?.trim() ||
      !email?.trim() ||
      !password ||
      !phone?.trim() ||
      !address?.trim() ||
      !state?.trim() ||
      !city?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all hospital registration fields",
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // Check if hospital email already exists
    const existingHospital = await Hospital.findOne({
      email: email.trim().toLowerCase(),
    });

    if (existingHospital) {
      return res.status(400).json({
        success: false,
        message: "Hospital email already exists",
      });
    }

    // Create hospital account
    const hospital = await Hospital.create({
      hospitalName,
      email,
      password,
      phone,
      address,
      state,
      city,
    });

    return res.status(201).json({
      success: true,
      message: "Hospital registration successful",
      hospital: {
        _id: hospital._id,
        hospitalName: hospital.hospitalName,
        email: hospital.email,
        phone: hospital.phone,
        address: hospital.address,
        state: hospital.state,
        city: hospital.city,
      },
    });
  } catch (error) {
    // Handle duplicate email errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Hospital email already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Login User
 */

const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Email or phone number and password are required",
      });
    }

    const loginInput = identifier.trim();

    // Check whether the input is an email or phone number
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginInput);

    const user = await User.findOne(
      isEmail ? { email: loginInput.toLowerCase() } : { phone: loginInput },
    ).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Compare the entered password with the stored password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Exclude password from the response
    const userData = user.toObject();
    delete userData.password;

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: userData,
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/** Login Hospital */
const loginHospital = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find hospital by email and include password
    const hospital = await Hospital.findOne({
      email: email.trim().toLowerCase(),
    }).select("+password");

    if (!hospital) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Compare passwords
    const isMatch = await hospital.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Return hospital details without password
    const hospitalData = hospital.toObject();
    delete hospitalData.password;

    return res.status(200).json({
      success: true,
      message: "Hospital login successful",
      hospital: hospitalData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Profile User
const updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const {
      fullName,
      phone,
      bloodGroup,
      genotype,
      state,
      city,
      weight,
      isAvailable,
    } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.fullName = fullName;
    user.phone = phone;
    user.bloodGroup = bloodGroup;
    user.genotype = genotype;
    user.state = state;
    user.city = city;
    user.weight = weight;
    user.isAvailable = isAvailable;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  updateProfile,
  registerHospital,
  loginHospital,
  getProfile,
};
