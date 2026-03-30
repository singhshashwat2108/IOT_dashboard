import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import InteractiveRobot from "../components/InteractiveRobot";
import "../styles/auth.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please fill in both fields");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("user", username);
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Network error. Please try again later.");
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
                <p className="auth-description">Sign in to your account</p>
              </div>

              {error && <div style={{color: '#ff5e3a', marginBottom: '1rem', textAlign: 'center', fontSize: '0.85rem'}}>{error}</div>}

              <form onSubmit={handleLogin} style={{display: 'flex', flexDirection: 'column'}}>
                <div className="auth-form-group">
                  <label className="auth-label">Username</label>
                  <div className="auth-input-container">
                    <input
                      type="text"
                      className="auth-input"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <span className="auth-input-dot">•</span>
                  </div>
                </div>

                <div className="auth-form-group" style={{marginBottom: '0.5rem'}}>
                  <label className="auth-label">Password</label>
                  <div className="auth-input-container">
                    <input
                      type="password"
                      className="auth-input"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <span className="auth-input-dot">•</span>
                  </div>
                </div>

                <div className="auth-links">
                  <Link to="/forgot-password" className="auth-link">
                    Forgot password?
                  </Link>
                </div>

                <button type="submit" className="auth-button">
                  Sign In
                </button>
              </form>

              <div className="auth-footer">
                <p className="auth-footer-text">Secure login powered by RoboDeliver AI</p>
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

export default Login;