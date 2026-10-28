import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";

const faqs = [
  {
    question: "How does the blood donor matching system work?",
    answer:
      "Hospitals submit blood requests with the required blood group and location. The system helps identify suitable registered donors and makes emergency requests visible through notifications.",
  },
  {
    question: "Can I register as a blood donor?",
    answer:
      "Yes. Create a donor account, complete your profile, and provide your blood group and location so hospitals can identify potentially suitable donors.",
  },
  {
    question: "Can a hospital submit emergency blood requests?",
    answer:
      "Yes. Hospitals can register, sign in, create blood requests, specify their requirements, and monitor donor responses from their dashboard.",
  },
  {
    question: "Is registering as a donor a guarantee that I can donate?",
    answer:
      "No. Registration helps with matching and communication. Actual eligibility and compatibility must be confirmed by qualified healthcare professionals.",
  },
];

const features = [
  {
    number: "01",
    icon: "⌕",
    title: "Smart donor matching",
    description:
      "Help hospitals identify potentially suitable donors using blood group and location information.",
  },
  {
    number: "02",
    icon: "♧",
    title: "Emergency notifications",
    description:
      "Make urgent blood requests visible to registered users so potential donors can respond quickly.",
  },
  {
    number: "03",
    icon: "↗",
    title: "Request tracking",
    description:
      "Give hospitals a clear view of their requests and the responses received from potential donors.",
  },
];

