import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import "../styles/MyRequests.css";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

const STATUS_OPTIONS = [
  { label: "All statuses", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Closed", value: "closed" },
];

const formatDate = (date) => {
  if (!date) return "Date unavailable";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "Date unavailable";

  return parsedDate.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const MyRequests = () => {
  const { user } = useContext(AuthContext);

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [closingRequestId, setClosingRequestId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchRequests = useCallback(
    async (showRefresh = false) => {
      if (!user?._id) {
        setRequests([]);
        setLoading(false);
        return;
      }

      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      try {
        const response = await api.get(`/blood-requests/hospital/${user._id}`);

        if (!response.data.success) {
          throw new Error("Could not load blood requests.");
        }

        const hospitalRequests = response.data.requests || [];

        const requestsWithAcceptedDonors = await Promise.all(
          hospitalRequests.map(async (request) => {
            try {
              const donationResponse = await api.get(
                `/donations/request/${request._id}`,
              );

              const donations = donationResponse.data.donations || [];

              const acceptedDonors = donations.filter(
                (donation) => donation.status?.toLowerCase() === "accepted",
              ).length;

              return { ...request, acceptedDonors };
            } catch (error) {
              console.error(
                `Failed to load donor responses for request ${request._id}`,
                error,
              );

              return { ...request, acceptedDonors: 0 };
            }
          }),
        );

        setRequests(requestsWithAcceptedDonors);
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Failed to load blood requests.",
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [user?._id],
  );

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const stats = useMemo(() => {
    const active = requests.filter((request) => {
      const status = request.status?.toLowerCase() || "pending";
      return status === "pending" || status === "matched";
    });

    const critical = requests.filter(
      (request) => request.urgency?.toLowerCase() === "critical",
    );

    const acceptedDonors = requests.reduce(
      (total, request) => total + (request.acceptedDonors || 0),
      0,
    );

    return {
      total: requests.length,
      active: active.length,
      critical: critical.length,
      acceptedDonors,
    };
  }, [requests]);

  const filteredRequests = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return requests.filter((request) => {
      const status = request.status?.toLowerCase() || "pending";

      const matchesStatus = statusFilter === "all" || status === statusFilter;

      const searchableText = [
        request.bloodGroup,
        request.bloodComponentType,
        request.urgency,
        request.city,
        request.state,
        request.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesStatus && searchableText.includes(search);
    });
  }, [requests, searchTerm, statusFilter]);

  const handleCloseRequest = async (request) => {
    const status = request.status?.toLowerCase() || "pending";

    if (status === "closed" || status === "completed") return;

    const confirmed = window.confirm(
      `Close the ${request.bloodGroup} blood request? Donors should no longer treat it as an active request.`,
    );

    if (!confirmed) return;

    try {
      setClosingRequestId(request._id);

      const response = await api.patch(`/blood-requests/${request._id}/close`, {
        hospitalId: user._id,
      });

      if (response.data.success) {
        setRequests((previous) =>
          previous.map((item) =>
            item._id === request._id
              ? {
                  ...item,
                  ...response.data.request,
                  status: response.data.request?.status || "Closed",
                  acceptedDonors: item.acceptedDonors || 0,
                }
              : item,
          ),
        );

        toast.success("Blood request closed successfully.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to close blood request.",
      );
    } finally {
      setClosingRequestId(null);
    }
  };

  if (loading) {
    return (
      <main className="my-requests-page">
        <div className="requests-loading">
          <div className="loading-spinner" />
          <h2>Loading your requests</h2>
          <p>Preparing your hospital request dashboard...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="my-requests-page">
      <div className="my-requests-wrapper">
        <Link to="/hospital-dashboard" className="requests-back-link">
          <span aria-hidden="true">←</span>
          Back to Dashboard
        </Link>

        <section className="requests-hero">
          <div className="requests-hero-copy">
            <span className="requests-eyebrow">
              LIFELINK · HOSPITAL MANAGEMENT
            </span>

            <h1>My Blood Requests</h1>

            <p>
              Every request is a chance to connect a patient with a potential
              donor. Track progress and manage your requests from one place.
            </p>
          </div>

          <Link to="/create-request" className="new-request-button">
            <span aria-hidden="true">+</span>
            Create Request
          </Link>

          <div className="requests-hero-decoration" aria-hidden="true">
            <span>+</span>
            <span>♥</span>
          </div>
        </section>

        <section className="request-summary" aria-label="Request statistics">
          <article className="request-summary-card">
            <div className="summary-icon total" aria-hidden="true">
              <span>#</span>
            </div>
            <div className="summary-card-copy">
              <span>Total Requests</span>
              <strong>{stats.total}</strong>
              <small>All requests created</small>
            </div>
          </article>

          <article className="request-summary-card">
            <div className="summary-icon active" aria-hidden="true">
              <span>↗</span>
            </div>
            <div className="summary-card-copy">
              <span>Active Requests</span>
              <strong>{stats.active}</strong>
              <small>Pending or matched</small>
            </div>
          </article>

          <article className="request-summary-card">
            <div className="summary-icon donors" aria-hidden="true">
              <span>♥</span>
            </div>
            <div className="summary-card-copy">
              <span>Accepted Donors</span>
              <strong>{stats.acceptedDonors}</strong>
              <small>Acceptance responses</small>
            </div>
          </article>
        </section>

        <section className="requests-content">
          <div className="requests-content-heading">
            <div>
              <span className="requests-eyebrow">YOUR ACTIVITY</span>
              <h2>Request Overview</h2>
              <p>
                Review requests, monitor responses, and update request status.
              </p>
            </div>

            <button
              type="button"
              className="refresh-requests-button"
              onClick={() => fetchRequests(true)}
              disabled={refreshing}
            >
              <span className={refreshing ? "refresh-spinning" : ""}>↻</span>
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          <div className="requests-toolbar">
            <label className="request-search">
              <span aria-hidden="true">⌕</span>
              <input
                type="search"
                placeholder="Search blood group, city, state..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                aria-label="Search blood requests"
              />
              {searchTerm && (
                <button
                  type="button"
                  className="clear-search-button"
                  onClick={() => setSearchTerm("")}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </label>

            <label className="request-filter">
              {/* <span>Status</span> */}
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                aria-label="Filter requests by status"
                className="select-filter"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="requests-results-line">
            <span>
              Showing <strong>{filteredRequests.length}</strong> of{" "}
              <strong>{requests.length}</strong> requests
            </span>

            {stats.critical > 0 && (
              <span className="critical-count">
                <span aria-hidden="true">!</span>
                {stats.critical} critical{" "}
                {stats.critical === 1 ? "request" : "requests"}
              </span>
            )}
          </div>

          {requests.length === 0 ? (
            <div className="requests-empty-state">
              <div className="empty-icon" aria-hidden="true">
                <span>+</span>
              </div>
              <span className="empty-eyebrow">A FRESH START</span>
              <h2>No blood requests yet</h2>
              <p>
                Your hospital hasn't created a request. Start by entering the
                required blood group, quantity, and location.
              </p>
              <Link to="/create-request" className="empty-create-button">
                Create Your First Request <span>→</span>
              </Link>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="requests-empty-state filtered-empty-state">
              <div className="empty-icon" aria-hidden="true">
                <span>⌕</span>
              </div>
              <h2>No matching requests</h2>
              <p>
                Try another search term or select a different status filter.
              </p>
              <button
                type="button"
                className="reset-filters-button"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }}
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="hospital-request-list">
              {filteredRequests.map((request) => {
                const status = request.status || "Pending";
                const normalizedStatus = status.toLowerCase();
                const urgency = request.urgency || "Normal";
                const isClosed = normalizedStatus === "closed";
                const isClosing = closingRequestId === request._id;

                return (
                  <article
                    className={`hospital-request-card ${
                      isClosed ? "closed-request-card" : ""
                    }`}
                    key={request._id}
                  >
                    <div className="hospital-request-top">
                      <div className="blood-request-title">
                        <div className="blood-group-badge">
                          {request.bloodGroup || "—"}
                          <span>Blood</span>
                        </div>

                        <div className="request-title-copy">
                          <span className="request-label">BLOOD REQUEST</span>
                          <h3>{request.bloodGroup || "Blood"} Request</h3>
                          <p>Created {formatDate(request.createdAt)}</p>
                        </div>
                      </div>

                      <div className="request-card-badges">
                        <span
                          className={`request-urgency ${urgency.toLowerCase()}`}
                        >
                          <span className="urgency-dot" />
                          {urgency}
                        </span>

                        <span
                          className={`request-status-badge ${normalizedStatus}`}
                        >
                          <span className="status-dot" />
                          {status}
                        </span>
                      </div>
                    </div>

                    <div className="hospital-request-details">
                      <div className="request-info-item">
                        <span className="detail-icon" aria-hidden="true">
                          ◈
                        </span>
                        <div>
                          <span>Units Needed</span>
                          <strong>{request.unitsNeeded ?? "—"}</strong>
                        </div>
                      </div>

                      <div className="request-info-item">
                        <span className="detail-icon" aria-hidden="true">
                          ⌖
                        </span>
                        <div>
                          <span>Required Location</span>
                          <strong>
                            {[request.city, request.state]
                              .filter(Boolean)
                              .join(", ") || "Not specified"}
                          </strong>
                        </div>
                      </div>

                      <div className="request-info-item donor-match-info">
                        <span className="detail-icon" aria-hidden="true">
                          ♥
                        </span>
                        <div>
                          <span>Accepted Donors</span>
                          <strong>{request.acceptedDonors || 0}</strong>
                          <small>
                            {(request.acceptedDonors || 0) === 1
                              ? "donor accepted"
                              : "donors accepted"}
                          </small>
                        </div>
                      </div>
                    </div>

                    {request.bloodComponentType && (
                      <div className="request-component-line">
                        <span>Blood component</span>
                        <strong>{request.bloodComponentType}</strong>
                      </div>
                    )}

                    {Array.isArray(request.specialProcessingNeeds) &&
                      request.specialProcessingNeeds.length > 0 && (
                        <div className="request-processing-line">
                          {request.specialProcessingNeeds.map((need) => (
                            <span key={need}>{need}</span>
                          ))}
                        </div>
                      )}

                    {isClosed && (
                      <div className="request-closed-note">
                        <span aria-hidden="true">✓</span>
                        This request is closed and is no longer counted as
                        active.
                      </div>
                    )}

                    <footer className="hospital-request-footer">
                      <span className="request-created-date">
                        <span aria-hidden="true">◷</span>
                        Created {formatDate(request.createdAt)}
                      </span>

                      <div className="request-actions">
                        <Link
                          to={`/my-requests/${request._id}`}
                          className="view-responses-button"
                        >
                          View Responses <span>→</span>
                        </Link>

                        {!isClosed && (
                          <button
                            type="button"
                            className="close-request-button"
                            onClick={() => handleCloseRequest(request)}
                            disabled={Boolean(closingRequestId)}
                          >
                            {isClosing ? (
                              <>
                                <span className="button-spinner" />
                                Closing...
                              </>
                            ) : (
                              "Close Request"
                            )}
                          </button>
                        )}
                      </div>
                    </footer>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <div className="requests-page-note">
          <span aria-hidden="true">♥</span>
          <p>
            <strong>Every donation matters.</strong> Keep your request details
            accurate so your hospital can coordinate blood needs more
            effectively.
          </p>
        </div>
      </div>
    </main>
  );
};

export default MyRequests;
