import React from "react";
import { Link } from "react-router-dom";
import "../styles/Hero.css";

const Hero = () => {
  return (
    <section className="hero">
      {/* Dark overlay */}
      <div className="hero-overlay"></div>

      <div className="hero-container">
        <div className="hero-content">
          <h1>
            Donate Blood, Keep
            <br />
            the World Beating
          </h1>

          <p>
            Your donation can save lives. Connect with people who need blood and
            help make emergency blood available when it matters most.
          </p>

          <div className="hero-buttons">
            <Link to="/" className="hero-primary-button">
              Discover More
            </Link>

            <Link to="/register" className="hero-secondary-button">
              Start Donating
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
