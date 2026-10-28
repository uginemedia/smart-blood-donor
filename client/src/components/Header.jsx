import React, { useState } from "react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Logo from "../assets/logo.png";
import "../styles/Header.css";

const Header = () => {
  const { user, logout } = useContext(AuthContext);

  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
  };

  return (
    <header className="site-header">
      <div className="header-container">
        {/* LOGO */}
        <Link to="/" className="logo">
          <img src={Logo} alt="Logo" className="logo-image" />
        </Link>

        {/* =========================
            LOGGED IN
        ========================= */}
        {user ? (
          <div className="logged-in-section">
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <>
            {/* =========================
                NOT LOGGED IN
            ========================= */}
            <nav className={`navbar ${menuOpen ? "navbar-open" : ""}`}>
              <Link to="/" className="nav-link">
                Home
              </Link>

              <Link to="/" className="nav-link">
                About
              </Link>

              {/* Services */}
              <div className="nav-dropdown">
                <button
                  className="nav-dropdown-button"
                  onClick={() => toggleDropdown("services")}
                >
                  Services
                </button>

                {openDropdown === "services" && (
                  <div className="dropdown-menu">
                    <Link to="/">Blood Donation</Link>

                    <Link to="/">Donor Matching</Link>

                    <Link to="/">Emergency Requests</Link>
                  </div>
                )}
              </div>

              <Link to="/" className="nav-link">
                Events
              </Link>

              {/* Blog */}
              <div className="nav-dropdown">
                <button
                  className="nav-dropdown-button"
                  onClick={() => toggleDropdown("blog")}
                >
                  Blog
                </button>

                {openDropdown === "blog" && (
                  <div className="dropdown-menu">
                    <Link to="/">Latest Articles</Link>

                    <Link to="/">Blood Health</Link>

                    <Link to="/">Donation Tips</Link>
                  </div>
                )}
              </div>

              {/* Pages */}
              <div className="nav-dropdown">
                <button
                  className="nav-dropdown-button"
                  onClick={() => toggleDropdown("pages")}
                >
                  Pages
                </button>

                {openDropdown === "pages" && (
                  <div className="dropdown-menu">
                    <Link to="/">Contact</Link>

                    <Link to="/">FAQ</Link>

                    <Link to="/login">Login</Link>

                    <Link to="/register">Register</Link>
                  </div>
                )}
              </div>

              {/* Donation Button */}
              <div>
                <Link to="/login" className="donation-button">
                Login to Donate
              </Link>
              </div>
            </nav>

            {/* MOBILE MENU */}
            <button
              className="menu-button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle navigation"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
