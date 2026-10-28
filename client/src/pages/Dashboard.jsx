import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isAvailable, setIsAvailable] = useState(Boolean(user?.isAvailable));
  const [updatingAvailability, setUpdatingAvailability] = useState(false);

  useEffect(() => {
    setIsAvailable(Boolean(user?.isAvailable));
  }, [user?.isAvailable]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  console.log(isAvailable);

  const handleAvailabilityToggle = async () => {
    if (!user?._id || updatingAvailability) return;

    const nextAvailability = !isAvailable;

    try {
      setUpdatingAvailability(true);

      const response = await api.put(`/auth/profile/${user._id}`, {
        isAvailable: nextAvailability,
      });

      if (!response.data.success) {
        toast.error(
          response.data.message || "Could not update your availability.",
        );
        return;
      }

      setIsAvailable(nextAvailability);
      console.log(setIsAvailable(nextAvailability));

      toast.success(
        nextAvailability
          ? "You are now available to donate."
          : "Your donor availability has been turned off.",
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update availability. Please try again.",
      );
    } finally {
      setUpdatingAvailability(false);
    }
  };

  if (!user) {
    return (
      <main className="dashboard-login-required">
        <div className="login-required-card">
          <div className="login-icon" aria-hidden="true">
            <span>✚</span>
          </div>

          <span className="dashboard-eyebrow">WELCOME TO LIFELINK</span>

          <h2>Login Required</h2>

          <p>
            Sign in to access your donor dashboard, manage your profile, and
            receive emergency blood request notifications.
          </p>

          <Link to="/login" className="dashboard-login-button">
            Go to Login <span aria-hidden="true">→</span>
          </Link>
        </div>
      </main>
    );
  }

  const isDonor = user.role === "donor";

  const donorFields = [
    user.fullName,
    user.email,
    user.phone,
    user.bloodGroup,
    user.genotype,
    user.gender,
    user.state,
    user.city,
    user.weight,
  ];

  const completedFields = donorFields.filter(
    (value) => String(value ?? "").trim() !== "",
  ).length;

  const profileCompletion = Math.round(
    (completedFields / donorFields.length) * 100,
  );

  const firstName = user.fullName?.trim().split(/\s+/)[0] || "Donor";

  return (
    <main className="dashboard-container">
      <div className="dashboard-wrapper">
        {/* Top navigation */}
        <header className="dashboard-topbar">
          <Link
            to="/dashboard"
            className="dashboard-brand-brand"
            aria-label="LifeLink home"
          >
            <span className="dashboard-brand-icon-icon" aria-hidden="true">
              ✚
            </span>

            <span>
              <strong>LifeLink</strong>
              <small>DONOR COMMUNITY</small>
            </span>
          </Link>

          <div className="dashboard-topbar-actions">
            <span className="dashboard-account-label">
              <span className="account-status-dot" />
              Donor Account
            </span>

            <button
              type="button"
              className="logout-button"
              onClick={handleLogout}
            >
              <span aria-hidden="true">↪</span>
              Logout
            </button>
          </div>
        </header>

        {isDonor ? (
          <>
            {/* Welcome hero */}
            <section className="dashboard-hero">
              <div className="dashboard-hero-content">
                <span className="dashboard-hero-eyebrow">
                  <span className="hero-live-dot" />
                  YOUR LIFE-SAVING JOURNEY
                </span>

                <h1>
                  Welcome back,
                  <br />
                  <span>{firstName}.</span>
                </h1>

                <p>
                  Every donation can make a difference. Keep your profile
                  updated and stay ready to help when someone needs you.
                </p>

                <div className="dashboard-hero-actions">
                  <Link to="/notifications" className="hero-primary-button">
                    <span aria-hidden="true">♡</span>
                    Emergency Requests
                    <span aria-hidden="true">→</span>
                  </Link>

                  <Link to="/profile" className="hero-secondary-button">
                    Manage Profile
                  </Link>
                </div>
              </div>

              <div className="dashboard-hero-visual" aria-hidden="true">
                <div className="hero-circle hero-circle-one" />
                <div className="hero-circle hero-circle-two" />

                <div className="hero-blood-card">
                  <span className="hero-blood-caption">YOUR BLOOD GROUP</span>
                  <strong>{user.bloodGroup || "—"}</strong>
                  <span className="hero-blood-heart">♥</span>
                </div>

                <div className="hero-floating-label">
                  <span className="floating-heart">♥</span>
                  <span>
                    <strong>Be someone's hero</strong>
                    <small>One donation matters</small>
                  </span>
                </div>
              </div>
            </section>

            {/* Availability and profile completion */}
            <section className="dashboard-highlight-grid">
              <article className="profile-progress-card">
                <div className="highlight-card-top">
                  <div className="highlight-icon profile-progress-icon">
                    <span aria-hidden="true">▤</span>
                  </div>

                  <span className="progress-percent">{profileCompletion}%</span>
                </div>

                <h2>Your profile strength</h2>

                <p>
                  Keep your details complete so your donor information is ready
                  when it's needed.
                </p>

                <div
                  className="profile-progress-track"
                  role="progressbar"
                  aria-label="Donor profile completion"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={profileCompletion}
                >
                  <div
                    className="profile-progress-fill"
                    style={{ width: `${profileCompletion}%` }}
                  />
                </div>

                <Link to="/profile" className="progress-link">
                  {profileCompletion === 100
                    ? "Review your profile"
                    : "Complete your profile"}
                  <span aria-hidden="true">→</span>
                </Link>
              </article>
            </section>

            {/* Donor information */}
            <section className="dashboard-section">
              <div className="dashboard-section-heading">
                <div>
                  <span className="section-eyebrow">YOUR INFORMATION</span>
                  <h2>Donor Overview</h2>
                  <p>A quick look at your current donor details.</p>
                </div>

                <Link to="/profile" className="section-text-link">
                  Edit Details <span aria-hidden="true">→</span>
                </Link>
              </div>

              <div className="donor-overview-grid">
                <article className="donor-info-card blood-type-card">
                  <div className="donor-info-icon blood-type-icon">♥</div>

                  <div className="donor-info-copy">
                    <span>Blood Group</span>
                    <strong>{user.bloodGroup || "Not set"}</strong>
                    <small>Used to identify potential matches</small>
                  </div>
                </article>

                <article className="donor-info-card">
                  <div className="donor-info-icon genotype-icon">DNA</div>

                  <div className="donor-info-copy">
                    <span>Genotype</span>
                    <strong>{user.genotype || "Not provided"}</strong>
                    <small>Your registered genotype</small>
                  </div>
                </article>

                <article className="donor-info-card">
                  <div className="donor-info-icon location-icon">⌖</div>

                  <div className="donor-info-copy">
                    <span>Location</span>
                    <strong>{user.city || "City not provided"}</strong>
                    <small>{user.state || "State not provided"}</small>
                  </div>
                </article>

                <article className="donor-info-card">
                  <div className="donor-info-icon account-icon">✓</div>

                  <div className="donor-info-copy">
                    <span>Donor Status</span>
                    <strong
                      className={
                        isAvailable
                          ? "donor-status-text status-text-on"
                          : "donor-status-text status-text-off"
                      }
                    >
                      {isAvailable ? "Available" : "Unavailable"}
                    </strong>
                    <small>
                      {user.isVerified
                        ? "Account verified"
                        : "Account verification pending"}
                    </small>
                  </div>
                </article>
              </div>
            </section>

            {/* Quick actions */}
            <section className="dashboard-section quick-actions-section">
              <div className="dashboard-section-heading">
                <div>
                  <span className="section-eyebrow">STAY CONNECTED</span>
                  <h2>Quick Actions</h2>
                  <p>Everything you need to manage your donor account.</p>
                </div>
              </div>

              <div className="dashboard-actions">
                <Link to="/profile" className="dashboard-action profile-action">
                  <div className="action-icon action-profile-icon">
                    <span aria-hidden="true">♙</span>
                  </div>

                  <div className="action-content">
                    <span className="action-number">01 / PROFILE</span>
                    <h3>My Profile</h3>
                    <p>
                      Update your personal details, blood group, and location.
                    </p>
                    <span className="action-link">
                      Manage Profile <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </Link>

                <Link
                  to="/notifications"
                  className="dashboard-action notification-action"
                >
                  <div className="action-icon action-notification-icon">
                    <span aria-hidden="true">♧</span>
                  </div>

                  <div className="action-content">
                    <span className="action-number">02 / ALERTS</span>
                    <h3>Emergency Notifications</h3>
                    <p>
                      Check blood request alerts and review requests that may
                      need your help.
                    </p>
                    <span className="action-link">
                      View Notifications <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </Link>
              </div>
            </section>

            {/* Encouragement banner */}
            <section className="dashboard-motivation">
              <div className="motivation-symbol" aria-hidden="true">
                ♥
              </div>

              <div>
                <span className="motivation-eyebrow">THE POWER TO HELP</span>
                <h2>Someone's emergency could be your opportunity to help.</h2>
                <p>
                  Keep your donor information accurate and check your
                  notifications regularly.
                </p>
              </div>

              <Link to="/notifications" className="motivation-link">
                Check Alerts <span aria-hidden="true">→</span>
              </Link>
            </section>
          </>
        ) : (
          <section className="dashboard-other-role">
            <div className="other-role-icon" aria-hidden="true">
              ✚
            </div>
            <span className="dashboard-eyebrow">LIFELINK ACCOUNT</span>
            <h1>Welcome, {user.fullName || "User"}</h1>
            <p>
              This dashboard is designed for donor accounts. Use your account's
              dedicated dashboard to manage your activities.
            </p>

            <div className="other-role-actions">
              <Link to="/hospital-dashboard" className="dashboard-login-button">
                Go to Hospital Dashboard
              </Link>

              <Link to="/profile" className="other-role-profile-link">
                View Profile →
              </Link>
            </div>
          </section>
        )}

        <footer className="dashboard-footer">
          <Link to="/" className="footer-brand">
            <span aria-hidden="true">✚</span> LifeLink
          </Link>

          <p>Connecting willing donors with people in need.</p>

          <span className="footer-copyright">
            Every donor can make a difference.
          </span>
        </footer>
      </div>
    </main>
  );
};

export default Dashboard;
