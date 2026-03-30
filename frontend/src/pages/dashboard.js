import React, { useEffect, useState } from "react";
import socket from "../services/socketService";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Graphs from "../components/Graphs";

function Dashboard() {
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
          <div className="page-header">
            <h1 className="page-title">Robot Monitoring</h1>
            <p className="page-subtitle">Real-time telemetry and performance metrics</p>
          </div>
          
          <Graphs data={telemetry} />
          
          <div className="system-status-bar" style={{
            marginTop: "1.5rem",
            backgroundColor: "var(--panel-bg)",
            border: "1px solid var(--border-color)",
            borderRadius: "8px",
            padding: "1rem 1.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "var(--accent-green)" }}></div>
              <div>
                <h4 style={{ margin: 0, fontSize: "1rem" }}>System Status: Operational</h4>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-secondary)" }}>All systems functioning normally</p>
              </div>
            </div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              Last update: Just now
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;