import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

import "../styles/Profile.css";

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    bloodGroup: "",
    genotype: "",
    state: "",
    city: "",
    weight: "",
    isAvailable: true,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        bloodGroup: user.bloodGroup || "",
        genotype: user.genotype || "",
        state: user.state || "",
        city: user.city || "",
        weight: user.weight || "",
        isAvailable: user.isAvailable ?? true,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await api.put(`/auth/profile/${user._id}`, formData);

      if (response.data.success) {
        updateUser(response.data.user);
        toast.success("Profile updated successfully.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-wrapper">
          <div className="profile-message-card">
            <div className="profile-message-icon">🔒</div>
            <span className="profile-eyebrow">LIFELINK ACCOUNT</span>
            <h1>Login Required</h1>
            <p>Please log in to access and manage your donor profile.</p>
            <Link to="/login" className="profile-primary-button">
              Go to Login <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const completionFields = [
    formData.fullName,
    formData.email,
    formData.phone,
    formData.bloodGroup,
    formData.genotype,
    formData.state,
    formData.city,
    formData.weight,
  ];

  const completedFields = completionFields.filter(
    (field) => field !== "" && field !== null && field !== undefined,
  ).length;

  const completion = Math.round(
    (completedFields / completionFields.length) * 100,
  );

  const locationText = [formData.city, formData.state]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="profile-page">
      <div className="profile-wrapper">
        {/* Navigation */}
        <nav className="profile-navigation">
          <Link to="/" className="profile-brand">
            <span className="profile-brand-mark">✚</span>
            <span>
              <strong>LifeLink</strong>
              <small>DONOR COMMUNITY</small>
            </span>
          </Link>

          <Link to="/dashboard" className="profile-back-link">
            <span>←</span>
            Back to Dashboard
          </Link>
        </nav>

        {/* Profile Hero */}
        <section className="profile-hero">
          <div className="profile-hero-copy">
            <span className="profile-eyebrow">YOUR ACCOUNT</span>

            <h1>My Profile</h1>

            <p>
              Keep your information accurate and up to date so LifeLink can help
              connect you with relevant blood requests when you are needed.
            </p>

            <div className="profile-hero-tags">
              <span className="profile-tag">
                <span className="profile-tag-dot" />
                {user.role === "donor" ? "Blood Donor" : user.role}
              </span>

              <span
                className={`profile-tag ${
                  user.isVerified ? "verified-tag" : "pending-tag"
                }`}
              >
                {user.isVerified
                  ? "✓ Verified Account"
                  : "◷ Verification Pending"}
              </span>
            </div>
          </div>

          <div className="profile-hero-avatar">
            {user.avatar ? (
              <img src={user.avatar} alt="Profile avatar" />
            ) : (
              user.fullName?.charAt(0).toUpperCase() || "U"
            )}

            <span className="profile-avatar-decoration">✚</span>
          </div>
        </section>

        {/* Summary Cards */}
        <section className="profile-summary-grid">
          <div className="profile-summary-card">
            <div className="profile-summary-icon">🩸</div>
            <div>
              <small>Blood Group</small>
              <strong>{formData.bloodGroup || "Not set"}</strong>
              <span>Your donor blood type</span>
            </div>
          </div>

          <div className="profile-summary-card">
            <div className="profile-summary-icon completion-icon">✓</div>
            <div>
              <small>Profile Completion</small>
              <strong>{completion}%</strong>
              <span>Keep your information complete</span>
            </div>
          </div>

          <div className="profile-summary-card">
            <div className="profile-summary-icon location-summary-icon">⌖</div>
            <div>
              <small>Your Location</small>
              <strong>{locationText || "Not set"}</strong>
              <span>Used for local donor matching</span>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="profile-content-grid">
          <aside className="profile-sidebar">
            {/* Profile Completion */}
            <section className="profile-sidebar-card">
              <div className="profile-sidebar-heading">
                <h2>Profile Strength</h2>
                <span>{completion}%</span>
              </div>

              <div
                className="profile-completion-track"
                role="progressbar"
                aria-label="Profile completion"
                aria-valuenow={completion}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="profile-completion-fill"
                  style={{ width: `${completion}%` }}
                />
              </div>

              <p>
                A complete profile helps hospitals identify suitable donors and
                contact you when blood is needed.
              </p>

              <ul className="profile-checklist">
                {[
                  ["Personal details", formData.fullName && formData.phone],
                  ["Blood group", formData.bloodGroup],
                  ["Genotype", formData.genotype],
                  ["Location", formData.state && formData.city],
                  ["Weight", formData.weight],
                ].map(([label, complete]) => (
                  <li key={label} className={complete ? "check-complete" : ""}>
                    <span>{complete ? "✓" : "○"}</span>
                    {label}
                  </li>
                ))}
              </ul>
            </section>

            {/* Availability */}
            <section className="profile-availability-card">
              <div className="availability-card-heading">
                <div className="availability-heart">♥</div>

                <span
                  className={`availability-indicator ${
                    formData.isAvailable ? "indicator-on" : "indicator-off"
                  }`}
                />
              </div>

              <span className="profile-eyebrow">DONOR STATUS</span>

              <h2>
                {formData.isAvailable ? "Ready to Help" : "Taking a Break"}
              </h2>

              <p>
                {formData.isAvailable
                  ? "Your profile indicates that you are available for blood donation."
                  : "You are currently marked as unavailable for blood donation."}
              </p>

              <label className="profile-availability-switch">
                <span>Available to donate</span>

                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleChange}
                />

                <span className="profile-switch-track">
                  <span className="profile-switch-thumb" />
                </span>
              </label>

              <small className="availability-saving-text">
                Remember to save your changes below to update your profile.
              </small>
            </section>

            {/* Tip */}
            <section className="profile-tip-card">
              <div className="profile-tip-icon">✦</div>
              <div>
                <h3>A little reminder</h3>
                <p>
                  Keep your phone number and location current so hospitals can
                  reach you when you may be able to help.
                </p>
              </div>
            </section>
          </aside>

          {/* Profile Form */}
          <main className="profile-form-card">
            <div className="profile-form-card-header">
              <div>
                <span className="profile-eyebrow">ACCOUNT SETTINGS</span>
                <h2>Personal Information</h2>
                <p>Review and update the details connected to your account.</p>
              </div>

              <div className="profile-form-header-icon">♙</div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Basic Information */}
              <section className="profile-form-section">
                <div className="profile-section-heading">
                  <span>01</span>
                  <div>
                    <h3>Basic Information</h3>
                    <p>Your personal account and contact details</p>
                  </div>
                </div>

                <div className="profile-fields-grid">
                  <div className="profile-field profile-field-full">
                    <label htmlFor="fullName">Full Name</label>
                    <input
                      id="fullName"
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="profile-field profile-field-full">
                    <label htmlFor="email">Email Address</label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                    />
                    <small>
                      Your email address cannot be changed from this page.
                    </small>
                  </div>

                  <div className="profile-field profile-field-full">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
              </section>

              {/* Medical Information */}
              <section className="profile-form-section">
                <div className="profile-section-heading">
                  <span>02</span>
                  <div>
                    <h3>Medical Information</h3>
                    <p>Important details for donor matching</p>
                  </div>
                </div>

                <div className="profile-fields-grid">
                  <div className="profile-field">
                    <label htmlFor="bloodGroup">Blood Group</label>
                    <select
                      id="bloodGroup"
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleChange}
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

                  <div className="profile-field">
                    <label htmlFor="genotype">Genotype</label>
                    <select
                      id="genotype"
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

                  <div className="profile-field profile-field-full">
                    <label htmlFor="weight">
                      Weight <span>(kg)</span>
                    </label>
                    <div className="profile-input-with-unit">
                      <input
                        id="weight"
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        placeholder="Enter your weight"
                      />
                      <span>kg</span>
                    </div>
                  </div>
                </div>

                <div className="profile-medical-note">
                  <span>ⓘ</span>
                  <p>
                    Please keep your medical information accurate. Eligibility
                    for donation should be assessed by qualified healthcare
                    professionals.
                  </p>
                </div>
              </section>

              {/* Location */}
              <section className="profile-form-section">
                <div className="profile-section-heading">
                  <span>03</span>
                  <div>
                    <h3>Location Details</h3>
                    <p>Your state and city help with local donor matching</p>
                  </div>
                </div>

                <div className="profile-fields-grid">
                  <div className="profile-field">
                    <label htmlFor="state">State</label>
                    <input
                      id="state"
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="Enter your state"
                    />
                  </div>

                  <div className="profile-field">
                    <label htmlFor="city">City</label>
                    <input
                      id="city"
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Enter your city"
                    />
                  </div>
                </div>
              </section>

              {/* Save Changes */}
              <div className="profile-save-footer">
                <div className="profile-save-note">
                  <span>✓</span>
                  <p>Your changes will be saved to your LifeLink profile.</p>
                </div>

                <button
                  type="submit"
                  className="profile-save-button"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="profile-button-spinner" />
                      Saving...
                    </>
                  ) : (
                    <>
                      Save Changes <span>→</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </main>
        </div>

        {/* Footer */}
        <footer className="profile-footer">
          <Link to="/" className="profile-footer-brand">
            <span>✚</span> LifeLink
          </Link>

          <p>Connecting willing donors with people who need blood.</p>

          <span>Every donation can make a difference.</span>
        </footer>
      </div>
    </div>
  );
};

export default Profile;
