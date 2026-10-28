import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

import "../styles/Register.css";
import api from "../services/api";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    role: "donor",
    bloodGroup: "",
    genotype: "",
    gender: "",
    address: "",
    weight: "",
    state: "",
    city: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.password ||
      !formData.phone.trim() ||
      !formData.bloodGroup ||
      !formData.state.trim() ||
      !formData.city.trim() ||
      !formData.genotype.trim() ||
      !formData.bloodGroup.trim() ||
      !formData.gender.trim() ||
      !formData.weight.trim()
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/register", formData);

      if (response.data.success) {
        toast.success("Donor registration successful!");
        navigate("/login");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-wrapper">
        {/* LEFT BRANDING PANEL */}
        <div className="register-visual">
          <div className="register-brand">
            <div className="brand-symbol">+</div>
            <div>
              <strong>Blood Connect</strong>
              <span>Smart Blood Donation</span>
            </div>
          </div>

          <div className="register-visual-content">
            <span className="visual-label">BECOME A BLOOD DONOR</span>

            <h1>
              Your donation.
              <br />
              <span>Someone's hope.</span>
            </h1>

            <p>
              Join our donor network and help connect patients with compatible
              blood donors when they need help most.
            </p>

            <div className="register-benefits">
              <div className="register-benefit">
                <div className="benefit-icon">♥</div>
                <div>
                  <strong>Save Lives</strong>
                  <p>Your donation can help someone in an emergency.</p>
                </div>
              </div>

              <div className="register-benefit">
                <div className="benefit-icon">✓</div>
                <div>
                  <strong>Smart Matching</strong>
                  <p>Get matched using your blood group and location.</p>
                </div>
              </div>

              <div className="register-benefit">
                <div className="benefit-icon">!</div>
                <div>
                  <strong>Emergency Alerts</strong>
                  <p>Receive notifications when matching blood is needed.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="register-visual-footer">
            <span>Blood Connect</span>
            <span>•</span>
            <span>Every donor makes a difference</span>
          </div>
        </div>

        {/* DONOR REGISTRATION FORM */}
        <div className="register-form-area">
          <div className="register-form-card">
            <div className="register-form-header">
              <span className="mobile-brand">BLOOD CONNECT</span>

              <h2>Create your donor account</h2>

              <p>
                Enter your details to join our blood donation network. Fields
                marked * are required.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* BASIC INFORMATION */}
              <div className="register-section">
                <div className="register-section-heading">
                  <span>01</span>
                  <div>
                    <h3>Basic Information</h3>
                    <p>Your personal and contact details.</p>
                  </div>
                </div>

                <div className="register-form-grid">
                  <div className="form-group full-width">
                    <label>
                      Full Name <span>*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Email <span>*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Phone Number <span>*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Enter phone number"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>
                      Password <span>*</span>
                    </label>
                    <input
                      type="password"
                      name="password"
                      placeholder="Create a password (minimum 6 characters)"
                      value={formData.password}
                      onChange={handleChange}
                      minLength={6}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* DONOR INFORMATION */}
              <div className="register-section">
                <div className="register-section-heading">
                  <span>02</span>
                  <div>
                    <h3>Donor Information</h3>
                    <p>Help us find suitable blood matches for you.</p>
                  </div>
                </div>

                <div className="register-form-grid">
                  <div className="form-group">
                    <label>
                      Blood Group <span>*</span>
                    </label>
                    <select
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select blood group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Genotype</label>
                    <select
                      name="genotype"
                      value={formData.genotype}
                      onChange={handleChange}
                    >
                      <option value="">Select genotype</option>
                      <option value="AA">AA</option>
                      <option value="AS">AS</option>
                      <option value="SS">SS</option>
                      <option value="AC">AC</option>
                      <option value="SC">SC</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Weight (kg)</label>
                    <input
                      type="number"
                      name="weight"
                      placeholder="e.g. 70"
                      min="1"
                      value={formData.weight}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Residential Address</label>
                    <input
                      type="text"
                      name="address"
                      placeholder="Enter your residential address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      State <span>*</span>
                    </label>
                    <input
                      type="text"
                      name="state"
                      placeholder="Enter your state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      City <span>*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      placeholder="Enter your city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* SUBMIT */}
              <div className="register-submit">
                <button
                  type="submit"
                  disabled={loading}
                  className="register-button"
                >
                  {loading ? (
                    <>
                      <span className="register-spinner"></span>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Donor Account
                      <span>→</span>
                    </>
                  )}
                </button>

                <p>
                  Please provide accurate information to help hospitals find
                  suitable donors.
                </p>
              </div>
            </form>

            <div className="auth-footer">
              Already have an account? <Link to="/login">Login</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
