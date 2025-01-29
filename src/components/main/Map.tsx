"use client";

import React, { useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

const center = { lat: 27.6953, lng: 85.2776 }; // Location coordinates

export default function GoogleMapsExample() {
  const [selectedPosition, setSelectedPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      setSelectedPosition({ lat: event.latLng.lat(), lng: event.latLng.lng() });
    }
  };

  return (
    <LoadScript googleMapsApiKey={process.env.GOOGLE_MAP_API_KEY || ""}>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "calc(100vh - 128px)" }}
        center={center}
        zoom={13}
        onClick={handleMapClick}
      >
        {/* Default Marker */}
        <Marker position={center} />

        {/* Clicked Location Marker */}
        {selectedPosition && (
          <Marker position={selectedPosition}>
            <InfoWindow
              position={selectedPosition}
              onCloseClick={() => setSelectedPosition(null)}
            >
              <div>
                You clicked at {selectedPosition.lat.toFixed(4)},{" "}
                {selectedPosition.lng.toFixed(4)}
              </div>
            </InfoWindow>
          </Marker>
        )}
      </GoogleMap>
    </LoadScript>
  );
}
