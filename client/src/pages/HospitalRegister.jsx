import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

import "../styles/Register.css";
import api from "../services/api";

const HospitalRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    hospitalName: "",
    email: "",
    password: "",
    phone: "",
    role: "hospital",
    address: "",
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
      !formData.hospitalName.trim() ||
      !formData.email.trim() ||
      !formData.password ||
      !formData.phone.trim() ||
      !formData.address.trim() ||
      !formData.state.trim() ||
      !formData.city.trim()
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/hospital-register", formData);

      if (response.data.success) {
        toast.success("Hospital registration successful!");
        navigate("/hospital-login");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Hospital registration failed. Please try again.",
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
            <span className="visual-label">JOIN OUR HEALTHCARE NETWORK</span>

            <h1>
              Better matching.
              <br />
              <span>Faster response.</span>
            </h1>

            <p>
              Connect your hospital to our smart blood donor network. Create
              requests and notify matching donors when blood is needed.
            </p>

            <div className="register-benefits">
              <div className="register-benefit">
                <div className="benefit-icon">♥</div>
                <div>
                  <strong>Find Matching Donors</strong>
                  <p>Identify donors using blood group and location.</p>
                </div>
              </div>

              <div className="register-benefit">
                <div className="benefit-icon">✓</div>
                <div>
                  <strong>Manage Requests</strong>
                  <p>Keep track of the blood requests your hospital creates.</p>
                </div>
              </div>

              <div className="register-benefit">
                <div className="benefit-icon">!</div>
                <div>
                  <strong>Emergency Notifications</strong>
                  <p>Notify matching donors about urgent blood needs.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="register-visual-footer">
            <span>Blood Connect</span>
            <span>•</span>
            <span>Supporting hospitals and saving lives</span>
          </div>
        </div>

        {/* HOSPITAL REGISTRATION FORM */}
        <div className="register-form-area">
          <div className="register-form-card">
            <div className="register-form-header">
              <span className="mobile-brand">BLOOD CONNECT</span>

              <h2>Register your hospital</h2>

              <p>
                Create a hospital account to submit blood requests and connect
                with matching donors. All fields are required.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* HOSPITAL DETAILS */}
              <div className="register-section">
                <div className="register-section-heading">
                  <span>01</span>
                  <div>
                    <h3>Hospital Information</h3>
                    <p>Enter your hospital's account and location details.</p>
                  </div>
                </div>

                <div className="register-form-grid">
                  <div className="form-group full-width">
                    <label>
                      Hospital Name <span>*</span>
                    </label>
                    <input
                      type="text"
                      name="hospitalName"
                      placeholder="Enter hospital name"
                      value={formData.hospitalName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Hospital Email <span>*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter hospital email"
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

                  <div className="form-group full-width">
                    <label>
                      Hospital Address <span>*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      placeholder="Enter hospital address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      State <span>*</span>
                    </label>
                    <input
                      type="text"
                      name="state"
                      placeholder="Enter state"
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
                      placeholder="Enter city"
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
                      Register Hospital
                      <span>→</span>
                    </>
                  )}
                </button>

                <p>Please ensure your hospital information is accurate.</p>
              </div>
            </form>

            <div className="auth-footer">
              Already have an account? <Link to="/hospital-login">Login</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalRegister;
