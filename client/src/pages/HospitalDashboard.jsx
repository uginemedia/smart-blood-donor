import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import "../styles/HospitalDashboard.css";

const getId = (value) =>
  typeof value === "object" && value !== null
    ? String(value._id || value.id || "")
    : String(value || "");

const getStatus = (status) => String(status || "Pending").toLowerCase();

const formatDate = (date) => {
  if (!date) return "Date unavailable";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "Date unavailable";

  return parsed.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getRequestStatus = (request) => request.status || "Pending";

function Dashboard() {
  const { user, logout } = React.useContext(AuthContext);

  const [requests, setRequests] = useState([]);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const hospitalId = user?._id || user?.id;

  const fetchDashboard = useCallback(
    async (isRefresh = false) => {
      if (!hospitalId) {
        setLoading(false);
        setError(
          "Hospital account information is unavailable. Please sign in again.",
        );
        return;
      }

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      try {
        const requestResponse = await api.get(
          `/blood-requests/hospital/${hospitalId}`,
        );

        const requestData =
          requestResponse.data.requests ||
          requestResponse.data.bloodRequests ||
          [];

        setRequests(requestData);

        const responseGroups = await Promise.all(
          requestData.map(async (request) => {
            try {
              const result = await api.get(`/donations/request/${request._id}`);

              return result.data.donations || result.data.responses || [];
            } catch (err) {
              console.error(
                `Could not load responses for request ${request._id}:`,
                err,
              );

              return [];
            }
          }),
        );

        setResponses(responseGroups.flat());
      } catch (err) {
        console.error("Dashboard loading error:", err);
        setError(
          err.response?.data?.message ||
            "Unable to load your dashboard. Please try again.",
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [hospitalId],
  );

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const stats = useMemo(() => {
    const accepted = responses.filter(
      (response) => getStatus(response.status) === "accepted",
    );

    const declined = responses.filter(
      (response) => getStatus(response.status) === "declined",
    );

    const pending = requests.filter(
      (request) => getStatus(request.status) === "pending",
    );

    return {
      total: requests.length,
      accepted: accepted.length,
      declined: declined.length,
      pending: pending.length,
      totalResponses: responses.length,
    };
  }, [requests, responses]);

  const recentRequests = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return [...requests]
      .filter((request) => {
        const matchesFilter =
          filter === "all" || getStatus(request.status) === filter;

        const searchableText = [
          request.bloodGroup,
          request.city,
          request.state,
          request.bloodComponentType,
          request.urgency,
          request.status,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return (
          matchesFilter &&
          (!normalizedSearch || searchableText.includes(normalizedSearch))
        );
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime(),
      )
      .slice(0, 5);
  }, [requests, filter, search]);

  const responseForRequest = (requestId) =>
    responses.filter(
      (response) => getId(response.bloodRequest) === String(requestId),
    );

  const getRequestCounts = (requestId) => {
    const requestResponses = responseForRequest(requestId);

    return {
      accepted: requestResponses.filter(
        (response) => getStatus(response.status) === "accepted",
      ).length,
      declined: requestResponses.filter(
        (response) => getStatus(response.status) === "declined",
      ).length,
    };
  };

  const hospitalName = user?.hospitalName || user?.fullName || "Hospital";

  const firstName = hospitalName.trim().split(/\s+/)[0];

  const statusClass = (status) => {
    const normalized = getStatus(status).replace(/\s+/g, "-");

    return `dashboard-status status-${normalized}`;
  };

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      window.location.href = "/";
    }
  };

  return (
    <div className="hospital-dashboard">
      <aside
        className={`dashboard-sidebar ${mobileMenuOpen ? "sidebar-open" : ""}`}
      >
        <Link
          to="/hospital-dashboard"
          className="dashboard-brand"
          onClick={() => setMobileMenuOpen(false)}
        >
          <span className="dashboard-brand-icon">✚</span>
          <span>
            <strong>
              Life<span>Link</span>
            </strong>
            <small>HOSPITAL PORTAL</small>
          </span>
        </Link>

        <div className="sidebar-section-label">WORKSPACE</div>

        <nav className="dashboard-navigation">
          <Link
            to="/hospital-dashboard"
            className="dashboard-nav-link nav-active"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="nav-icon">▦</span>
            Overview
          </Link>

          <Link
            to="/create-request"
            className="dashboard-nav-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="nav-icon">＋</span>
            Create blood request
          </Link>

          <Link
            to="/my-requests"
            className="dashboard-nav-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="nav-icon">▤</span>
            My blood requests
            <span className="nav-count">{requests.length}</span>
          </Link>

          <div className="sidebar-section-label sidebar-section-spaced">
            ACCOUNT
          </div>

          <Link
            to="/hospital-profile"
            className="dashboard-nav-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="nav-icon">♙</span>
            Hospital profile
          </Link>
        </nav>

        <div className="sidebar-help-card">
          <div className="sidebar-help-icon">♥</div>
          <strong>Every response matters.</strong>
          <p>
            Keep your hospital information up to date to support better
            coordination.
          </p>
          <Link to="/hospital-profile">
            View your profile <span>→</span>
          </Link>
        </div>

        <button
          className="dashboard-logout"
          type="button"
          onClick={handleLogout}
        >
          <span className="nav-icon">↪</span>
          Sign out
        </button>

        <div className="sidebar-version">LIFELINK · HOSPITAL PORTAL</div>
      </aside>

      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="dashboard-sidebar-overlay"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <button
            type="button"
            className="dashboard-menu-toggle"
            aria-label="Toggle navigation"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            ☰
          </button>

          <div className="dashboard-breadcrumb">
            <span>Workspace</span>
            <span className="breadcrumb-separator">/</span>
            <strong>Overview</strong>
          </div>

          <div className="dashboard-topbar-actions">
            <button
              type="button"
              className={`dashboard-refresh ${
                refreshing ? "is-refreshing" : ""
              }`}
              onClick={() => fetchDashboard(true)}
              disabled={loading || refreshing}
              title="Refresh dashboard"
            >
              <span>↻</span>
              <span className="refresh-label">
                {refreshing ? "Refreshing..." : "Refresh"}
              </span>
            </button>

            <Link to="/hospital-profile" className="dashboard-user">
              <span className="dashboard-user-avatar">
                {hospitalName.charAt(0).toUpperCase()}
              </span>
              <span className="dashboard-user-copy">
                <strong>{hospitalName}</strong>
                <small>Hospital account</small>
              </span>
              <span className="user-chevron">⌄</span>
            </Link>
          </div>
        </header>

        <div className="dashboard-content">
          <section className="dashboard-welcome">
            <div>
              <div className="dashboard-date-label">
                <span className="welcome-pulse" />
                HOSPITAL CONTROL CENTRE
              </div>
              <h1>
                Good day, {firstName} <span>✳</span>
              </h1>
              <p>
                Here’s an overview of your blood requests and donor responses.
              </p>
            </div>

            <Link to="/create-request" className="dashboard-create-button">
              <span>＋</span>
              Create blood request
            </Link>
          </section>

          {error && (
            <div className="dashboard-error" role="alert">
              <span>!</span>
              <div>
                <strong>Unable to fully load your dashboard</strong>
                <p>{error}</p>
              </div>
              <button type="button" onClick={() => fetchDashboard(true)}>
                Try again
              </button>
            </div>
          )}

          <section
            className="dashboard-stat-grid"
            aria-label="Hospital statistics"
          >
            <article className="dashboard-stat-card stat-total">
              <div className="stat-card-top">
                <span className="stat-icon">▤</span>
                <span className="stat-period">ALL TIME</span>
              </div>
              <p>Total blood requests</p>
              <div className="stat-value">{loading ? "—" : stats.total}</div>
              <div className="stat-card-bottom">
                <span className="stat-bottom-dot" />
                All requests created by your hospital
              </div>
            </article>

            <article className="dashboard-stat-card stat-accepted">
              <div className="stat-card-top">
                <span className="stat-icon">✓</span>
                <span className="stat-period">DONOR RESPONSES</span>
              </div>
              <p>Accepted responses</p>
              <div className="stat-value">{loading ? "—" : stats.accepted}</div>
              <div className="stat-card-bottom">
                <span className="stat-bottom-dot" />
                Users who accepted requests
              </div>
            </article>

            <article className="dashboard-stat-card stat-declined">
              <div className="stat-card-top">
                <span className="stat-icon">↙</span>
                <span className="stat-period">DONOR RESPONSES</span>
              </div>
              <p>Declined responses</p>
              <div className="stat-value">{loading ? "—" : stats.declined}</div>
              <div className="stat-card-bottom">
                <span className="stat-bottom-dot" />
                Users who declined requests
              </div>
            </article>

            <article className="dashboard-stat-card stat-pending">
              <div className="stat-card-top">
                <span className="stat-icon">◷</span>
                <span className="stat-period">REQUEST STATUS</span>
              </div>
              <p>Pending requests</p>
              <div className="stat-value">{loading ? "—" : stats.pending}</div>
              <div className="stat-card-bottom">
                <span className="stat-bottom-dot" />
                Requests marked as pending
              </div>
            </article>
          </section>

          <section className="dashboard-quick-actions">
            <div className="dashboard-section-heading">
              <div>
                <span className="dashboard-section-kicker">SHORTCUTS</span>
                <h2>Quick actions</h2>
              </div>
              <span className="section-heading-note">
                Get things done faster
              </span>
            </div>

            <div className="quick-action-grid">
              <Link
                to="/create-request"
                className="quick-action-card quick-action-red"
              >
                <span className="quick-action-icon">＋</span>
                <span className="quick-action-copy">
                  <strong>New blood request</strong>
                  <small>Submit blood requirements</small>
                </span>
                <span className="quick-action-arrow">↗</span>
              </Link>

              <Link to="/my-requests" className="quick-action-card">
                <span className="quick-action-icon">▤</span>
                <span className="quick-action-copy">
                  <strong>Manage requests</strong>
                  <small>Review request status</small>
                </span>
                <span className="quick-action-arrow">↗</span>
              </Link>
              {/* 
              <Link to="/hospital-dashboard" className="quick-action-card">
                <span className="quick-action-icon">♧</span>
                <span className="quick-action-copy">
                  <strong>View notifications</strong>
                  <small>Check recent updates</small>
                </span>
                <span className="quick-action-arrow">↗</span>
              </Link> */}

              <Link to="/hospital-profile" className="quick-action-card">
                <span className="quick-action-icon">♙</span>
                <span className="quick-action-copy">
                  <strong>Hospital profile</strong>
                  <small>Update your information</small>
                </span>
                <span className="quick-action-arrow">↗</span>
              </Link>
            </div>
          </section>

          <section className="dashboard-lower-grid">
            <div className="dashboard-panel recent-requests-panel">
              <div className="dashboard-panel-heading">
                <div>
                  <span className="dashboard-section-kicker">
                    REQUEST ACTIVITY
                  </span>
                  <h2>Recent blood requests</h2>
                  <p>Keep track of your latest requests.</p>
                </div>
                <Link to="/my-requests" className="panel-view-all">
                  View all <span>→</span>
                </Link>
              </div>

              <div className="request-tools">
                <label className="request-search">
                  <span>⌕</span>
                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search blood group or location"
                    aria-label="Search blood requests"
                  />
                </label>

                <select
                  className="request-filter"
                  value={filter}
                  onChange={(event) => setFilter(event.target.value)}
                  aria-label="Filter blood requests by status"
                >
                  <option value="all">All statuses</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="declined">Declined</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {loading ? (
                <div className="dashboard-empty-state">
                  <span className="dashboard-loader" />
                  <p>Loading your blood requests...</p>
                </div>
              ) : recentRequests.length === 0 ? (
                <div className="dashboard-empty-state">
                  <span className="empty-state-icon">▤</span>
                  <strong>No matching blood requests</strong>
                  <p>
                    {requests.length === 0
                      ? "Create your first request to get started."
                      : "Try another search or change the status filter."}
                  </p>
                  {requests.length === 0 && (
                    <Link to="/create-request" className="empty-state-link">
                      Create blood request →
                    </Link>
                  )}
                </div>
              ) : (
                <div className="dashboard-request-list">
                  {recentRequests.map((request) => {
                    const counts = getRequestCounts(request._id);

                    return (
                      <article
                        className="dashboard-request-row"
                        key={request._id}
                      >
                        <div className="request-blood-badge">
                          <strong>{request.bloodGroup || "—"}</strong>
                          <small>BLOOD</small>
                        </div>

                        <div className="request-row-main">
                          <div className="request-row-title">
                            <strong>
                              {request.bloodComponentType || "Blood request"}
                            </strong>
                            <span className={statusClass(request.status)}>
                              {getRequestStatus(request)}
                            </span>
                          </div>
                          <div className="request-row-meta">
                            <span>
                              <span>⌖</span>{" "}
                              {[request.city, request.state]
                                .filter(Boolean)
                                .join(", ") || "Location not specified"}
                            </span>
                            <span>
                              <span>▤</span> {request.unitsNeeded ?? "—"} units
                            </span>
                            <span>{formatDate(request.createdAt)}</span>
                          </div>
                          <div className="request-response-summary">
                            <span className="accepted-text">
                              ✓ {counts.accepted} accepted
                            </span>
                            <span className="declined-text">
                              ↙ {counts.declined} declined
                            </span>
                          </div>
                        </div>

                        <Link
                          to={`/my-requests/${request._id}`}
                          className="request-row-action"
                          aria-label={`View request for ${request.bloodGroup || "blood"}`}
                          title="View request"
                        >
                          →
                        </Link>
                      </article>
                    );
                  })}
                </div>
              )}

              <div className="request-list-footer">
                Showing up to 5 recent requests
                <span>{requests.length} total</span>
              </div>
            </div>

            <div className="dashboard-side-panels">
              <section className="dashboard-panel response-panel">
                <div className="dashboard-panel-heading compact-heading">
                  <div>
                    <span className="dashboard-section-kicker">
                      DONOR ACTIVITY
                    </span>
                    <h2>Response overview</h2>
                  </div>
                </div>

                {loading ? (
                  <div className="dashboard-empty-state small-empty">
                    <span className="dashboard-loader" />
                    <p>Loading responses...</p>
                  </div>
                ) : (
                  <>
                    <div className="response-total">
                      <strong>{stats.totalResponses}</strong>
                      <span>Total donor responses</span>
                    </div>

                    <div
                      className="response-bar"
                      aria-label="Accepted and declined response proportions"
                    >
                      {stats.totalResponses > 0 && (
                        <>
                          <span
                            className="response-bar-accepted"
                            style={{
                              width: `${(stats.accepted / stats.totalResponses) * 100}%`,
                            }}
                          />
                          <span
                            className="response-bar-declined"
                            style={{
                              width: `${(stats.declined / stats.totalResponses) * 100}%`,
                            }}
                          />
                          <span
                            className="response-bar-other"
                            style={{
                              width: `${Math.max(
                                0,
                                ((stats.totalResponses -
                                  stats.accepted -
                                  stats.declined) /
                                  stats.totalResponses) *
                                  100,
                              )}%`,
                            }}
                          />
                        </>
                      )}
                    </div>

                    <div className="response-legend">
                      <div>
                        <span className="legend-dot legend-accepted" />
                        <span>Accepted</span>
                        <strong>{stats.accepted}</strong>
                      </div>
                      <div>
                        <span className="legend-dot legend-declined" />
                        <span>Declined</span>
                        <strong>{stats.declined}</strong>
                      </div>
                      <div>
                        <span className="legend-dot legend-other" />
                        <span>Other responses</span>
                        <strong>
                          {Math.max(
                            0,
                            stats.totalResponses -
                              stats.accepted -
                              stats.declined,
                          )}
                        </strong>
                      </div>
                    </div>
                  </>
                )}
              </section>

              <section className="dashboard-reminder-panel">
                <div className="reminder-icon">♥</div>
                <span className="dashboard-section-kicker">
                  A HELPFUL REMINDER
                </span>
                <h3>Keep your hospital profile current.</h3>
                <p>
                  Accurate contact and location details help support
                  coordination when requests are urgent.
                </p>
                <Link to="/hospital-profile">
                  Review profile <span>→</span>
                </Link>
              </section>
            </div>
          </section>

          <footer className="dashboard-footer">
            <span>© {new Date().getFullYear()} LifeLink · Hospital Portal</span>
            <span>Connecting hospitals and potential blood donors.</span>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
