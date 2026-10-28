import React from "react";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

import "../styles/Notifications.css";

const Notifications = () => {
  const { user } = useContext(AuthContext);

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const response = await api.get(`/notifications/user/${user._id}`);

      if (response.data.success) {
        const notificationList = response.data.notifications || [];

        const updatedNotifications = await Promise.all(
          notificationList.map(async (notification) => {
            const request = notification.bloodRequest;

            if (!request?._id) {
              return {
                ...notification,
                userResponse: null,
              };
            }

            try {
              const donationResponse = await api.get(
                `/donations/request/${request._id}`,
              );

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

              return {
                ...notification,
                userResponse: userDonation?.status || null,
              };
            } catch (error) {
              console.error(
                "Failed to check response for notification:",
                error,
              );

              return {
                ...notification,
                userResponse: null,
              };
            }
          }),
        );

        setNotifications(updatedNotifications);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load notifications.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchNotifications();
    }
  }, [user]);

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div className="notifications-page">
        <div className="notifications-loading">
          <div className="loading-blood-drop">+</div>

          <h2>Loading Notifications</h2>

          <p>Checking for emergency blood requests...</p>

          <div className="loading-line"></div>
        </div>
      </div>
    );
  }

  /* =========================
     PAGE
  ========================= */

  return (
    <div className="notifications-page">
      <div className="notifications-wrapper">
        {/* ==================================
            PAGE HEADER
        ================================== */}

        <div className="notifications-top">
          <div className="notifications-heading">
            <div className="notification-title-icon">
              <ion-icon name="notifications"></ion-icon>
            </div>

            <div>
              <span className="notifications-eyebrow">DONOR ALERT CENTER</span>

              <h1>Notifications</h1>

              <p>
                Stay updated with blood requests that match your donor
                information.
              </p>
            </div>
          </div>

          <Link to="/dashboard" className="notifications-dashboard-button">
            Dashboard
          </Link>
        </div>

        {/* ==================================
            NOTIFICATION SUMMARY
        ================================== */}

        {notifications.length > 0 && (
          <div className="notification-summary">
            <div className="summary-item">
              <div className="summary-icon emergency-icon">
                <ion-icon name="add"></ion-icon>
              </div>

              <div>
                <span>Active Requests</span>

                <strong>{notifications.length}</strong>
              </div>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-item">
              <div className="summary-icon blood-summary-icon">
                <ion-icon name="water" className="water"></ion-icon>
              </div>

              <div>
                <span>Your Blood Group</span>

                <strong>{user?.bloodGroup || "Not Set"}</strong>
              </div>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-item">
              <div className="summary-icon location-summary-icon">
                <ion-icon name="location" className="location"></ion-icon>
              </div>

              <div>
                <span>Your Location</span>

                <strong>{user?.city || "Not Set"}</strong>
              </div>
            </div>
          </div>
        )}

        {/* ==================================
            EMPTY STATE
        ================================== */}

        {notifications.length === 0 ? (
          <div className="notifications-empty">
            <div className="empty-blood-icon">+</div>

            <h2>No Emergency Requests</h2>

            <p>
              You don't have any blood requests matching your donor information
              at the moment.
            </p>

            <Link to="/dashboard" className="empty-dashboard-button">
              Return to Dashboard
            </Link>
          </div>
        ) : (
          /* ==================================
             NOTIFICATION LIST
          ================================== */

          <div className="notification-list">
            {notifications.map((notification) => {
              const request = notification.bloodRequest;

              return (
                <div className="notification-card" key={notification._id}>
                  {/* Unread indicator */}
                  {/* {!notification.isRead && (
                    <div className="unread-indicator">
                      NEW
                    </div>
                  )} */}

                  {/* ==================================
                      CARD HEADER
                  ================================== */}

                  <div className="notification-header">
                    {" "}
                    <div className="notification-header-left">
                      <div className="emergency-icon-large">
                        <ion-icon name="add"></ion-icon>
                      </div>

                      <div>
                        <div className="notification-label">
                          EMERGENCY BLOOD REQUEST
                        </div>

                        <h2>{notification.title}</h2>
                      </div>
                    </div>
                    <div className="notification-date-box">
                      <span>
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </span>

                      <small>
                        {new Date(notification.createdAt).toLocaleTimeString(
                          [],
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </small>
                    </div>
                  </div>

                  {/* ==================================
                      EMERGENCY MESSAGE
                  ================================== */}

                  <div className="notification-message">
                    <div className="message-icon">
                      <ion-icon name="alert"></ion-icon>
                    </div>

                    <div>
                      <span>EMERGENCY ALERT</span>

                      <p>{notification.message}</p>
                    </div>
                  </div>

                  {request ? (
                    <>
                      {/* ==================================
                          REQUEST DETAILS
                      ================================== */}

                      <div className="request-section">
                        <div className="request-section-heading">
                          <div>
                            <span>BLOOD REQUEST DETAILS</span>

                            <h3>Patient Information</h3>
                          </div>

                          <div
                            className={`urgency-badge ${
                              request.urgency?.toLowerCase().includes("urgent")
                                ? "urgent"
                                : ""
                            }`}
                          >
                            <span className="urgency-dot"></span>

                            {request.urgency}
                          </div>
                        </div>

                        <div className="notification-details">
                          {/* Blood Group */}

                          <div className="notification-detail">
                            <div className="detail-icon blood-detail-icon">
                              <ion-icon name="add" className="add"></ion-icon>
                            </div>

                            <div>
                              <span>Blood Group</span>

                              <strong className="blood-group-value">
                                {request.bloodGroup}
                              </strong>
                            </div>
                          </div>

                          {/* Units */}

                          <div className="notification-detail">
                            <div className="detail-icon">
                              <ion-icon
                                name="water"
                                className="water"
                              ></ion-icon>
                            </div>

                            <div>
                              <span>Units Needed</span>

                              <strong>{request.unitsNeeded} unit(s)</strong>
                            </div>
                          </div>

                          {/* Location */}

                          <div className="notification-detail">
                            <div className="detail-icon">
                              <ion-icon
                                name="location"
                                className="location"
                              ></ion-icon>
                            </div>

                            <div>
                              <span>Location</span>

                              <strong>
                                {request.city}, {request.state}
                              </strong>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* ==================================
                          ACTION
                      ================================== */}

                      <div className="notification-actions">
                        <div className="action-message">
                          <span className="action-heart">
                            <ion-icon name="heart"></ion-icon>
                          </span>

                          <p>Your donation could help save a life.</p>
                        </div>

                        <Link
                          to={`/blood-request/${request._id}`}
                          className="view-request-button"
                        >
                          View Blood Request
                        </Link>
                      </div>
                    </>
                  ) : (
                    <div className="request-unavailable">
                      <span>!</span>

                      <p>Blood request details are currently unavailable.</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
