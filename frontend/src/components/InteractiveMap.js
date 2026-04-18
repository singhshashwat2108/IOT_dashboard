import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default leaflet markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Custom robot icon
const robotIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function InteractiveMap({ lat, long, mapMode }) {
  // Use provided lat/long or default to VIT Vellore
  const robotPosition = [lat || 12.969, long || 79.155];
  const destination = [12.973, 79.159]; // Mock delivery destination near VIT
  
  const routeLine = [
    robotPosition,
    [12.970, 79.156],
    [12.971, 79.157],
    destination
  ];

  const currentZoom = mapMode === "Global" ? 11 : 15;

  return (
    <div className="map-container" style={{ height: "100%", width: "100%" }}>
      <MapContainer 
        key={`${mapMode}-${lat ? 'live' : 'mock'}`}
        center={robotPosition} 
        zoom={currentZoom} 
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        {/* Dark mode friendly map tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        <Marker position={robotPosition} icon={robotIcon}>
          <Tooltip permanent direction="top" className="robot-tooltip">
            RB-2024-042
          </Tooltip>
        </Marker>

        <Marker position={destination}>
          <Popup>
            Customer Delivery Location<br />
            ETA: 3 mins
          </Popup>
        </Marker>

        <Polyline 
          positions={routeLine} 
          pathOptions={{ color: '#3b82f6', weight: 4, opacity: 0.7, dashArray: "10, 10" }} 
        />
      </MapContainer>
    </div>
  );
}

export default InteractiveMap;
