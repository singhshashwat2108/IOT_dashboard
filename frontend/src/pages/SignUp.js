import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import InteractiveRobot from "../components/InteractiveRobot";
import "../styles/auth.css";

function SignUp() {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { fullName, username, email, password, confirmPassword, address } = formData;

    if (!fullName || !username || !email || !password || !confirmPassword || !address) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, username, email, password, address }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("user", username);
        localStorage.setItem("token", data.token);
        localStorage.setItem("fullName", fullName);
        setSuccess("Account created! Redirecting to dashboard…");
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        setError(data.message || "Sign-up failed. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-bg-blob"></div>
      <div className="auth-content-wrapper">
        <div className="auth-robot-side">
          <InteractiveRobot />
        </div>

        <div className="auth-form-side">
          <div className="auth-card-outline">
            <div className="auth-card">
              <div className="auth-header">
                <h1 className="auth-title">RoboDeliver</h1>
                <p className="auth-subtitle">IoT Robot Delivery Platform</p>
                <p className="auth-description">Create your account</p>
              </div>

              {error && (
                <div style={{ color: "#ff5e3a", marginBottom: "1rem", textAlign: "center", fontSize: "0.85rem" }}>
                  {error}
                </div>
              )}
              {success && (
                <div style={{ color: "#4ade80", marginBottom: "1rem", textAlign: "center", fontSize: "0.85rem" }}>
                  {success}
                </div>
              )}

              <form onSubmit={handleSignUp} style={{ display: "flex", flexDirection: "column" }}>
                {/* Full Name */}
                <div className="auth-form-group">
                  <label className="auth-label">Full Name</label>
                  <div className="auth-input-container">
                    <input
                      type="text"
                      name="fullName"
                      className="auth-input"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={handleChange}
                    />
                    <span className="auth-input-dot">•</span>
                  </div>
                </div>

                {/* Username */}
                <div className="auth-form-group">
                  <label className="auth-label">Username</label>
                  <div className="auth-input-container">
                    <input
                      type="text"
                      name="username"
                      className="auth-input"
                      placeholder="Choose a username"
                      value={formData.username}
                      onChange={handleChange}
                    />
                    <span className="auth-input-dot">•</span>
                  </div>
                </div>

                {/* Email */}
                <div className="auth-form-group">
                  <label className="auth-label">Email Address</label>
                  <div className="auth-input-container">
                    <input
                      type="email"
                      name="email"
                      className="auth-input"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    <span className="auth-input-dot">•</span>
                  </div>
                </div>

                {/* Address */}
                <div className="auth-form-group">
                  <label className="auth-label">Address</label>
                  <div className="auth-input-container">
                    <input
                      type="text"
                      name="address"
                      className="auth-input"
                      placeholder="Enter your address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                    <span className="auth-input-dot">•</span>
                  </div>
                </div>

                {/* Password */}
                <div className="auth-form-group">
                  <label className="auth-label">Password</label>
                  <div className="auth-input-container">
                    <input
                      type="password"
                      name="password"
                      className="auth-input"
                      placeholder="Create a password (min 6 chars)"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <span className="auth-input-dot">•</span>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="auth-form-group" style={{ marginBottom: "0.5rem" }}>
                  <label className="auth-label">Confirm Password</label>
                  <div className="auth-input-container">
                    <input
                      type="password"
                      name="confirmPassword"
                      className="auth-input"
                      placeholder="Re-enter your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    <span className="auth-input-dot">•</span>
                  </div>
                </div>

                <div className="auth-links">
                  <Link to="/forgot-password" className="auth-link">
                    Forgot password?
                  </Link>
                </div>

                <button type="submit" className="auth-button" disabled={loading}>
                  {loading ? "Creating Account…" : "Sign Up"}
                </button>
              </form>

              <div className="auth-footer">
                <p className="auth-footer-text">
                  Already have an account?{" "}
                  <Link to="/" className="auth-link" style={{ fontSize: "0.9rem" }}>
                    Sign In
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="auth-bottom-copyright">
        © 2024 RoboDeliver. All rights reserved.
      </div>
    </div>
  );
}

export default SignUp;
