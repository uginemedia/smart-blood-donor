import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import "../styles/CreateBloodRequest.css";

import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const urgencyOptions = [
  {
    value: "Normal",
    icon: "◷",
    title: "Normal",
    description: "Standard request",
  },
  {
    value: "Urgent",
    icon: "⚡",
    title: "Urgent",
    description: "Needed soon",
  },
  {
    value: "Critical",
    icon: "!",
    title: "Critical",
    description: "Immediate need",
  },
];

const components = [
  "Whole Blood",
  "Packed Red Blood Cells (PRBC)",
  "Platelets",
  "Fresh Frozen Plasma (FFP)",
];

const processingOptions = [
  {
    value: "Irradiated",
    description: "Irradiated blood products",
  },
  {
    value: "Leukoreduced",
    description: "Reduced white blood cells",
  },
  {
    value: "CMV Negative",
    description: "CMV-negative requirement",
  },
];

const CreateBloodRequest = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    bloodGroup: "",
    unitsNeeded: "",
    urgency: "Normal",
    state: user?.state || "",
    city: user?.city || "",
    bloodComponentType: "Whole Blood",
    specialProcessingNeeds: [],
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const toggleProcessingNeed = (option) => {
    setFormData((previous) => {
      const selected = previous.specialProcessingNeeds.includes(option);

      return {
        ...previous,
        specialProcessingNeeds: selected
          ? previous.specialProcessingNeeds.filter((item) => item !== option)
          : [...previous.specialProcessingNeeds, option],
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user?._id) {
      toast.error("Please log in to create a blood request.");
      return;
    }

    if (
      !formData.bloodGroup ||
      !formData.unitsNeeded ||
      Number(formData.unitsNeeded) < 1 ||
      !formData.state.trim() ||
      !formData.city.trim() ||
      !formData.bloodComponentType
    ) {
      toast.error("Please complete all required fields correctly.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/blood-requests", {
        ...formData,
        unitsNeeded: Number(formData.unitsNeeded),
        state: formData.state.trim(),
        city: formData.city.trim(),
        hospital: user._id,
        hospitalName: user.hospitalName || user.fullName || user.name || "",
      });

      if (response.data.success) {
        const totalMatches = response.data.totalMatches;

        if (typeof totalMatches === "number") {
          toast.success(
            `Blood request created successfully. ${totalMatches} matching donor(s) found.`,
          );
        } else {
          toast.success("Blood request created successfully.");
        }

        navigate("/my-requests");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to create blood request. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="blood-request-page">
      <div className="blood-request-wrapper">
        <Link to="/hospital-dashboard" className="blood-request-back">
          <span>←</span>
          Back to Dashboard
        </Link>

        {/* Page heading */}
        <header className="blood-request-hero">
          <div className="blood-request-hero-content">
            <span className="blood-request-eyebrow">
              <span className="eyebrow-dot" />
              LIFELINK · HOSPITAL SERVICES
            </span>

            <h1>
              Every second
              <br />
              <span>can save a life.</span>
            </h1>

            <p>
              Create a blood request and let LifeLink help your hospital
              identify potential matching donors.
            </p>

            <div className="hero-trust-line">
              <span className="trust-heart">♥</span>A smarter connection between
              hospitals and donors
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="hero-orbit orbit-one" />
            <div className="hero-orbit orbit-two" />

            <div className="hero-blood-drop">
              <svg viewBox="0 0 100 120" role="presentation" aria-hidden="true">
                <path
                  d="M50 5 C39 24 15 48 15 72 A35 35 0 0 0 85 72 C85 48 61 24 50 5Z"
                  fill="currentColor"
                />
                <path
                  d="M31 72 C31 60 38 49 45 41"
                  fill="none"
                  stroke="white"
                  strokeWidth="5"
                  strokeLinecap="round"
                  opacity=".7"
                />
              </svg>
              <span>+</span>
            </div>

            <div className="hero-float-card float-card-top">
              <span className="float-icon">♥</span>
              <div>
                <strong>Blood request</strong>
                <small>Help starts here</small>
              </div>
            </div>

            <div className="hero-float-card float-card-bottom">
              <span className="float-pulse" />
              <div>
                <strong>Donor matching</strong>
                <small>Location & blood group</small>
              </div>
            </div>
          </div>

          <div className="hero-decoration">L</div>
        </header>

        {/* Main layout */}
        <div className="blood-request-layout">
          <section className="blood-request-card">
            <div className="form-card-heading">
              <div>
                <span className="form-overline">NEW REQUEST</span>
                <h2>Blood request details</h2>
                <p>
                  Provide the requirements so potential donors can be
                  identified.
                </p>
              </div>

              <div className="form-heading-icon" aria-hidden="true">
                <span>+</span>
              </div>
            </div>

            <div className="form-progress">
              <span />
              <span />
              <span />
              <small>Request information</small>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Section 1 */}
              <div className="form-section-title">
                <span className="form-section-number">01</span>
                <div>
                  <h3>Blood requirements</h3>
                  <p>What type of blood product is needed?</p>
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="bloodGroup">
                    Blood group <span>*</span>
                  </label>

                  <select
                    id="bloodGroup"
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select blood group</option>
                    {bloodGroups.map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="unitsNeeded">
                    Units needed <span>*</span>
                  </label>

                  <div className="units-input-wrap">
                    <input
                      id="unitsNeeded"
                      name="unitsNeeded"
                      type="number"
                      min="1"
                      step="1"
                      max="999"
                      placeholder="e.g. 4"
                      value={formData.unitsNeeded}
                      onChange={handleChange}
                      required
                    />
                    <span>units</span>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="bloodComponentType">
                  Blood component <span>*</span>
                </label>

                <select
                  id="bloodComponentType"
                  name="bloodComponentType"
                  value={formData.bloodComponentType}
                  onChange={handleChange}
                  required
                >
                  {components.map((component) => (
                    <option key={component} value={component}>
                      {component}
                    </option>
                  ))}
                </select>

                <small>
                  Choose the component specified by your clinical team.
                </small>
              </div>

              {/* Section 2 */}
              <div className="form-section-title section-divider">
                <span className="form-section-number">02</span>
                <div>
                  <h3>Urgency level</h3>
                  <p>How quickly is the blood required?</p>
                </div>
              </div>

              <div className="urgency-options">
                {urgencyOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`urgency-card ${option.value.toLowerCase()} ${
                      formData.urgency === option.value ? "selected" : ""
                    }`}
                    onClick={() =>
                      setFormData((previous) => ({
                        ...previous,
                        urgency: option.value,
                      }))
                    }
                    aria-pressed={formData.urgency === option.value}
                  >
                    <span className="urgency-card-icon">{option.icon}</span>
                    <strong>{option.title}</strong>
                    <small>{option.description}</small>
                    <span className="urgency-selected-mark">
                      {formData.urgency === option.value ? "✓" : ""}
                    </span>
                  </button>
                ))}
              </div>

              {formData.urgency === "Critical" && (
                <div className="critical-notice" role="status">
                  <span>!</span>
                  <p>
                    <strong>Critical request selected.</strong> Confirm the
                    immediate need with your clinical team. LifeLink does not
                    replace emergency transfusion procedures.
                  </p>
                </div>
              )}

              {/* Section 3 */}
              <div className="form-section-title section-divider">
                <span className="form-section-number">03</span>
                <div>
                  <h3>Special processing</h3>
                  <p>Select any additional blood product requirements.</p>
                </div>
              </div>

              <div className="processing-options">
                {processingOptions.map((option) => {
                  const checked = formData.specialProcessingNeeds.includes(
                    option.value,
                  );

                  return (
                    <label
                      key={option.value}
                      className={`processing-card ${checked ? "selected" : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleProcessingNeed(option.value)}
                      />

                      <span className="custom-checkbox">
                        {checked ? "✓" : ""}
                      </span>

                      <span className="processing-card-copy">
                        <strong>{option.value}</strong>
                        <small>{option.description}</small>
                      </span>
                    </label>
                  );
                })}
              </div>

              {/* Section 4 */}
              <div className="form-section-title section-divider">
                <span className="form-section-number">04</span>
                <div>
                  <h3>Required location</h3>
                  <p>Where is the blood needed?</p>
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="state">
                    State <span>*</span>
                  </label>

                  <input
                    id="state"
                    name="state"
                    type="text"
                    placeholder="e.g. Enugu"
                    value={formData.state}
                    onChange={handleChange}
                    autoComplete="address-level1"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="city">
                    City / town <span>*</span>
                  </label>

                  <input
                    id="city"
                    name="city"
                    type="text"
                    placeholder="e.g. Nsukka"
                    value={formData.city}
                    onChange={handleChange}
                    autoComplete="address-level2"
                    required
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="request-submit-area">
                <div className="submit-assurance">
                  <span>✓</span>
                  <p>Review the details before publishing your request.</p>
                </div>

                <button
                  type="submit"
                  className="create-request-button"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="button-spinner" />
                      Creating request...
                    </>
                  ) : (
                    <>
                      Publish Blood Request
                      <span>→</span>
                    </>
                  )}
                </button>

                <p className="submit-footnote">
                  Submitting publishes the request to the system. Donor
                  availability and responses must be confirmed separately.
                </p>
              </div>
            </form>
          </section>

          {/* Live summary */}
          <aside className="request-sidebar">
            <div className="request-preview-card">
              <div className="preview-topline">
                <span className="preview-live-dot" />
                LIVE REQUEST PREVIEW
              </div>

              <div className="preview-blood-heading">
                <div className="preview-blood-icon">♥</div>
                <div>
                  <small>Blood group</small>
                  <h3>{formData.bloodGroup || "—"}</h3>
                </div>
                <span
                  className={`preview-urgency ${formData.urgency.toLowerCase()}`}
                >
                  {formData.urgency}
                </span>
              </div>

              <div className="preview-divider" />

              <div className="preview-data-row">
                <span>Units required</span>
                <strong>
                  {formData.unitsNeeded || "—"}{" "}
                  {formData.unitsNeeded ? "units" : ""}
                </strong>
              </div>

              <div className="preview-data-row">
                <span>Component</span>
                <strong>{formData.bloodComponentType}</strong>
              </div>

              <div className="preview-data-row">
                <span>Location</span>
                <strong>
                  {[formData.city, formData.state].filter(Boolean).join(", ") ||
                    "Not specified"}
                </strong>
              </div>

              <div className="preview-divider" />

              <div className="preview-processing">
                <span>Special processing</span>

                {formData.specialProcessingNeeds.length > 0 ? (
                  <div className="preview-tags">
                    {formData.specialProcessingNeeds.map((need) => (
                      <span key={need}>{need}</span>
                    ))}
                  </div>
                ) : (
                  <p>No additional requirements selected</p>
                )}
              </div>
            </div>

            <div className="request-help-card">
              <div className="help-card-icon">✦</div>
              <h3>How LifeLink helps</h3>
              <p>
                Your request provides the information needed to identify
                potential donors. Matching depends on the information available
                in the system.
              </p>

              <div className="help-step">
                <span>01</span>
                <div>
                  <strong>Publish</strong>
                  <small>Submit your blood requirements.</small>
                </div>
              </div>

              <div className="help-step">
                <span>02</span>
                <div>
                  <strong>Identify matches</strong>
                  <small>Check compatible donor records.</small>
                </div>
              </div>

              <div className="help-step">
                <span>03</span>
                <div>
                  <strong>Review responses</strong>
                  <small>Monitor donor responses in My Requests.</small>
                </div>
              </div>
            </div>

            <div className="request-safety-note">
              <span>ⓘ</span>
              <p>
                <strong>Clinical reminder</strong>
                Donor matching in LifeLink is an aid to coordination, not a
                substitute for blood typing, crossmatching, screening, or
                clinical approval.
              </p>
            </div>
          </aside>
        </div>

        <footer className="blood-request-footer">
          <span className="footer-heart">♥</span>
          <span>LifeLink</span>
          <span className="footer-separator">·</span>
          Connecting donors. Supporting hospitals. Saving lives.
        </footer>
      </div>
    </main>
  );
};

export default CreateBloodRequest;
