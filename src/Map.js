// src/Map.js

import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Navbar from './Navbar'; // Import the Navbar component

// Car icon configuration
const carIcon = new L.Icon({
  iconUrl: 'https://images.vexels.com/media/users/3/154573/isolated/preview/bd08e000a449288c914d851cb9dae110-hatchback-car-top-view-silhouette-by-vexels.png', // Replace with your car icon URL
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

// Get current Indian time
const getCurrentIndianTime = () => {
  const now = new Date();
  const indianTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000)); // Convert to IST (UTC+5:30)
  return indianTime.toISOString();
};

// Simulated route for the vehicle with current timestamps
const routeData = [
  { 
    coordinates: [17.385044, 78.486671], 
    timestamp: getCurrentIndianTime() 
  },
  { 
    coordinates: [17.385045, 78.486672], 
    timestamp: new Date(new Date(getCurrentIndianTime()).getTime() + 5000).toISOString() // 5 seconds later
  },
];

const Map = () => {
  const [currentPosition, setCurrentPosition] = useState(routeData[0].coordinates);
  const [routeIndex, setRouteIndex] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [currentTime, setCurrentTime] = useState(routeData[0].timestamp);

  const startSimulation = () => {
    setRouteIndex(0);
    setCurrentPosition(routeData[0].coordinates);
    setCurrentTime(routeData[0].timestamp);
    setIsMoving(true);
  };

  React.useEffect(() => {
    if (isMoving) {
      const intervalId = setInterval(() => {
        if (routeIndex < routeData.length - 1) {
          const nextIndex = routeIndex + 1;
          setRouteIndex(nextIndex);
          setCurrentPosition(routeData[nextIndex].coordinates);
          setCurrentTime(routeData[nextIndex].timestamp);
        } else {
          clearInterval(intervalId);
          setIsMoving(false);
        }
      }, 2000); // Reduced interval to 2 seconds for better visibility

      return () => clearInterval(intervalId);
    }
  }, [isMoving, routeIndex]);

  return (
    <div>
      <Navbar /> {/* Include the Navbar at the top */}
      <MapContainer
        center={routeData[0].coordinates}
        zoom={14}
        style={{ height: '500px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* Draw the complete route */}
        <Polyline positions={routeData.map(point => point.coordinates)} color="red" />
        {/* Car icon that moves along the route */}
        <Marker position={currentPosition} icon={carIcon} />
      </MapContainer>

      {/* Display current time and position */}
      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        <p>Current Time: {currentTime}</p>
        <p>Position: {currentPosition[0].toFixed(6)}, {currentPosition[1].toFixed(6)}</p>
      </div>

      {/* Button to start the simulation */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
        <button onClick={startSimulation} style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Start Simulation
        </button>
      </div>
    </div>
  );
};

export default Map;
