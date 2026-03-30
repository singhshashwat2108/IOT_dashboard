import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";

function ForgotPassword() {
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    username: "",
    email: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.fullName || !formData.address || !formData.username || !formData.email) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Password reset instructions have been sent to your email!");
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else {
        setError(data.message || "Failed to reset password. Check details.");
      }
    } catch (err) {
      setError("Network error. Please try again later.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-bg-blob"></div>
      <div className="auth-content-wrapper" style={{justifyContent: 'center'}}>
        <div className="auth-form-side" style={{flex: 'inherit'}}>
          <div className="auth-card-outline">
            <div className="auth-card" style={{padding: '2.5rem 2rem', width: '100%', minWidth: '400px'}}>
              <div className="auth-header" style={{marginBottom: '1.5rem'}}>
                <h1 className="auth-title">Reset Password</h1>
                <p className="auth-subtitle">RoboDeliver</p>
                <p className="auth-description">Verify your account information</p>
              </div>

              {error && <div style={{color: '#ff5e3a', marginBottom: '1rem', textAlign: 'center', fontSize: '0.85rem'}}>{error}</div>}
              {success && <div style={{color: '#4ade80', marginBottom: '1rem', textAlign: 'center', fontSize: '0.85rem'}}>{success}</div>}

              <form onSubmit={handleReset} style={{display: 'flex', flexDirection: 'column'}}>
                
                <div className="auth-form-group" style={{marginBottom: '1rem'}}>
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

                <div className="auth-form-group" style={{marginBottom: '1rem'}}>
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

                <div className="auth-form-group" style={{marginBottom: '1rem'}}>
                  <label className="auth-label">Username</label>
                  <div className="auth-input-container">
                    <input
                      type="text"
                      name="username"
                      className="auth-input"
                      placeholder="Enter your username"
                      value={formData.username}
                      onChange={handleChange}
                    />
                    <span className="auth-input-dot">•</span>
                  </div>
                </div>

                <div className="auth-form-group" style={{marginBottom: '2rem'}}>
                  <label className="auth-label">Email Address</label>
                  <div className="auth-input-container">
                    <input
                      type="email"
                      name="email"
                      className="auth-input"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    <span className="auth-input-dot">•</span>
                  </div>
                </div>

                <button type="submit" className="auth-button" style={{marginBottom: '1rem'}}>
                  Reset Password
                </button>

                <div className="auth-links" style={{justifyContent: 'center', marginBottom: '0'}}>
                  <Link to="/" className="auth-link">
                    Back to login
                  </Link>
                </div>

              </form>
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

export default ForgotPassword;
