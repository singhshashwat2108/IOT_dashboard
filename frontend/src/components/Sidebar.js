import React, { useState, useEffect, useRef } from "react";

function Sidebar({ data }) {
  const [deliveryState, setDeliveryState] = useState("Packaging");
  // Keep track of previous state to log changes
  const prevStatusRef = useRef(null);

  useEffect(() => {
    if (data && data.status && data.status !== deliveryState) {
      setDeliveryState(data.status);

      // Only log if it's a genuine transition (and avoid initial flood)
      if (prevStatusRef.current && prevStatusRef.current !== data.status) {
        logStateChange(data.status);
      }
      prevStatusRef.current = data.status;
    }
  }, [data, deliveryState]);

  const logStateChange = async (newState) => {
    try {
      await fetch("http://localhost:5000/api/logs/state", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newState })
      });
    } catch (err) {
      console.error("Failed to log state change:", err);
    }
  };

  return (
    <div className="sidebar" style={{ gap: '0.25rem' }}>
      <div className="sidebar-profile" style={{ marginBottom: '1rem' }}>
        <div className="profile-avatar" style={{ width: '60px', height: '60px', fontSize: '1.5rem', marginBottom: '0.25rem' }}>R</div>
        <div className="profile-name">RoboDeliver</div>
      </div>

      <div className="info-cards" style={{ gap: '0.4rem', flex: 1, overflowY: 'auto', paddingRight: '5px' }}>
        <div className="info-card" style={{ padding: '0.6rem' }}>
          <div className="info-label">📦 Item</div>
          <div className="info-value">Laptop Package</div>
        </div>

        <div className="info-card" style={{ padding: '0.6rem' }}>
          <div className="info-label">👤 Cust ID</div>
          <div className="info-value">CUST-2024-001</div>
        </div>

        <div className="info-card" style={{ padding: '0.6rem' }}>
          <div className="info-label">⚡ Status</div>
          <div className="info-value status-indicator">
            <div className="status-dot"></div>
            {deliveryState}
          </div>
        </div>

        <div className="info-card" style={{ padding: '0.6rem' }}>
          <div className="info-label">🤖 Robot #</div>
          <div className="info-value">RB-2024-042</div>
        </div>

        <div className="info-card" style={{ padding: '0.6rem' }}>
          <div className="info-label">👨‍💼 Admin</div>
          <div className="info-value">John Supervisor</div>
        </div>
      </div>

      <div className="info-card timer-card" style={{ padding: '0.6rem', marginTop: '0.5rem' }}>
        <div className="info-label">⏱️ Time to Delivery</div>
        <div className="timer-value" style={{ fontSize: '1.2rem' }}>00:53:07</div>
      </div>
    </div>
  );
}

export default Sidebar;