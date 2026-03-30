import React, { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

function Graphs({ data }) {
  // Generate mock data for demonstration
  const [history, setHistory] = useState({
    labels: ["00:00", "00:05", "00:10", "00:15", "00:20", "00:25", "00:30", "00:35", "00:40", "00:45"],
    speed: [0, 5, 12, 18, 22, 25, 28, 32, 35, 38],
    voltage: [48.2, 48.0, 47.8, 47.5, 47.3, 47.0, 46.8, 46.5, 46.1, 45.8],
    imuX: [0, 1.2, 2.5, 3.1, 3.8, 4.2, 4.5, 4.8, 5.0, 5.2],
    imuY: [10, 9.8, 9.7, 9.5, 9.4, 9.2, 9.1, 9.0, 8.9, 8.8],
    imuZ: [0, 0.5, 1.1, 1.8, 2.2, 2.8, 3.1, 3.3, 3.5, 3.6],
    acceleration: [0, 1.2, 2.4, 3.2, 2.8, 1.5, 0.8, 0.4, 0.2, 0.1],
  });

  // Live real-time updates from props
  useEffect(() => {
    if (!data || !data.speed) return;
    
    setHistory(prev => {
      const newLabels = [...prev.labels.slice(1), new Date().toLocaleTimeString('en-US', {hour12: false, hour: "numeric", minute: "numeric", second: "numeric"})];
      return {
        labels: newLabels,
        speed: [...prev.speed.slice(1), parseFloat(data.speed)],
        voltage: [...prev.voltage.slice(1), parseFloat(data.voltage)],
        imuX: [...prev.imuX.slice(1), parseFloat(data.imuX)],
        imuY: [...prev.imuY.slice(1), parseFloat(data.imuY)],
        imuZ: [...prev.imuZ.slice(1), parseFloat(data.imuZ)],
        acceleration: [...prev.acceleration.slice(1), parseFloat(data.acceleration)]
      };
    });
  }, [data]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(15, 17, 26, 0.9)",
        titleColor: "#a0aab2",
        bodyColor: "#ffffff",
        borderColor: "#2a2d3d",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: { color: "#2a2d3d", drawBorder: false },
        ticks: { color: "#a0aab2", font: { size: 10 } },
      },
      y: {
        grid: { color: "#2a2d3d", drawBorder: false },
        ticks: { color: "#a0aab2", font: { size: 10 } },
      },
    },
    elements: {
      point: { radius: 0, hitRadius: 10, hoverRadius: 4 },
    },
  };

  const speedData = {
    labels: history.labels,
    datasets: [
      {
        label: "Speed (km/h)",
        data: history.speed,
        borderColor: "#ff6a00",
        backgroundColor: "transparent",
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: "#ff6a00",
      },
    ],
  };

  const voltageData = {
    labels: history.labels,
    datasets: [
      {
        label: "Voltage (V)",
        data: history.voltage,
        borderColor: "#ff6a00",
        backgroundColor: "rgba(255, 106, 0, 0.2)",
        fill: true,
        tension: 0.1,
        borderWidth: 2,
      },
    ],
  };

  const imuData = {
    labels: history.labels,
    datasets: [
      {
        label: "X-Axis",
        data: history.imuX,
        borderColor: "#ff6a00",
        tension: 0.4,
        borderWidth: 2,
      },
      {
        label: "Y-Axis",
        data: history.imuY,
        borderColor: "#3b82f6",
        tension: 0.4,
        borderWidth: 2,
      },
      {
        label: "Z-Axis",
        data: history.imuZ,
        borderColor: "#9d4edd",
        tension: 0.4,
        borderWidth: 2,
      },
    ],
  };

  const accelData = {
    labels: history.labels,
    datasets: [
      {
        label: "Acceleration (m/s²)",
        data: history.acceleration,
        backgroundColor: "#ff6a00",
        borderRadius: 4,
        barPercentage: 0.6,
      },
    ],
  };

  return (
    <div className="dashboard-grid">
      <div className="chart-card">
        <div className="chart-header">
          <div className="chart-icon-box">📈</div>
          <div className="chart-titles">
            <h3>Speed</h3>
            <p>Current velocity (km/h)</p>
          </div>
        </div>
        <div className="chart-body">
          <Line options={chartOptions} data={speedData} />
        </div>
        <div style={{ textAlign: "center", color: "var(--accent-orange)", fontSize: "0.85rem", marginTop: "1rem" }}>
           Speed (km/h)
        </div>
      </div>

      <div className="chart-card">
        <div className="chart-header">
          <div className="chart-icon-box">⚡</div>
          <div className="chart-titles">
            <h3>Voltage</h3>
            <p>Battery level (V)</p>
          </div>
        </div>
        <div className="chart-body">
          <Line options={{...chartOptions, scales: { ...chartOptions.scales, y: { ...chartOptions.scales.y, min: 44, max: 49 } }}} data={voltageData} />
        </div>
        <div style={{ textAlign: "center", color: "var(--accent-orange)", fontSize: "0.85rem", marginTop: "1rem" }}>
           Voltage (V)
        </div>
      </div>

      <div className="chart-card">
        <div className="chart-header">
          <div className="chart-icon-box">🔄</div>
          <div className="chart-titles">
            <h3>IMU Data</h3>
            <p>Inertial measurements (m/s²)</p>
          </div>
        </div>
        <div className="chart-body">
          <Line options={chartOptions} data={imuData} />
        </div>
        <div style={{ textAlign: "center", fontSize: "0.85rem", marginTop: "1rem", display: "flex", justifyContent:"center", gap:"1rem" }}>
           <span style={{color:"var(--accent-orange)"}}>X-Axis</span>
           <span style={{color:"var(--accent-blue)"}}>Y-Axis</span>
           <span style={{color:"var(--accent-purple)"}}>Z-Axis</span>
        </div>
      </div>

      <div className="chart-card">
        <div className="chart-header">
          <div className="chart-icon-box">⏩</div>
          <div className="chart-titles">
            <h3>Acceleration</h3>
            <p>Rate of velocity change</p>
          </div>
        </div>
        <div className="chart-body">
          <Bar options={{...chartOptions, scales: { ...chartOptions.scales, y: { ...chartOptions.scales.y, min: 0, max: 3.2 } }}} data={accelData} />
        </div>
        <div style={{ textAlign: "center", color: "var(--accent-orange)", fontSize: "0.85rem", marginTop: "1rem" }}>
           Acceleration (m/s²)
        </div>
      </div>
    </div>
  );
}

export default Graphs;