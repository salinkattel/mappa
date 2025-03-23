"use client";
import React, { useEffect, useRef } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useSearchParams } from "next/navigation";
import mapStyles from "../../components/main/mapStyles.json";

const center = { lat: 27.6953, lng: 85.2776 }; // Default center (Kathmandu)

export default function PlaceDetailsPage() {
  const searchParams = useSearchParams();
  const mapRef = useRef<google.maps.Map | null>(null);

  // Extract query parameters
  const placeName = searchParams.get("placeName") || "Unknown Place";
  const placeLat = parseFloat(searchParams.get("placeLat") || "0");
  const placeLng = parseFloat(searchParams.get("placeLng") || "0");
  const address = searchParams.get("address") || "No address available";
  const rating = searchParams.get("rating") || "N/A";
  const photoUrl =
    searchParams.get("photoUrl") ||
    "https://maps.gstatic.com/tactile/pane/default_geocode-2x.png";
  const website = searchParams.get("website") || "#";
  const phone = searchParams.get("phone") || "Not available";

  const placeLocation = { lat: placeLat, lng: placeLng };

  // Pan to the restaurant location when the map loads
  useEffect(() => {
    if (mapRef.current && placeLat !== 0 && placeLng !== 0) {
      mapRef.current.panTo(placeLocation);
      mapRef.current.setZoom(18);
    }
  }, [placeLat, placeLng]);

  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || ""}
    >
      <div
        style={{ display: "flex", height: "100vh", backgroundColor: "#f8f9fa" }}
      >
        {/* Sidebar with restaurant details */}
        <div
          style={{
            width: "300px",
            background: "#222831",
            padding: "20px",
            color: "#EEEEEE",
            boxShadow: "2px 0px 10px rgba(0, 0, 0, 0.2)",
            overflowY: "auto",
          }}
        >
          <h1 style={{ color: "#00ADB5", marginBottom: "20px" }}>
            {placeName}
          </h1>
          <img
            src={photoUrl}
            alt={placeName}
            style={{
              width: "100%",
              height: "200px",
              objectFit: "cover",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          />
          <p style={{ marginBottom: "10px" }}>
            <strong>Address:</strong> {address}
          </p>
          <p style={{ marginBottom: "10px" }}>
            <strong>Rating:</strong> {rating}
          </p>
          <p style={{ marginBottom: "10px" }}>
            <strong>Phone:</strong> {phone}
          </p>
          {website !== "#" && (
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                padding: "8px 16px",
                backgroundColor: "#00ADB5",
                color: "#222831",
                borderRadius: "4px",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Visit Website
            </a>
          )}
        </div>

        {/* Map */}
        <div style={{ flexGrow: 1 }}>
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={placeLocation.lat !== 0 ? placeLocation : center}
            zoom={13}
            options={{ disableDefaultUI: false, styles: mapStyles }}
            onLoad={(map) => {
              mapRef.current = map;
            }}
          >
            {placeLocation.lat !== 0 && (
              <Marker position={placeLocation} title={placeName} />
            )}
          </GoogleMap>
        </div>
      </div>
    </LoadScript>
  );
}
