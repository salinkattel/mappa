"use client";
import mapStyles from "../main/mapStyles.json";
import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, LoadScript, Libraries } from "@react-google-maps/api";

const libraries: Libraries = ["places"];
const center = { lat: 27.6953, lng: 85.2776 };

export default function GoogleMapsExample() {
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [restaurants, setRestaurants] = useState<
    google.maps.places.PlaceResult[]
  >([]);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error fetching user location:", error);
        }
      );
    }
  }, []);
  const fetchNearbyPlaces = () => {
    if (!mapRef.current || !userLocation) return;

    const service = new google.maps.places.PlacesService(mapRef.current);
    const request = {
      location: userLocation,
      radius: 2000,
      type: "restaurant",
    };
    new google.maps.Marker({
      position: userLocation,
      map: mapRef.current!,
      title: "User Location",
    });

    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        setRestaurants(results);
        addMarkers(results);
      }
    });
  };

  const addMarkers = (places: google.maps.places.PlaceResult[]) => {
    if (!mapRef.current) return;

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    places.forEach((place) => {
      if (place.geometry?.location) {
        const marker = new google.maps.Marker({
          position: place.geometry.location,
          map: mapRef.current!,
          title: place.name || "Unnamed Place",
        });

        marker.addListener("click", () => handleRestaurantClick(marker, place));
        markersRef.current.push(marker);
      }
    });
  };

  const handleRestaurantClick = (
    marker: google.maps.Marker,
    place: google.maps.places.PlaceResult
  ) => {
    if (!mapRef.current || !place.geometry?.location) return;

    const targetLocation = place.geometry.location;
    const currentCenter = mapRef.current.getCenter();
    if (!currentCenter) return;

    const offsetLat = targetLocation.lat() + 0.0015;
    const offsetLocation = new google.maps.LatLng(
      offsetLat,
      targetLocation.lng()
    );

    const distance = calculateDistance(currentCenter, offsetLocation);
    const steps = Math.min(50, Math.max(30, Math.floor(distance * 1000)));
    const interval = 30;
    let step = 0;

    const animatePan = () => {
      if (!mapRef.current || !currentCenter) return;

      const latStep =
        (offsetLocation.lat() - currentCenter.lat()) / (steps - step);
      const lngStep =
        (offsetLocation.lng() - currentCenter.lng()) / (steps - step);

      mapRef.current.panTo({
        lat: currentCenter.lat() + latStep,
        lng: currentCenter.lng() + lngStep,
      });

      step++;
      if (step < steps) {
        setTimeout(animatePan, interval);
      } else {
        mapRef.current.setZoom(18);
        showInfoWindow(marker, place);
      }
    };

    animatePan();
  };

  const calculateDistance = (
    point1: google.maps.LatLng,
    point2: google.maps.LatLng
  ): number => {
    const R = 6371; // Radius of the Earth in km
    const lat1 = (point1.lat() * Math.PI) / 180;
    const lat2 = (point2.lat() * Math.PI) / 180;
    const deltaLat = ((point2.lat() - point1.lat()) * Math.PI) / 180;
    const deltaLng = ((point2.lng() - point1.lng()) * Math.PI) / 180;

    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1) *
        Math.cos(lat2) *
        Math.sin(deltaLng / 2) *
        Math.sin(deltaLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  const showInfoWindow = (
    marker: google.maps.Marker,
    place: google.maps.places.PlaceResult
  ) => {
    if (!infoWindowRef.current || !userLocation || !place.geometry?.location)
      return;

    const placeLocation = place.geometry.location;
    const userLatLng = new google.maps.LatLng(
      userLocation.lat,
      userLocation.lng
    );
    const placeLatLng = new google.maps.LatLng(
      placeLocation.lat(),
      placeLocation.lng()
    );

    const distanceFromUser = calculateDistance(userLatLng, placeLatLng);

    const service = new google.maps.places.PlacesService(mapRef.current!);
    const townSquareRequest = {
      location: placeLocation,
      radius: 5000,
      type: "townsquare",
    };

    service.nearbySearch(townSquareRequest, (results, status) => {
      let distanceFromHighway = 10;

      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        const nearestHighway = results[0];
        if (nearestHighway?.geometry?.location) {
          const highwayLatLng = new google.maps.LatLng(
            nearestHighway.geometry.location.lat(),
            nearestHighway.geometry.location.lng()
          );
          distanceFromHighway = calculateDistance(placeLatLng, highwayLatLng);
        }
      }

      const difficultyScore =
        3 * distanceFromUser +
        1 * distanceFromHighway +
        1 * (5 - (place.rating || 0));

      let difficulty = "Unknown";
      let difficultyColor = "#888";

      if (difficultyScore < 10) {
        difficulty = "Easy";
        difficultyColor = "#4CAF50";
      } else if (difficultyScore < 20) {
        difficulty = "Moderate";
        difficultyColor = "#FFC107";
      } else {
        difficulty = "Hard";
        difficultyColor = "#F44336";
      }

      const fullStars = Math.floor(place.rating || 0);
      const hasHalfStar = (place.rating || 0) % 1 !== 0;
      let starRating = "⭐".repeat(fullStars);
      if (hasHalfStar) starRating += "✰";

      const photoUrl =
        place.photos?.[0]?.getUrl?.({ maxWidth: 350, maxHeight: 200 }) ||
        "https://maps.gstatic.com/tactile/pane/default_geocode-2x.png";

      const content = `
      <div style="
        background: #222831; 
        color: #EEEEEE;
        font-family: 'Arial', sans-serif;
        padding: 12px;
        border-radius: 8px;
        box-shadow: 0px 4px 10px rgba(0, 173, 181, 0.3);
        max-width: 350px;
      ">
        <img 
          src="${photoUrl}"
          alt="${place.name || "Restaurant"}"
          style="
            width: 100%;
            height: 200px;
            object-fit: cover;
            border-radius: 4px;
            margin-bottom: 12px;
          "
        />
        <h3 style="margin: 0; font-size: 18px; color: #00ADB5;">${
          place.name || "Unnamed Place"
        }</h3>
        
        <div style="display: flex; justify-content: space-between;">
          <span style="color: #FFC107; font-size: 16px;">${starRating} (${
        place.rating || "N/A"
      })</span>
          <span style="
            background: ${difficultyColor};
            color: #222;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
          ">${difficulty} Difficulty</span>
        </div>

        <p style="margin: 5px 0; font-size: 14px;">Distance from You: ${distanceFromUser.toFixed(
          2
        )} km</p>
        <p style="margin: 5px 0; font-size: 14px;">Distance from Highway: ${distanceFromHighway.toFixed(
          2
        )} km</p>

        <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          place.name || "Restaurant"
        )}&query_place_id=${place.place_id}" target="_blank" style="
          display: inline-block;
          margin-top: 8px;
          padding: 6px 12px;
          font-size: 14px;
          color: #222831;
          background: #00ADB5;
          text-decoration: none;
          border-radius: 4px;
          font-weight: bold;
        ">Plan trip</a>
      </div>
    `;

      infoWindowRef.current!.setContent(content);
      infoWindowRef.current!.open(mapRef.current, marker);
    });
  };
  useEffect(() => {
    if (mapRef.current && userLocation) {
      fetchNearbyPlaces();
    }
  }, [userLocation]);

  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || ""}
      libraries={libraries}
    >
      <div
        style={{
          display: "flex",
          height: "calc(100vh - 64px)",
          backgroundColor: "#f8f9fa",
        }}
      >
        <div
          style={{
            width: "300px",
            background: "#222831",
            padding: "15px",
            overflowY: "scroll",
            borderRight: "2px solid #393E46",
            color: "#EEEEEE",
            boxShadow: "2px 0px 10px rgba(0, 0, 0, 0.2)",
          }}
        >
          <h3
            style={{
              color: "#00ADB5",
              marginBottom: "10px",
              textAlign: "center",
            }}
          >
            Nearby Restaurants
          </h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {restaurants.map((place) => (
              <li
                key={place.place_id}
                style={{
                  marginBottom: "12px",
                  padding: "10px",
                  borderRadius: "8px",
                  background: "#393E46",
                  cursor: "pointer",
                  transition: "0.3s",
                  boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.2)",
                }}
                onClick={() => {
                  const marker = markersRef.current.find(
                    (m) => m.getTitle() === place.name
                  );
                  if (marker) {
                    handleRestaurantClick(marker, place);
                  }
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#00ADB5")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#393E46")
                }
              >
                <strong style={{ color: "#EEEEEE" }}>
                  {place.name || "Unnamed Place"}
                </strong>
                <br />
                <span style={{ color: "#00ADB5" }}>{place.vicinity}</span>
              </li>
            ))}
          </ul>
        </div>

        <GoogleMap
          mapContainerStyle={{ flexGrow: 1 }}
          center={userLocation || center}
          zoom={13}
          options={{ disableDefaultUI: false, styles: mapStyles }}
          onLoad={(map) => {
            mapRef.current = map;
            // Initialize InfoWindow only after Google Maps is loaded
            if (!infoWindowRef.current) {
              infoWindowRef.current = new google.maps.InfoWindow();
            }
          }}
        />
      </div>
    </LoadScript>
  );
}
