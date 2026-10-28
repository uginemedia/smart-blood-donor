import React from "react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import "../styles/HospitalRequestDetails.css";

import api from "../services/api";

const HospitalRequestDetails = () => {
  const { id } = useParams();

  const [request, setRequest] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const requestResponse = await api.get(`/blood-requests/${id}`);

      const donationResponse = await api.get(`/donations/request/${id}`);

      if (requestResponse.data.success) {
        setRequest(requestResponse.data.request);
      }

      if (donationResponse.data.success) {
        setDonations(donationResponse.data.donations);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load request details.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="hospital-request-page">
        <div className="hospital-request-loading">
          <div className="loading-blood-icon">+</div>

          <h2>Loading Request</h2>

          <p>Retrieving the blood request and donor responses...</p>

          <div className="loading-line"></div>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="hospital-request-page">
        <div className="hospital-request-not-found">
          <div className="not-found-icon">!</div>

          <h2>Blood Request Not Found</h2>

          <p>This request may have been removed or is no longer available.</p>

          <Link to="/my-requests" className="hospital-back-button">
            ← Back to My Requests
          </Link>
        </div>
      </div>
    );
  }

  const accepted = donations.filter(
    (donation) => donation.status === "Accepted",
  );

  const declined = donations.filter(
    (donation) => donation.status === "Declined",
  );

  // const pending = donations.filter(
  //   (donation) => donation.status === "Pending",
  // );

  const totalResponses = donations.length;

  return (
    <div className="hospital-request-page">
      <div className="hospital-request-wrapper">
        {/* ==================================
            BACK LINK
        ================================== */}

        <Link to="/my-requests" className="hospital-top-back">
          ← Back to My Requests
        </Link>

        {/* ==================================
            REQUEST HERO
        ================================== */}

        <div className="hospital-request-card">
          <div className="hospital-request-hero">
            <div className="hospital-hero-content">
              <div className="hospital-request-icon">+</div>

              <div>
                <span className="hospital-eyebrow">BLOOD REQUEST</span>

                <h1>{request.bloodGroup} Blood Request</h1>

                <p>Monitor donor responses for this emergency request.</p>
              </div>
            </div>

            <div
              className={`hospital-urgency ${
                request.urgency?.toLowerCase() === "urgent" ? "urgent" : ""
              }`}
            >
              <span className="urgency-dot"></span>

              {request.urgency}
            </div>
          </div>

          {/* ==================================
              REQUEST SUMMARY
          ================================== */}

          <div className="hospital-blood-summary">
            <div className="blood-summary-item blood-highlight">
              <span>Blood Group</span>

              <strong>{request.bloodGroup}</strong>
            </div>

            <div className="hospital-summary-divider"></div>

            <div className="blood-summary-item">
              <span>Units Needed</span>

              <strong>{request.unitsNeeded}</strong>
            </div>

            <div className="hospital-summary-divider"></div>

            <div className="blood-summary-item">
              <span>Location</span>

              <strong>{request.city}</strong>
            </div>

            <div className="hospital-summary-divider"></div>

            <div className="blood-summary-item">
              <span>Total Responses</span>

              <strong>{totalResponses}</strong>
            </div>
          </div>

          {/* ==================================
              PATIENT DETAILS
          ================================== */}

          <div className="hospital-detail-section">
            <div className="hospital-section-heading">
              <div className="hospital-section-icon">👤</div>

              <div>
                <span>PATIENT INFORMATION</span>

                <h2>Patient Details</h2>
              </div>
            </div>

            <div className="hospital-detail-grid">
              <div className="hospital-detail-item">
                <span>Blood Group</span>

                <strong className="blood-group-value">
                  {request.bloodGroup}
                </strong>
              </div>

              <div className="hospital-detail-item">
                <span>Units Needed</span>

                <strong>{request.unitsNeeded} unit(s)</strong>
              </div>

              <div className="hospital-detail-item">
                <span>Urgency</span>

                <strong className="urgency-value">{request.urgency}</strong>
              </div>
            </div>
          </div>

          {/* ==================================
              LOCATION
          ================================== */}

          <div className="hospital-detail-section">
            <div className="hospital-section-heading">
              <div className="hospital-section-icon">📍</div>

              <div>
                <span>REQUEST LOCATION</span>

                <h2>Where Blood Is Needed</h2>
              </div>
            </div>

            <div className="hospital-location-card">
              <div className="hospital-location-icon">📍</div>

              <div>
                <strong>
                  {request.city}, {request.state}
                </strong>

                <p>Donors matching this request can see this location.</p>
              </div>
            </div>
          </div>

          {/* ==================================
              RESPONSE SUMMARY
          ================================== */}

          <div className="hospital-response-section">
            <div className="hospital-section-heading">
              <div className="hospital-section-icon">📊</div>

              <div>
                <span>DONOR ACTIVITY</span>

                <h2>Response Summary</h2>
              </div>
            </div>

            <div className="hospital-response-summary">
              <div className="hospital-summary-card accepted-card">
                <div className="summary-card-icon">✓</div>

                <div>
                  <span>Accepted</span>

                  <strong>{accepted.length}</strong>
                </div>
              </div>

              {/* <div className="hospital-summary-card pending-card">

                <div className="summary-card-icon">
                  ◷
                </div>

                <div>

                  <span>Pending</span>

                  <strong>
                    {pending.length}
                  </strong>

                </div>

              </div> */}

              <div className="hospital-summary-card declined-card">
                <div className="summary-card-icon">×</div>

                <div>
                  <span>Declined</span>

                  <strong>{declined.length}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* ==================================
              DONOR RESPONSES
          ================================== */}

          <div className="hospital-donors-section">
            <div className="hospital-donors-heading">
              <div>
                <span>DONOR RESPONSES</span>

                <h2>Donors Who Responded</h2>
              </div>

              <div className="donor-count">{donations.length}</div>
            </div>

            {donations.length === 0 ? (
              <div className="no-donors">
                <div className="no-donors-icon">👥</div>

                <h3>No donor responses yet</h3>

                <p>
                  Matching donors will appear here when they respond to your
                  request.
                </p>
              </div>
            ) : (
              <div className="hospital-donor-list">
                {donations.map((donation) => (
                  <div className="hospital-donor-card" key={donation._id}>
                    <div className="donor-profile-icon">
                      {donation.donor?.fullName?.charAt(0)?.toUpperCase() ||
                        "D"}
                    </div>

                    <div className="hospital-donor-info">
                      <h3>{donation.donor?.fullName || "Unknown Donor"}</h3>

                      <div className="donor-info-grid">
                        <span>
                          🩸 {donation.donor?.bloodGroup || "Not provided"}
                        </span>

                        <span>☎ {donation.donor?.phone || "Not provided"}</span>

                        <span>
                          📍 {donation.donor?.city || "Unknown"},{" "}
                          {donation.donor?.state || "Unknown"}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`hospital-response-status ${donation.status?.toLowerCase()}`}
                    >
                      {donation.status}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ==================================
              FOOTER
          ================================== */}

          <div className="hospital-request-footer">
            <span>Smart Blood Donation System</span>

            <Link to="/my-requests">Back to My Requests →</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalRequestDetails;