function BloodDrop({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 120"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M50 5C40 24 12 54 12 78a38 38 0 0 0 76 0C88 54 60 24 50 5Z"
        fill="currentColor"
      />
      <path
        d="M30 78c0 12 8 21 20 23"
        stroke="white"
        strokeWidth="5"
        strokeLinecap="round"
        opacity=".75"
      />
    </svg>
  );
}

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="landing-page">
      <div className="top-strip">
        <div className="landing-container top-strip-inner">
          <span>
            <span className="status-dot" />
            Connecting donors with hospitals when every moment matters
          </span>
          <a href="#how-it-works">
            Discover how it works <span>↗</span>
          </a>
        </div>
      </div>

      <header className="landing-header">
        <div className="landing-container nav-inner">
          <Link to="/" className="brand" onClick={closeMenu}>
            <span className="brand-mark">
              <BloodDrop />
              <span className="brand-plus">+</span>
            </span>
            <span className="brand-copy">
              <strong>
                Life<span>Link</span>
              </strong>
              <small>SMART BLOOD DONOR NETWORK</small>
            </span>
          </Link>

          <button
            className="mobile-menu-button"
            type="button"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span>{menuOpen ? "✕" : "☰"}</span>
          </button>

          <nav className={`landing-nav ${menuOpen ? "nav-open" : ""}`}>
            <a href="#about" onClick={closeMenu}>
              About us
            </a>
            <a href="#how-it-works" onClick={closeMenu}>
              How it works
            </a>
            <a href="#features" onClick={closeMenu}>
              Our features
            </a>
            <a href="#faq" onClick={closeMenu}>
              FAQs
            </a>
            <div className="mobile-nav-actions">
              <Link to="/login" className="nav-login" onClick={closeMenu}>
                Sign in
              </Link>
              <Link
                to="/hospital-register"
                className="nav-cta"
                onClick={closeMenu}
              >
                Register hospital <span>↗</span>
              </Link>
            </div>
          </nav>

          <div className="desktop-nav-actions">
            <Link to="/login" className="nav-login">
              Sign in
            </Link>
            <Link to="/hospital-register" className="nav-cta">
              For hospitals <span>↗</span>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-orb hero-orb-one" />
          <div className="hero-orb hero-orb-two" />

          <div className="landing-container hero-grid">
            <div className="hero-content">
              <div className="eyebrow">
                <span className="eyebrow-icon">✳</span>
                TECHNOLOGY WITH A HUMAN HEART
              </div>

              <h1>
                When every second counts,
                <span> connection saves lives.</span>
              </h1>

              <p className="hero-description">
                A smarter way for hospitals to connect with potential blood
                donors, share urgent requests, and coordinate responses when
                they matter most.
              </p>

              <div className="hero-actions">
                <Link to="/hospital-register" className="button-primary">
                  Register your hospital <span>↗</span>
                </Link>
                <Link to="/register" className="button-secondary">
                  <span className="play-icon">♡</span>
                  Become a donor
                </Link>
              </div>

              <div className="hero-proof">
                <div className="proof-avatars" aria-hidden="true">
                  <span>♥</span>
                  <span>✚</span>
                  <span>♥</span>
                  <span>+</span>
                </div>
                <div>
                  <strong>One network. A shared mission.</strong>
                  <p>Bringing donors and hospitals closer together.</p>
                </div>
              </div>
            </div>

            <div
              className="hero-visual"
              aria-label="Blood donation network illustration"
            >
              <div className="visual-backdrop" />
              <div className="visual-label label-top">
                <span className="label-icon">✚</span>
                <span>
                  <strong>Hospital requests</strong>
                  <small>Connect with potential donors</small>
                </span>
                <span className="label-check">✓</span>
              </div>

              <div className="hero-art">
                <div className="art-ring ring-one" />
                <div className="art-ring ring-two" />
                <div className="art-cross cross-one">+</div>
                <div className="art-cross cross-two">+</div>
                <div className="art-heart">♥</div>
                <div className="art-drop">
                  <BloodDrop />
                  <span>
                    GIVE
                    <br />
                    LIFE
                  </span>
                </div>
                <div className="orbit-node node-one">
                  <span>✚</span>
                </div>
                <div className="orbit-node node-two">
                  <span>♥</span>
                </div>
                <div className="orbit-node node-three">
                  <span>+</span>
                </div>
                <div className="orbit-node node-four">
                  <span>♥</span>
                </div>
              </div>

              <div className="visual-label label-bottom">
                <span className="label-bottom-icon">↗</span>
                <span>
                  <strong>Every response matters</strong>
                  <small>One step closer to helping</small>
                </span>
              </div>

              <div className="floating-note">
                <span className="floating-note-icon">♡</span>
                <span>
                  <strong>Be someone's hope.</strong>
                  <small>Be part of the network.</small>
                </span>
              </div>
            </div>
          </div>

          <div className="landing-container hero-bottom">
            <span>BUILT AROUND THREE SIMPLE IDEAS</span>
            <div>
              <span>01</span> CONNECT
            </div>
            <div>
              <span>02</span> NOTIFY
            </div>
            <div>
              <span>03</span> RESPOND
            </div>
          </div>
        </section>

        <section className="mission-section" id="about">
          <div className="landing-container mission-grid">
            <div className="mission-heading">
              <span className="section-kicker">WHY LIFELINK?</span>
              <h2>
                Make the connection. <span>Make a difference.</span>
              </h2>
            </div>
            <div className="mission-copy">
              <p>
                Finding potential blood donors should not be an overwhelming
                process during an emergency. LifeLink brings donor information,
                hospital requests, and response tracking into one accessible
                digital platform.
              </p>
              <a href="#features" className="text-link">
                Explore the platform <span>→</span>
              </a>
            </div>
          </div>

          <div className="landing-container impact-grid">
            <article className="impact-card impact-red">
              <div className="impact-icon">
                <span>⌕</span>
              </div>
              <div className="impact-number">01</div>
              <h3>Find potential matches</h3>
              <p>
                Help hospitals identify donors based on relevant blood group and
                location information.
              </p>
            </article>
            <article className="impact-card">
              <div className="impact-icon">
                <span>♧</span>
              </div>
              <div className="impact-number">02</div>
              <h3>Share urgent requests</h3>
              <p>
                Keep blood requests visible to registered users through the
                platform's notification system.
              </p>
            </article>
            <article className="impact-card">
              <div className="impact-icon">
                <span>↗</span>
              </div>
              <div className="impact-number">03</div>
              <h3>Track responses</h3>
              <p>
                Let hospitals monitor responses and manage their blood requests
                in one place.
              </p>
            </article>
          </div>
        </section>

        <section className="how-section" id="how-it-works">
          <div className="landing-container">
            <div className="section-heading centered-heading">
              <span className="section-kicker">A CLEARER WAY FORWARD</span>
              <h2>
                Three steps. <span>One shared purpose.</span>
              </h2>
              <p>
                Designed to make the journey from a blood request to a donor
                response easier to follow.
              </p>
            </div>

            <div className="steps-grid">
              <article className="step-card">
                <div className="step-top">
                  <span className="step-icon">▣</span>
                  <span className="step-number">STEP 01</span>
                </div>
                <h3>Create a request</h3>
                <p>
                  A hospital registers, enters its blood requirements, and
                  submits a request through its dashboard.
                </p>
                <span className="step-line" />
              </article>
              <article className="step-card">
                <div className="step-top">
                  <span className="step-icon">♧</span>
                  <span className="step-number">STEP 02</span>
                </div>
                <h3>Connect with donors</h3>
                <p>
                  The system supports donor matching and shares request
                  notifications with registered users.
                </p>
                <span className="step-line" />
              </article>
              <article className="step-card">
                <div className="step-top">
                  <span className="step-icon">✓</span>
                  <span className="step-number">STEP 03</span>
                </div>
                <h3>Review responses</h3>
                <p>
                  Hospitals can review donor responses and keep track of their
                  requests from one dashboard.
                </p>
                <span className="step-line" />
              </article>
            </div>
          </div>
        </section>

        <section className="features-section" id="features">
          <div className="landing-container features-grid">
            <div className="features-intro">
              <span className="section-kicker">THE PLATFORM</span>
              <h2>
                Built for better coordination. <span>Designed for people.</span>
              </h2>
              <p>
                Practical tools that help hospitals and potential donors stay
                connected, informed, and organised.
              </p>
              <Link to="/hospital-register" className="button-primary">
                Get started <span>↗</span>
              </Link>
              <div className="features-note">
                <span>✳</span>
                <p>
                  Digital coordination supports care. Clinical teams must still
                  verify donor eligibility and blood compatibility.
                </p>
              </div>
            </div>

            <div className="feature-list">
              {features.map((feature) => (
                <article className="feature-row" key={feature.number}>
                  <div className="feature-row-icon">{feature.icon}</div>
                  <div className="feature-row-copy">
                    <span>FEATURE {feature.number}</span>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </div>
                  <span className="feature-arrow">↗</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="join-section">
          <div className="landing-container join-panel">
            <div className="join-decoration join-decoration-one" />
            <div className="join-decoration join-decoration-two" />
            <div className="join-copy">
              <span className="join-kicker">BE PART OF THE CONNECTION</span>
              <h2>Someone out there may need the help you can give.</h2>
              <p>
                Join the network as a donor or register your hospital to
                coordinate blood requests more easily.
              </p>
            </div>
            <div className="join-actions">
              <Link to="/register" className="join-button-light">
                <span>♡</span> Register as a donor <span>↗</span>
              </Link>
              <Link to="/hospital-register" className="join-button-outline">
                Register a hospital <span>↗</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="faq-section" id="faq">
          <div className="landing-container faq-grid">
            <div className="faq-intro">
              <span className="section-kicker">GOOD TO KNOW</span>
              <h2>
                Questions? <span>We've got answers.</span>
              </h2>
              <p>Learn more about joining and using the blood donor network.</p>
              <Link to="/login" className="text-link">
                Already registered? Sign in <span>→</span>
              </Link>
            </div>

            <div className="faq-list">
              {faqs.map((faq, index) => (
                <article
                  className={`faq-item ${openFaq === index ? "faq-active" : ""}`}
                  key={faq.question}
                >
                  <button
                    className="faq-question"
                    type="button"
                    aria-expanded={openFaq === index}
                    onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                  >
                    <span>{faq.question}</span>
                    <span className="faq-toggle">
                      {openFaq === index ? "−" : "+"}
                    </span>
                  </button>
                  {openFaq === index && (
                    <p className="faq-answer">{faq.answer}</p>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="landing-container footer-main">
          <div className="footer-brand">
            <Link to="/" className="brand">
              <span className="brand-mark">
                <BloodDrop />
                <span className="brand-plus">+</span>
              </span>
              <span className="brand-copy">
                <strong>
                  Life<span>Link</span>
                </strong>
                <small>SMART BLOOD DONOR NETWORK</small>
              </span>
            </Link>
            <p>
              Bringing hospitals and potential blood donors closer together
              through technology.
            </p>
          </div>

          <div className="footer-column">
            <h4>Explore</h4>
            <a href="#about">About us</a>
            <a href="#how-it-works">How it works</a>
            <a href="#features">Features</a>
            <a href="#faq">FAQs</a>
          </div>

          <div className="footer-column">
            <h4>Get started</h4>
            <Link to="/register">Become a donor</Link>
            <Link to="/hospital-register">Register a hospital</Link>
            <Link to="/login">Sign in</Link>
          </div>

          <div className="footer-emergency">
            <span className="footer-heart">♥</span>
            <h4>Every connection counts.</h4>
            <p>Be ready to help. Be part of the network.</p>
            <Link to="/register">
              Join the community <span>↗</span>
            </Link>
          </div>
        </div>

        <div className="landing-container footer-bottom">
          <span>
            © {new Date().getFullYear()} LifeLink. Smart Blood Donor Matching &
            Emergency Notification System.
          </span>
          <span className="footer-note">
            A technology platform supporting blood donation coordination.
          </span>
        </div>
      </footer>
    </div>
  );
}

export default Home;
