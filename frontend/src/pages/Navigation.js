import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import InteractiveMap from "../components/InteractiveMap";
import LiveVideoFeed from "../components/LiveVideoFeed";
import socket from "../services/socketService";

function Navigation() {
  const [mapMode, setMapMode] = useState("Local");
  const [telemetry, setTelemetry] = useState({});

  useEffect(() => {
    socket.on("telemetry", (data) => {
      setTelemetry(data);
    });
    
    return () => {
      socket.off("telemetry");
    };
  }, []);

  return (
    <div className="dashboard-layout">
      <Sidebar data={telemetry} />
      <div className="dashboard-main">
        <Header />
        
        <div className="page-content">
          <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <span style={{ color: 'var(--accent-orange)', fontSize: '1.75rem' }}>➤</span>
            <div>
              <h1 className="page-title" style={{ margin: 0 }}>Live Navigation</h1>
              <p className="page-subtitle" style={{ margin: 0 }}>Real-time GPS tracking and camera feed</p>
            </div>
          </div>

          <div className="active-route-banner">
            <div className="banner-icon">ℹ️</div>
            <div className="banner-content">
              <h4>Active Route</h4>
              <p>Route to destination: 0.8 km remaining • ETA: 3 minutes</p>
            </div>
          </div>

          <div className="navigation-grid">
            <div className="nav-panel">
              <div className="nav-panel-header">
                <h3 className="nav-panel-title">GPS Navigation</h3>
                <div className="nav-badges">
                  <div 
                    className={`badge ${mapMode === "Local" ? "active" : ""}`}
                    onClick={() => setMapMode("Local")}
                    style={{ cursor: "pointer" }}
                  >Local</div>
                  <div 
                    className={`badge ${mapMode === "Global" ? "active" : ""}`}
                    onClick={() => setMapMode("Global")}
                    style={{ cursor: "pointer" }}
                  >Global</div>
                </div>
              </div>
              <InteractiveMap lat={telemetry.lat} long={telemetry.long} mapMode={mapMode} />
            </div>

            <div className="nav-panel">
              <div className="nav-panel-header">
                <h3 className="nav-panel-title">Live Video Telemetry</h3>
                <div className="badge badge-live">LIVE</div>
              </div>
              <LiveVideoFeed />
            </div>
          </div>

          <div className="bottom-metrics-grid">
            <div className="bottom-metric-card">
              <div className="bm-title">Distance Traveled</div>
              <div className="bm-value orange">2.2 km</div>
              <div className="bm-subtext">of 3.0 km total</div>
            </div>
            
            <div className="bottom-metric-card">
              <div className="bm-title">Time Elapsed</div>
              <div className="bm-value orange">05:23</div>
              <div className="bm-subtext">Average speed: {telemetry.speed || "24.7"} km/h</div>
            </div>

            <div className="bottom-metric-card">
              <div className="bm-title">Battery Level</div>
              <div className="bm-value green">{telemetry.battery || "78"}%</div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${telemetry.battery || 78}%` }}></div>
              </div>
            </div>

            <div className="bottom-metric-card">
              <div className="bm-title">Live Coordinates</div>
              <div className="bm-value blue" style={{fontSize: "1.1rem"}}>
                {telemetry.lat ? telemetry.lat.toFixed(5) : "12.96900"}, {telemetry.long ? telemetry.long.toFixed(5) : "79.15500"}
              </div>
              <div className="bm-subtext">Active Geo-Lock</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navigation;
