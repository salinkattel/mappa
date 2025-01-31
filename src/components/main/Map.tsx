"use client";

import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const center = { lat: 27.6953, lng: 85.2776 }; // Default location

export default function GoogleMapsExample() {
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
          fetchNearbyRestaurants(location);
        },
        (error) => {
          console.error("Error fetching user location:", error);
        }
      );
    }
  }, []);

  const fetchNearbyRestaurants = (location: { lat: number; lng: number }) => {
    const service = new google.maps.places.PlacesService(
      document.createElement("div")
    );
    const request = { location, radius: 1000, type: "restaurant" };

    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        setRestaurants(results);
      }
    });
  };

  const handleRestaurantClick = (place: any) => {
    if (!mapRef.current || !place.geometry?.location) return;

    setSelectedPlaceId(place.place_id); // Update selected marker
    const targetLocation = place.geometry.location;
    const currentCenter = mapRef.current.getCenter();
    if (!currentCenter) return;

    let step = 0;
    const steps = 20; // Number of animation steps
    const interval = 30; // Milliseconds between steps
    const latStep = (targetLocation.lat() - currentCenter.lat()) / steps;
    const lngStep = (targetLocation.lng() - currentCenter.lng()) / steps;

    const animatePan = () => {
      if (step < steps) {
        step++;
        mapRef.current?.panTo({
          lat: currentCenter.lat() + latStep * step,
          lng: currentCenter.lng() + lngStep * step,
        });
        setTimeout(animatePan, interval);
      } else {
        mapRef.current?.setZoom(17); // Zoom in after animation
      }
    };

    animatePan();
  };

  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || ""}
      libraries={["places"]}
    >
      <div style={{ display: "flex", height: "calc(100vh - 64px)" }}>
        {/* Sidebar for Restaurants */}
        <div
          style={{
            width: "300px",
            background: "white",
            padding: "10px",
            overflowY: "scroll",
            borderRight: "1px solid #ccc",
          }}
        >
          <h3>Nearby Restaurants</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {restaurants.map((place) => (
              <li
                key={place.place_id}
                style={{
                  marginBottom: "10px",
                  cursor: "pointer",
                  color: "blue",
                }}
                onClick={() => handleRestaurantClick(place)}
              >
                <strong>{place.name}</strong>
                <br /> {place.vicinity}
              </li>
            ))}
          </ul>
        </div>

        {/* Google Map */}
        <GoogleMap
          mapContainerStyle={{ flexGrow: 1 }}
          center={userLocation || center}
          zoom={13}
          options={{
            mapId: process.env.NEXT_PUBLIC_GOOGLE_MAP_ID, // Use your Map ID
            disableDefaultUI: false,
          }}
          mapTypeId="2cfedb22f0f942f0"
          onLoad={(map) => {
            mapRef.current = map;
          }}
        >
          {/* User Location Marker */}
          {userLocation && <Marker position={userLocation} label="You" />}

          {/* Restaurant Markers */}
          {restaurants.map((place) => (
            <Marker
              key={place.place_id}
              position={place.geometry.location}
              icon={{
                url:
                  selectedPlaceId === place.place_id
                    ? "https://maps.google.com/mapfiles/ms/icons/red-dot.png" // Enlarged icon
                    : "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png", // Normal icon
                scaledSize: new window.google.maps.Size(40, 40), // Ensure custom scaling works
              }}
            />
          ))}
        </GoogleMap>
      </div>
    </LoadScript>
  );
}
