import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";

import "../styles/BloodRequestDetails.css";

import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

const BloodRequestDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState(false);

  const [existingResponse, setExistingResponse] = useState(null);

  const fetchRequest = async () => {
    try {
      const response = await api.get(`/blood-requests/${id}`);

      if (response.data.success) {
        setRequest(response.data.request);
      }

      if (user?._id) {
        const donationResponse = await api.get(`/donations/request/${id}`);

        const donations =
          donationResponse.data.donations ||
          donationResponse.data.responses ||
          [];

        const userDonation = donations.find((donation) => {
          const donorId =
            typeof donation.donor === "object"
              ? donation.donor?._id
              : donation.donor;

          return String(donorId) === String(user._id);
        });

        setExistingResponse(userDonation?.status || null);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load blood request.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequest();
  }, [id, user?._id]);

  const respondToRequest = async (status) => {
    if (isClosed) {
      toast.info("This blood request has been closed by the hospital.");
      return;
    }

    if (existingResponse) {
      toast.info(
        `You have already ${existingResponse.toLowerCase()} this request.`,
      );
      return;
    }

    try {
      setResponding(true);

      const response = await api.post("/donations/respond", {
        donor: user._id,
        bloodRequest: id,
        status,
      });

      if (response.data.success) {
        toast.success(
          status === "Accepted"
            ? "You accepted the blood request."
            : "You declined the blood request.",
        );

        navigate("/notifications");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to submit your response.",
      );
    } finally {
      setResponding(false);
    }
  };

  if (loading) {
    return (
      <div className="blood-request-page">
        <div className="request-loading">
          <div className="request-loading-icon">+</div>
          <span className="request-loading-eyebrow">
            LIFELINK EMERGENCY NETWORK
          </span>
          <h2>Loading Blood Request</h2>
          <p>Please wait while we retrieve the emergency request.</p>
          <div className="request-loading-bar">
            <span />
          </div>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="blood-request-page">
        <div className="request-not-found">
          <div className="not-found-icon">!</div>
          <span className="request-loading-eyebrow">REQUEST UNAVAILABLE</span>
          <h2>Request Not Found</h2>
          <p>
            This blood request may have been removed or is no longer available.
          </p>
          <Link to="/notifications" className="request-back-button">
            <span aria-hidden="true">←</span> Back to Notifications
          </Link>
        </div>
      </div>
    );
  }

  const isUrgent = request.urgency?.toLowerCase().includes("urgent");

  const isClosed = request.status?.toLowerCase() === "closed";

  return (
    <div className="blood-request-page">
      <div className="blood-request-wrapper">
        <nav className="request-navigation" aria-label="Request navigation">
          <Link to="/notifications" className="top-back-link">
            <span aria-hidden="true">←</span>
            <span>Back to Notifications</span>
          </Link>

          <Link to="/" className="request-brand" aria-label="LifeLink home">
            <span className="request-brand-mark">+</span>
            <span className="request-brand-name">LifeLink</span>
          </Link>
        </nav>

        <div className="request-page-intro">
          <span className="request-page-kicker">
            <span className="request-kicker-dot" />
            DONOR RESPONSE CENTER
          </span>
          <h1>Blood Request Details</h1>
          <p>
            Review the request carefully and let the hospital know if you can
            help.
          </p>
        </div>

        <main className="request-detail-card">
          <section className="request-hero">
            <div className="request-hero-decoration request-decoration-one" />
            <div className="request-hero-decoration request-decoration-two" />

            <div className="request-hero-topline">
              <span className="request-hero-label">
                <span className="request-hero-plus">+</span>
                EMERGENCY BLOOD REQUEST
              </span>

              <span className={`request-urgency ${isUrgent ? "urgent" : ""}`}>
                <span className="urgency-pulse" />
                {request.urgency || "Urgency not specified"}
              </span>
            </div>

            <div className="request-hero-content">
              <div className="request-blood-emblem" aria-hidden="true">
                <span>+</span>
              </div>

              <div className="request-hero-copy">
                <span className="request-hero-overline">
                  YOUR HELP COULD MAKE A DIFFERENCE
                </span>
                <h2>Blood Donation Needed</h2>
                <p>
                  A hospital needs blood support. Check the details below to
                  decide whether you can respond.
                </p>
              </div>
            </div>

            <div className="request-hero-bottom">
              <span>
                <span className="hero-mini-icon" aria-hidden="true">
                  ⌖
                </span>
                {request.city || "Location not specified"}
                {request.state ? `, ${request.state}` : ""}
              </span>

              <span className="request-reference">
                Request reference: {String(id).slice(-8).toUpperCase()}
              </span>
            </div>
          </section>

          <section className="request-summary-section">
            <div className="request-section-heading">
              <div>
                <span className="request-section-kicker">AT A GLANCE</span>
                <h2>Request Summary</h2>
              </div>
              <span className="request-section-symbol" aria-hidden="true">
                ✚
              </span>
            </div>

            <div className="blood-summary">
              <article className="blood-summary-card blood-summary-highlight">
                <span
                  className="summary-icon summary-blood-icon"
                  aria-hidden="true"
                >
                  +
                </span>
                <div>
                  <span className="summary-label">Blood Group</span>
                  <strong className="summary-blood-value">
                    {request.bloodGroup || "Not specified"}
                  </strong>
                  <small>Required blood type</small>
                </div>
              </article>

              <article className="blood-summary-card">
                <span
                  className="summary-icon summary-units-icon"
                  aria-hidden="true"
                >
                  ▤
                </span>
                <div>
                  <span className="summary-label">Units Needed</span>
                  <strong>{request.unitsNeeded ?? "—"}</strong>
                  <small>Units requested</small>
                </div>
              </article>

              <article className="blood-summary-card">
                <span
                  className="summary-icon summary-location-icon"
                  aria-hidden="true"
                >
                  ⌖
                </span>
                <div>
                  <span className="summary-label">Location</span>
                  <strong>{request.city || "Not specified"}</strong>
                  <small>{request.state || "State not specified"}</small>
                </div>
              </article>
            </div>
          </section>

          <section className="request-detail-section">
            <div className="section-heading">
              <div className="section-icon" aria-hidden="true">
                ▤
              </div>
              <div>
                <span>REQUEST INFORMATION</span>
                <h2>Donation Requirements</h2>
                <p>Review the key details before responding.</p>
              </div>
            </div>

            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-item-label">Blood Group</span>
                <strong className="blood-value">
                  {request.bloodGroup || "Not specified"}
                </strong>
                <span className="detail-item-caption">
                  Requested blood type
                </span>
              </div>

              <div className="detail-item">
                <span className="detail-item-label">Units Needed</span>
                <strong>
                  {request.unitsNeeded ?? "—"}
                  <small className="detail-unit">
                    {request.unitsNeeded === 1 ? " unit" : " units"}
                  </small>
                </strong>
                <span className="detail-item-caption">
                  Quantity requested by the hospital
                </span>
              </div>

              <div className="detail-item">
                <span className="detail-item-label">Urgency Level</span>
                <strong className={isUrgent ? "urgency-text" : ""}>
                  {request.urgency || "Not specified"}
                </strong>
                <span className="detail-item-caption">Request priority</span>
              </div>

              {request.bloodComponent && (
                <div className="detail-item">
                  <span className="detail-item-label">Blood Component</span>
                  <strong>{request.bloodComponent}</strong>
                  <span className="detail-item-caption">
                    Component requested
                  </span>
                </div>
              )}

              {request.status && (
                <div className="detail-item">
                  <span className="detail-item-label">Request Status</span>
                  <strong>{request.status}</strong>
                  <span className="detail-item-caption">
                    Current request status
                  </span>
                </div>
              )}
            </div>
          </section>

          {/* Donation Location */}
          {/* Requesting Hospital */}
          <div className="request-detail-section">
            <div className="section-heading">
              <span className="section-icon">📍</span>
              <h2>Requesting Hospital</h2>
            </div>

            <div className="location-card">
              <div className="location-info">
                <span className="location-label">Hospital Name</span>
                <h3>
                  {request.hospital?.hospitalName ||
                    request.hospital?.fullName ||
                    request.hospitalName ||
                    "Hospital name unavailable"}
                </h3>

                <span className="location-label">Location</span>
                <p>
                  {request.city || "City unavailable"},{" "}
                  {request.state || "State unavailable"}
                </p>
              </div>
            </div>
          </div>

          <section className="request-response-section">
            {isClosed ? (
              <div className="response-true response-closed" role="status">
                <span className="response-result-icon" aria-hidden="true">
                  🔒
                </span>

                <div>
                  <span className="response-result-kicker">REQUEST CLOSED</span>
                  <h2>This Request Is No Longer Available</h2>
                  <p>
                    The hospital has closed this blood request. You can no
                    longer accept or decline it.
                  </p>
                </div>
              </div>
            ) : existingResponse ? (
              <div
                className={`response-true ${
                  existingResponse.toLowerCase() === "accepted"
                    ? "response-accepted"
                    : "response-declined"
                }`}
                role="status"
              >
                <span className="response-result-icon" aria-hidden="true">
                  {existingResponse.toLowerCase() === "accepted" ? "✓" : "!"}
                </span>

                <div>
                  <span className="response-result-kicker">YOUR RESPONSE</span>
                  <h2>Response Already Submitted</h2>
                  <p>
                    You have already {existingResponse.toLowerCase()} this
                    request. You can only respond once to each request.
                  </p>
                </div>
              </div>
            ) : (
              <div className="donor-response">
                <div className="response-heart" aria-hidden="true">
                  ♥
                </div>

                <span className="response-eyebrow">
                  BE SOMEONE'S REASON TO HOPE
                </span>

                <h2>Can you help save a life?</h2>

                <p>
                  Your response will be sent to the hospital. Only accept if you
                  are available and eligible to donate.
                </p>

                <div className="response-reminder">
                  <span aria-hidden="true">ⓘ</span>
                  Please make sure the request location works for you before
                  accepting.
                </div>

                <div className="response-buttons">
                  <button
                    type="button"
                    className="accept-button"
                    disabled={responding}
                    onClick={() => respondToRequest("Accepted")}
                  >
                    <span className="response-button-icon" aria-hidden="true">
                      ✓
                    </span>
                    <span>
                      <strong>
                        {responding ? "Processing..." : "I Can Donate"}
                      </strong>
                      <small>Accept this request</small>
                    </span>
                    {!responding && (
                      <span
                        className="response-button-arrow"
                        aria-hidden="true"
                      >
                        →
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    className="decline-button"
                    disabled={responding}
                    onClick={() => respondToRequest("Declined")}
                  >
                    <span className="response-button-icon" aria-hidden="true">
                      ×
                    </span>
                    <span>
                      <strong>
                        {responding ? "Processing..." : "I Can't Donate"}
                      </strong>
                      <small>Decline this request</small>
                    </span>
                    {!responding && (
                      <span
                        className="response-button-arrow"
                        aria-hidden="true"
                      >
                        →
                      </span>
                    )}
                  </button>
                </div>

                <small className="response-once-note">
                  Your response can only be submitted once.
                </small>
              </div>
            )}
          </section>

          <footer className="request-footer">
            <div className="request-footer-brand">
              <span className="request-footer-plus" aria-hidden="true">
                +
              </span>
              <span>
                <strong>LifeLink</strong>
                <small>DONOR COMMUNITY</small>
              </span>
            </div>

            <p>Every donation can make a difference.</p>

            <Link to="/notifications" className="request-footer-link">
              Notifications <span aria-hidden="true">→</span>
            </Link>
          </footer>
        </main>

        <div className="request-page-note">
          <span aria-hidden="true">♥</span>
          Thank you for being part of the LifeLink donor community.
        </div>
      </div>
    </div>
  );
};

export default BloodRequestDetails;
