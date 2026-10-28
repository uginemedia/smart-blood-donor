import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import "../styles/HospitalProfile.css";

const createFormData = (user = {}) => ({
  hospitalName: user.hospitalName || "",
  fullName: user.fullName || "",
  email: user.email || "",
  phone: user.phone || "",
  address: user.address || "",
  state: user.state || "",
  city: user.city || "",
  hospitalLicense: user.hospitalLicense || "",
  licenseNumber: user.licenseNumber || "",
});

const HospitalProfile = () => {
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState(() => createFormData());
  const [requests, setRequests] = useState([]);
  const [donationResponses, setDonationResponses] = useState([]);

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Load hospital details from the logged-in account.
  useEffect(() => {
    if (user) {
      setFormData(createFormData(user));
    }
  }, [user]);

  // Load blood requests created by this hospital.
  const fetchRequests = async (showRefresh = false) => {
    if (!user?._id) {
      setLoading(false);
      return;
    }

    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await api.get(`/blood-requests/hospital/${user._id}`);

      if (response.data.success) {
        setRequests(response.data.requests || []);
      } else {
        toast.error(response.data.message || "Unable to load requests.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load hospital statistics.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchRequests();
    } else {
      setLoading(false);
    }
  }, [user?._id]);

  // Load donor responses for the hospital's requests.
  useEffect(() => {
    let cancelled = false;

    const fetchResponses = async () => {
      if (!requests.length) {
        setDonationResponses([]);
        return;
      }

      const results = await Promise.all(
        requests.map(async (request) => {
          try {
            const response = await api.get(`/donations/request/${request._id}`);

            return response.data.donations || response.data.responses || [];
          } catch (error) {
            console.error(
              `Failed to load responses for request ${request._id}:`,
              error,
            );

            return [];
          }
        }),
      );

      if (!cancelled) {
        setDonationResponses(results.flat());
      }
    };

    fetchResponses();

    return () => {
      cancelled = true;
    };
  }, [requests]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    setFormData(createFormData(user));
    setEditing(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user?._id) {
      toast.error("Please log in again to update your profile.");
      return;
    }

    try {
      setSaving(true);

      const response = await api.put(`/auth/profile/${user._id}`, formData);

      if (!response.data.success) {
        toast.error(response.data.message || "Failed to update profile.");
        return;
      }

      const updatedUser = response.data.user || {};

      setFormData((previous) => ({
        ...previous,
        ...updatedUser,
      }));

      setEditing(false);
      toast.success("Hospital profile updated successfully.");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update hospital profile.",
      );
    } finally {
      setSaving(false);
    }
  };

  // Preserve the existing statistics calculation:
  // count unique donors with accepted or declined responses.
  const getDonorId = (response) => {
    const donor = response.donor;

    if (!donor) return null;

    return String(typeof donor === "object" ? donor._id : donor);
  };

  const acceptedUsers = useMemo(
    () =>
      new Set(
        donationResponses
          .filter((response) => response.status?.toLowerCase() === "accepted")
          .map(getDonorId)
          .filter(Boolean),
      ),
    [donationResponses],
  );

  const declinedUsers = useMemo(
    () =>
      new Set(
        donationResponses
          .filter((response) => response.status?.toLowerCase() === "declined")
          .map(getDonorId)
          .filter(Boolean),
      ),
    [donationResponses],
  );

  const totalRequests = requests.length;
  const acceptedRequests = acceptedUsers.size;
  const declinedRequests = declinedUsers.size;

  const profileFields = [
    formData.hospitalName,
    formData.fullName,
    formData.email,
    formData.phone,
    formData.address,
    formData.state,
    formData.city,
  ];

  const completedFields = profileFields.filter((value) =>
    String(value || "").trim(),
  ).length;

  const profileCompletion = Math.round(
    (completedFields / profileFields.length) * 100,
  );

  const displayValue = (value) => value || "Not provided";

  const recentRequests = [...requests]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime(),
    )
    .slice(0, 3);

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date unavailable";
    }

    return parsedDate.toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (!user) {
    return (
      <main className="hospital-profile-page">
        <div className="hospital-profile-empty">
          <div className="profile-empty-icon">✚</div>
          <h2>Sign in to view your profile</h2>
          <p>
            Log in to manage your hospital information and blood request
            activity.
          </p>
          <Link to="/" className="hospital-primary-button">
            Go to Login
          </Link>
        </div>
      </main>
    );
  }

  const hospitalName =
    formData.hospitalName || formData.fullName || "Hospital Profile";

  const isVerified = Boolean(user.isVerified);

  return (
    <main className="hospital-profile-page">
      <div className="hospital-profile-wrapper">
        <Link to="/hospital-dashboard" className="hospital-profile-back">
          <span aria-hidden="true">←</span>
          Back to Dashboard
        </Link>

        {/* Hospital identity */}
        <section className="hospital-profile-hero">
          <div className="hospital-hero-decoration" aria-hidden="true" />

          <div className="hospital-profile-avatar">
            <span aria-hidden="true">✚</span>
          </div>

          <div className="hospital-profile-heading">
            <span className="hospital-profile-eyebrow">
              LIFELINK · HOSPITAL ACCOUNT
            </span>

            <h1>{hospitalName}</h1>

            <p>
              Manage your hospital identity, contact information, and donor
              response activity in one place.
            </p>

            <div className="hospital-hero-badges">
              <span
                className={`hospital-verification ${
                  isVerified ? "is-verified" : "is-unverified"
                }`}
              >
                <span className="verification-dot" />
                {isVerified ? "Verified Hospital" : "Verification Pending"}
              </span>

              <span className="hospital-account-badge">
                <span aria-hidden="true">♥</span>
                LifeLink Partner
              </span>
            </div>
          </div>

          {!editing && (
            <button
              type="button"
              className="hospital-edit-button"
              onClick={() => setEditing(true)}
            >
              <span aria-hidden="true">✎</span>
              Edit Profile
            </button>
          )}
        </section>

        {/* Profile completion */}
        <section className="hospital-completion-card">
          <div className="completion-copy">
            <div className="completion-icon" aria-hidden="true">
              ✓
            </div>

            <div>
              <h2>Hospital profile strength</h2>
              <p>
                {profileCompletion === 100
                  ? "Your essential profile information is complete."
                  : "Complete your contact and location details to keep your profile up to date."}
              </p>
            </div>
          </div>

          <div className="completion-progress-area">
            <div className="completion-progress-label">
              <span>Profile completion</span>
              <strong>{profileCompletion}%</strong>
            </div>

            <div
              className="completion-progress-track"
              role="progressbar"
              aria-label="Hospital profile completion"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={profileCompletion}
            >
              <div
                className="completion-progress-fill"
                style={{ width: `${profileCompletion}%` }}
              />
            </div>
          </div>
        </section>

        {/* Hospital statistics: only the three requested */}
        <section className="hospital-profile-stats">
          <article className="hospital-stat-card stat-total">
            <div className="hospital-stat-top">
              <div className="hospital-stat-icon red-icon">▤</div>
              <span className="stat-caption">ALL TIME</span>
            </div>

            <span className="hospital-stat-label">Total Requests</span>
            <strong>{loading ? "—" : totalRequests}</strong>
            <p>Blood requests created by your hospital</p>
          </article>

          <article className="hospital-stat-card stat-accepted">
            <div className="hospital-stat-top">
              <div className="hospital-stat-icon green-icon">✓</div>
              <span className="stat-caption">DONOR RESPONSES</span>
            </div>

            <span className="hospital-stat-label">Accepted Requests</span>
            <strong>{loading ? "—" : acceptedRequests}</strong>
            <p>Unique donors who accepted</p>
          </article>

          <article className="hospital-stat-card stat-declined">
            <div className="hospital-stat-top">
              <div className="hospital-stat-icon orange-icon">↗</div>
              <span className="stat-caption">DONOR RESPONSES</span>
            </div>

            <span className="hospital-stat-label">Declined Requests</span>
            <strong>{loading ? "—" : declinedRequests}</strong>
            <p>Unique donors who declined</p>
          </article>
        </section>

        <div className="hospital-profile-main-grid">
          {/* Profile form */}
          <section className="hospital-profile-card">
            <div className="hospital-card-heading">
              <div className="hospital-section-icon" aria-hidden="true">
                <span>▤</span>
              </div>

              <div>
                <h2>Hospital Information</h2>
                <p>Your hospital identity, contact person, and location.</p>
              </div>

              {!editing && (
                <button
                  type="button"
                  className="hospital-mobile-edit"
                  onClick={() => setEditing(true)}
                  aria-label="Edit hospital profile"
                >
                  ✎
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit}>
              <div className="hospital-form-section-title">
                <span>01</span>
                <h3>Basic Information</h3>
              </div>

              <div className="hospital-form-grid">
                <div className="hospital-form-group full-width">
                  <label htmlFor="hospitalName">Hospital Name</label>
                  <input
                    id="hospitalName"
                    name="hospitalName"
                    value={formData.hospitalName}
                    onChange={handleChange}
                    disabled={!editing || saving}
                    placeholder="Enter hospital name"
                    autoComplete="organization"
                    required
                  />
                </div>

                <div className="hospital-form-group">
                  <label htmlFor="fullName">Contact Person</label>
                  <input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    disabled={!editing || saving}
                    placeholder="Contact person's name"
                    autoComplete="name"
                    required
                  />
                </div>

                <div className="hospital-form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!editing || saving}
                    placeholder="hospital@example.com"
                    autoComplete="email"
                    required
                  />
                </div>

                <div className="hospital-form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!editing || saving}
                    placeholder="Enter phone number"
                    autoComplete="tel"
                    required
                  />
                </div>
              </div>

              <div className="hospital-form-section-title location-section-title">
                <span>02</span>
                <h3>Hospital Location</h3>
              </div>

              <div className="hospital-form-grid">
                <div className="hospital-form-group full-width">
                  <label htmlFor="address">Hospital Address</label>
                  <input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={!editing || saving}
                    placeholder="Street address or hospital premises"
                    autoComplete="street-address"
                  />
                </div>

                <div className="hospital-form-group">
                  <label htmlFor="state">State</label>
                  <input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    disabled={!editing || saving}
                    placeholder="Enter state"
                    autoComplete="address-level1"
                    required
                  />
                </div>

                <div className="hospital-form-group">
                  <label htmlFor="city">City</label>
                  <input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    disabled={!editing || saving}
                    placeholder="Enter city"
                    autoComplete="address-level2"
                    required
                  />
                </div>
              </div>

              <div className="hospital-form-section-title location-section-title">
                <span>03</span>
                <h3>Registration Details</h3>
              </div>

              <div className="hospital-form-grid">
                <div className="hospital-form-group">
                  <label htmlFor="hospitalLicense">Hospital License</label>
                  <input
                    id="hospitalLicense"
                    name="hospitalLicense"
                    value={formData.hospitalLicense}
                    onChange={handleChange}
                    disabled={!editing || saving}
                    placeholder="Enter license (optional)"
                  />
                </div>

                <div className="hospital-form-group">
                  <label htmlFor="licenseNumber">Registration Number</label>
                  <input
                    id="licenseNumber"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    disabled={!editing || saving}
                    placeholder="Enter registration number"
                  />
                </div>
              </div>

              {!editing && (
                <div className="hospital-profile-readonly-note">
                  <span aria-hidden="true">ⓘ</span>
                  Your information is in view mode. Select Edit Profile to make
                  changes.
                </div>
              )}

              {editing && (
                <div className="hospital-form-actions">
                  <button
                    type="button"
                    className="hospital-cancel-button"
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="hospital-save-button"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span className="button-spinner" />
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <span aria-hidden="true">✓</span>
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </section>

          {/* Recent activity */}
          <aside className="hospital-profile-sidebar">
            <section className="hospital-activity-card">
              <div className="hospital-card-heading activity-heading">
                <div className="hospital-section-icon activity-icon">
                  <span aria-hidden="true">↗</span>
                </div>

                <div>
                  <h2>Recent Requests</h2>
                  <p>Your latest blood request activity.</p>
                </div>
              </div>

              {loading ? (
                <div className="hospital-activity-message">
                  <span className="activity-loading-dot" />
                  Loading requests...
                </div>
              ) : recentRequests.length ? (
                <div className="hospital-recent-list">
                  {recentRequests.map((request) => {
                    const status = request.status || "Pending";

                    return (
                      <article
                        className="hospital-recent-item"
                        key={request._id}
                      >
                        <div className="recent-blood-icon">
                          {request.bloodGroup || "?"}
                        </div>

                        <div className="recent-request-copy">
                          <h3>{request.bloodGroup || "Blood"} Request</h3>

                          <p>
                            {request.unitsNeeded || 0} units ·{" "}
                            {request.city ||
                              formData.city ||
                              "Location unavailable"}
                          </p>

                          <span className="recent-request-date">
                            {formatDate(request.createdAt)}
                          </span>
                        </div>

                        <span
                          className={`recent-status status-${status.toLowerCase()}`}
                        >
                          {status}
                        </span>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="hospital-activity-empty">
                  <div aria-hidden="true">♡</div>
                  <h3>No requests yet</h3>
                  <p>Your blood requests will appear here.</p>
                </div>
              )}

              <Link to="/my-requests" className="hospital-view-requests-link">
                View All Requests
                <span aria-hidden="true">→</span>
              </Link>

              <button
                type="button"
                className="hospital-refresh-button"
                onClick={() => fetchRequests(true)}
                disabled={refreshing}
              >
                <span aria-hidden="true">{refreshing ? "↻" : "⟳"}</span>
                {refreshing ? "Refreshing..." : "Refresh Activity"}
              </button>
            </section>

            <section className="hospital-verification-card">
              <div className="verification-card-top">
                <div className="verification-card-icon" aria-hidden="true">
                  {isVerified ? "✓" : "!"}
                </div>

                <div>
                  <span className="verification-card-eyebrow">
                    ACCOUNT STATUS
                  </span>
                  <h2>
                    {isVerified ? "Verified Hospital" : "Verification Pending"}
                  </h2>
                </div>
              </div>

              <p>
                {isVerified
                  ? "Your hospital account is marked as verified by the system."
                  : "Your hospital account has not been marked as verified yet. Contact the system administrator if a review is needed."}
              </p>

              <div className="verification-card-foot">
                <span className="verification-dot" />
                {isVerified
                  ? "Verification confirmed"
                  : "Awaiting verification"}
              </div>
            </section>
          </aside>
        </div>

        <footer className="hospital-profile-footer">
          <span className="footer-heart" aria-hidden="true">
            ♥
          </span>
          <p>
            <strong>LifeLink</strong> — Connecting hospitals with people ready
            to help save lives.
          </p>
        </footer>
      </div>
    </main>
  );
};

export default HospitalProfile;
