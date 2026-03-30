import React from "react";

function LiveVideoFeed() {
  return (
    <div className="video-container">
      <div className="video-placeholder-icon">🎥</div>
      <div className="video-text">Camera Feed</div>
      <div className="video-subtext">4K Live Stream</div>

      <div className="video-overlay-metrics">
        <div className="video-metric-row">
          <span className="metric-label">📹 Resolution</span>
          <span className="metric-val">3840x2160</span>
        </div>
        <div className="video-metric-row">
          <span className="metric-label">📶 Signal Quality</span>
          <span className="metric-val" style={{ color: "#00d97e" }}>Excellent</span>
        </div>
        <div className="video-metric-row">
          <span className="metric-label">⏳ Latency</span>
          <span className="metric-val">45ms</span>
        </div>
      </div>
    </div>
  );
}

export default LiveVideoFeed;
