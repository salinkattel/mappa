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
  const [place, setPlace] = useState<string>("restaurant");
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
          fetchNearbyPlaces(location);
        },
        (error) => {
          console.error("Error fetching user location:", error);
        }
      );
    }
  }, []);

  // Function to fetch nearby places
  const fetchNearbyPlaces = (location: { lat: number; lng: number }) => {
    const service = new google.maps.places.PlacesService(
      document.createElement("div")
    );
    const request = { location, radius: 2000, type: place }; // Increase radius to get more places

    let allResults: any[] = [];

    const processResults = (results: any, status: any, pagination: any) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        allResults = [...allResults, ...results];

        if (pagination && pagination.hasNextPage) {
          setTimeout(() => {
            pagination.nextPage(); // Request next page
          }, 1000); // Delay to avoid hitting API limits
        } else {
          setRestaurants(allResults); // Set all collected results after pagination ends
        }
      }
    };

    service.nearbySearch(request, processResults);
  };

  const handleRestaurantClick = (place: any) => {
    if (!mapRef.current || !place.geometry?.location) return;

    setSelectedPlaceId(place.place_id); // Update selected marker
    const targetLocation = place.geometry.location;
    const currentCenter = mapRef.current.getCenter();
    if (!currentCenter) return;

    // Calculate distance between current and target locations
    const distance = Math.sqrt(
      Math.pow(targetLocation.lat() - currentCenter.lat(), 2) +
        Math.pow(targetLocation.lng() - currentCenter.lng(), 2)
    );

    // Adaptive steps based on distance (closer places = fewer steps, farther = more steps)
    const steps = Math.min(50, Math.max(30, Math.floor(distance * 1000)));
    const interval = 30; // Milliseconds between steps
    let step = 0;

    const animatePan = () => {
      if (!mapRef.current) return;

      const currentCenter = mapRef.current.getCenter();
      if (!currentCenter) return;

      const latStep =
        (targetLocation.lat() - currentCenter.lat()) / (steps - step);
      const lngStep =
        (targetLocation.lng() - currentCenter.lng()) / (steps - step);

      mapRef.current.panTo({
        lat: currentCenter.lat() + latStep,
        lng: currentCenter.lng() + lngStep,
      });

      step++;
      if (step < steps) {
        setTimeout(animatePan, interval);
      } else {
        mapRef.current.setZoom(17);
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
          onLoad={(map) => {
            mapRef.current = map;
          }}
        >
          {/* User Location Marker */}
          {userLocation && <Marker position={userLocation} label="You" />}

          {/* Restaurant Markers */}
          {restaurants.map((place) => {
            // Ensure there's a valid photo or fallback
            const photoUrl =
              place.photos && place.photos.length > 0 && place.photos[0].getUrl
                ? place.photos[0].getUrl({ maxWidth: 100, maxHeight: 100 })
                : "https://via.placeholder.com/100";

            return (
              <Marker
                key={place.place_id}
                position={place.geometry.location}
                icon={{
                  url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                        <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 431.8 557.88"> {/* Adjust viewBox or remove it */}
                            <defs>
                                <style>
                                    .cls-1 { fill: #bc2332; }
                                    .cls-1, .cls-2 { stroke-width: 0px; }
                                    .cls-2 { fill: #e1222e; }
                                </style>
                                <clipPath id="circleClip">
                                    <circle cx="165" cy="165" r="50"/>
                                </clipPath>
                            </defs>
                            <path class="cls-2" d="M65.68,359.21c-11.09-14.82-20.27-30.81-28.72-47.21C19.5,278.15,7.48,242.5,2.51,204.69c-4.45-33.87-3.84-67.28,8.91-99.8C38.33,36.28,109.29-6.86,182.69.9c32.92,3.48,61.94,15.85,87.61,36.48,1.67,1.34,3.12,2.97,4.66,4.46.12.18.27.32.46.42h.3s.06.29.06.29c.46.87.86,1.77,1.39,2.59,9.5,14.53,16.34,30.27,22.05,46.63,6.83,19.57,10.04,39.62,10.89,60.3.32,7.65-.21,15.18-.15,22.76.1,14.06-2.45,27.79-5.82,41.19-4.96,19.69-11.67,38.89-21.19,56.97-8.95,16.99-18.52,33.44-31.18,48.17-12.29,14.3-25.39,27.52-41.05,37.96-16.26,10.84-34.79,15-54,15.91-12.42.59-24.85.29-37.23-1.81-11.75-1.99-23.2-4.94-34.66-8.16-6.44-1.81-12.01-6.52-19.16-5.85ZM160.03,27.2C73.35,27.6,5.55,96.56,5.94,183.93c.37,84.64,70.39,152.66,156.74,152.27,83.36-.38,152.33-70.59,151.86-154.58-.49-86.1-69.25-154.81-154.51-154.42Z"/>
                            <path class="cls-1" d="M65.68,359.21c7.15-.67,12.72,4.04,19.16,5.85,11.46,3.23,22.91,6.17,34.66,8.16,12.37,2.1,24.81,2.4,37.23,1.81,19.21-.91,37.74-5.07,54-15.91,15.65-10.44,28.75-23.66,41.05-37.96,12.66-14.73,22.23-31.18,31.18-48.17,9.52-18.08,16.23-37.29,21.19-56.97,3.38-13.41,5.93-27.13,5.82-41.19-.06-7.58.47-15.11.15-22.76-.85-20.68-4.06-40.73-10.89-60.3-5.71-16.36-12.55-32.1-22.05-46.63-.53-.82-.93-1.72-1.39-2.59,11.81,9.49,21.02,21.26,29.18,33.87,23.49,36.29,30.04,76.19,25.5,118.62-5.69,53.2-24.38,101.66-52.52,146.74-25.23,40.41-56.21,75.94-91.9,107.43-10.68,9.42-23.65,11.66-35.58,4.28-6.21-3.85-11.07-9.9-16.5-15-24.59-23.1-46.81-48.29-66.31-75.85-.76-1.07-1.32-2.28-1.97-3.43Z"/>
                            <path class="cls-1" d="M275.43,42.26c-.19-.1-.34-.25-.46-.42,0,0,.38.04.38.04l.08.38Z"/>
                            <image x="115" y="115" width="100" height="100" clip-path="url(#circleClip)" href="${photoUrl}"/>
                        </svg>
                    `)}`,
                  scaledSize: new window.google.maps.Size(60, 60), // Adjust as needed
                  anchor: new window.google.maps.Point(30, 45), // Adjust as needed
                }}
              />
            );
          })}
        </GoogleMap>
      </div>
    </LoadScript>
  );
}
