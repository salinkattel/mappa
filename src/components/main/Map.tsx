"use client";

import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  Polygon,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix missing marker icons for React-Leaflet
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom Component to Handle Map Clicks
function LocationPopup() {
  const [position, setPosition] = useState<L.LatLng | null>(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng); // e.latlng is of type L.LatLng
    },
  });

  return position ? (
    <Popup position={position}>
      <div>
        You clicked at {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
      </div>
    </Popup>
  ) : null;
}

export default function MapExample() {
  const center: [number, number] = [27.6953, 85.2776]; // acess coordinates
  const polygonCoordinates: [number, number][] = [
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047],
  ];

  return (
    <div className="w-full h-[calc(100vh-128px)]">
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        {/* Tile Layer */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Marker */}
        <Marker position={center}>
          <Popup>
            <b>Hello world!</b>
            <br />I am a popup.
          </Popup>
        </Marker>

        {/* <Circle
          center={[51.508, -0.11]}
          radius={500}
          pathOptions={{ color: "red", fillColor: "#f03", fillOpacity: 0.5 }}
        >
          <Popup>I am a circle.</Popup>
        </Circle> */}

        {/* Polygon */}
        {/* <Polygon positions={polygonCoordinates}>
          <Popup>I am a polygon.</Popup>
        </Polygon> */}

        {/* Location Popup */}
        <LocationPopup />
      </MapContainer>
    </div>
  );
}
