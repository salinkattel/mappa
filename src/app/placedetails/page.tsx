"use client";
import React, { Suspense, useEffect, useRef } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useSearchParams } from "next/navigation";
import mapStyles from "../../components/main/mapStyles.json";

const center = { lat: 27.6953, lng: 85.2776 }; // Default center (Kathmandu)

// Extract search params logic to a separate component
function PlaceDetails({
  children,
}: {
  children: (placeInfo: any) => React.ReactNode;
}) {
  const searchParams = useSearchParams();

  // Extract query parameters
  const placeInfo = {
    placeName: searchParams.get("placeName") || "Unknown Place",
    placeLat: parseFloat(searchParams.get("placeLat") || "0"),
    placeLng: parseFloat(searchParams.get("placeLng") || "0"),
    address: searchParams.get("address") || "No address available",
    rating: searchParams.get("rating") || "N/A",
    photoUrl:
      searchParams.get("photoUrl") ||
      "https://maps.gstatic.com/tactile/pane/default_geocode-2x.png",
    website: searchParams.get("website") || "#",
    phone: searchParams.get("phone") || "Not available",
  };

  return children(placeInfo);
}

export default function PlaceDetailsPage() {
  const mapRef = useRef<google.maps.Map | null>(null);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PlaceDetails>
        {(placeInfo) => {
          const placeLocation = {
            lat: placeInfo.placeLat,
            lng: placeInfo.placeLng,
          };

          // useEffect hook needs to be inside the component that uses it
          useEffect(() => {
            if (
              mapRef.current &&
              placeInfo.placeLat !== 0 &&
              placeInfo.placeLng !== 0
            ) {
              mapRef.current.panTo(placeLocation);
              mapRef.current.setZoom(18);
            }
          }, [placeInfo.placeLat, placeInfo.placeLng]);

          return (
            <LoadScript
              googleMapsApiKey={
                process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || ""
              }
            >
              <div
                style={{
                  display: "flex",
                  height: "100vh",
                  backgroundColor: "#f8f9fa",
                }}
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
                    {placeInfo.placeName}
                  </h1>
                  <img
                    src={placeInfo.photoUrl}
                    alt={placeInfo.placeName}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      marginBottom: "20px",
                    }}
                  />
                  <p style={{ marginBottom: "10px" }}>
                    <strong>Address:</strong> {placeInfo.address}
                  </p>
                  <p style={{ marginBottom: "10px" }}>
                    <strong>Rating:</strong> {placeInfo.rating}
                  </p>
                  <p style={{ marginBottom: "10px" }}>
                    <strong>Phone:</strong> {placeInfo.phone}
                  </p>
                  {placeInfo.website !== "#" && (
                    <a
                      href={placeInfo.website}
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
                    center={placeInfo.placeLat !== 0 ? placeLocation : center}
                    zoom={13}
                    options={{ disableDefaultUI: false, styles: mapStyles }}
                    onLoad={(map) => {
                      mapRef.current = map;
                    }}
                  >
                    {placeInfo.placeLat !== 0 && (
                      <Marker
                        position={placeLocation}
                        title={placeInfo.placeName}
                      />
                    )}
                  </GoogleMap>
                </div>
              </div>
            </LoadScript>
          );
        }}
      </PlaceDetails>
    </Suspense>
  );
}
