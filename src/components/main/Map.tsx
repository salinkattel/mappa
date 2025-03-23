"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Star, X, Navigation, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Define types for our map component
interface MapProps {
  destinationCoords?: {
    lat: number;
    lng: number;
  };
  destinationName?: string;
  rating?: number;
  imageUrl?: string;
}

// Define a type for location details
interface LocationDetails {
  name: string;
  description?: string;
  image?: string;
  rating?: number;
  distance?: string;
  duration?: string;
  address?: string;
  type?: string;
}

// Default coordinates for Kathmandu center
const KATHMANDU_CENTER = {
  lat: 27.7172,
  lng: 85.324,
};

// Popular destinations with more details
const POPULAR_DESTINATIONS = [
  {
    name: "Swayambhunath (Monkey Temple)",
    lat: 27.7147,
    lng: 85.2904,
    image: "/swayambhunath.jpg",
    rating: 4.8,
    description:
      "Also known as the Monkey Temple, this ancient religious complex sits atop a hill in the Kathmandu Valley and offers panoramic views of the city.",
    type: "Religious Site",
  },
  {
    name: "Boudhanath Stupa",
    lat: 27.7215,
    lng: 85.362,
    image: "/boudha.jpg",
    rating: 4.7,
    description:
      "One of the largest spherical stupas in Nepal, the Boudhanath dominates the skyline and is an UNESCO World Heritage Site.",
    type: "Buddhist Monument",
  },
  {
    name: "Pashupatinath Temple",
    lat: 27.7109,
    lng: 85.3486,
    image: "/pashupati.jpg",
    rating: 4.9,
    description:
      "A famous and sacred Hindu temple complex on the banks of the Bagmati River, dedicated to Lord Shiva.",
    type: "Hindu Temple",
  },
  {
    name: "Thamel",
    lat: 27.7154,
    lng: 85.3123,
    image: "/thamel.jpg",
    rating: 4.5,
    description:
      "A commercial neighborhood in Kathmandu, a tourist hub with numerous shops, restaurants, and hotels.",
    type: "Tourist District",
  },
  {
    name: "Durbar Square",
    lat: 27.7048,
    lng: 85.3068,
    image: "/durbar.jpg",
    rating: 4.6,
    description:
      "A plaza in front of the old royal palace, showcasing spectacular architecture and intricate wood, metal and stone artistry.",
    type: "UNESCO World Heritage Site",
  },
];

// Declare google as a global variable
declare global {
  interface Window {
    google: any;
    googleMapsLoaded: boolean;
    initMap: () => void;
  }
}

// Create a global flag to track if the script is already being loaded
let isScriptLoading = false;

export default function Map({
  destinationCoords,
  destinationName,
  rating,
  imageUrl,
}: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const scriptTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer | null>(null);
  const [travelMode, setTravelMode] = useState<string>("DRIVING");
  const [selectedLocation, setSelectedLocation] =
    useState<LocationDetails | null>(null);
  const [routeInfo, setRouteInfo] = useState<{
    distance?: string;
    duration?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  }>(KATHMANDU_CENTER);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Get user's real location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCoords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          console.log("User location obtained:", userCoords);
          setUserLocation(userCoords);
        },
        (error) => {
          console.error("Error getting user location:", error.message);
          setLocationError(
            `Could not get your location: ${error.message}. Using default location instead.`
          );
          // Keep using the default location
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      console.warn("Geolocation is not supported by this browser");
      setLocationError(
        "Geolocation is not supported by your browser. Using default location instead."
      );
    }
  }, []);

  // Initialize the map
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    // Function to initialize the map
    const initializeMap = () => {
      if (!mapRef.current) return;

      try {
        const mapInstance = new window.google.maps.Map(mapRef.current, {
          center: userLocation,
          zoom: 13,
          mapTypeId: window.google.maps.MapTypeId.ROADMAP,
          mapTypeControl: true,
          fullscreenControl: true,
          streetViewControl: true,
          zoomControl: true,
          styles: [
            {
              featureType: "water",
              elementType: "geometry",
              stylers: [{ color: "#193341" }],
            },
            {
              featureType: "landscape",
              elementType: "geometry",
              stylers: [{ color: "#2c5a71" }],
            },
            {
              featureType: "road",
              elementType: "geometry",
              stylers: [{ color: "#29768a" }, { lightness: -37 }],
            },
            {
              featureType: "poi",
              elementType: "geometry",
              stylers: [{ color: "#406d80" }],
            },
            {
              featureType: "transit",
              elementType: "geometry",
              stylers: [{ color: "#406d80" }],
            },
            {
              elementType: "labels.text.stroke",
              stylers: [
                { visibility: "on" },
                { color: "#3e606f" },
                { weight: 2 },
              ],
            },
            {
              elementType: "labels.text.fill",
              stylers: [{ color: "#ffffff" }],
            },
          ],
        });

        // Create directions renderer
        const directionsRendererInstance =
          new window.google.maps.DirectionsRenderer({
            map: mapInstance,
            suppressMarkers: false,
            polylineOptions: {
              strokeColor: "red",
              strokeWeight: 5,
              strokeOpacity: 0.8,
            },
          });

        setMap(mapInstance);
        setDirectionsRenderer(directionsRendererInstance);

        // Add user location marker
        new window.google.maps.Marker({
          position: userLocation,
          map: mapInstance,
          title: "Your Location",
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#4ade80",
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: "#ffffff",
          },
        });

        // Only add popular destinations if no specific destination is provided
        if (!destinationName) {
          addPopularDestinationsMarkers(mapInstance);
        }
      } catch (err) {
        console.error("Error initializing map:", err);
      } finally {
        setIsLoading(false);
      }
    };

    // Define a global callback function for the script
    window.initMap = () => {
      window.googleMapsLoaded = true;
      isScriptLoading = false;

      // Clear the timeout using the ref
      if (scriptTimeoutRef.current) {
        clearTimeout(scriptTimeoutRef.current);
        scriptTimeoutRef.current = null;
      }

      initializeMap();
    };

    // Load Google Maps script using Google's recommended approach
    const loadGoogleMapsScript = () => {
      // If script is already loaded, initialize map directly
      if (window.google && window.google.maps) {
        initializeMap();
        return;
      }

      // If script is already being loaded, wait for it
      if (isScriptLoading) {
        const checkIfLoaded = setInterval(() => {
          if (window.googleMapsLoaded) {
            clearInterval(checkIfLoaded);
            initializeMap();
          }
        }, 100);
        return;
      }

      // Otherwise, load the script using Google's recommended approach
      isScriptLoading = true;

      // Remove any existing script tags to avoid duplicates
      const existingScripts = document.querySelectorAll(
        'script[src*="maps.googleapis.com"]'
      );
      existingScripts.forEach((script) => script.remove());

      // Create a new script element
      const googleMapsScript = document.createElement("script");

      // Set the script attributes according to Google's best practices
      googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap&loading=async`;
      googleMapsScript.async = true;
      googleMapsScript.defer = true;

      // Append the script to the document head
      document.head.appendChild(googleMapsScript);

      // Store the timeout ID in the ref so it can be accessed from window.initMap
      scriptTimeoutRef.current = setTimeout(() => {
        if (isScriptLoading) {
          isScriptLoading = false;
        }
      }, 10000); // 10 second timeout
    };

    loadGoogleMapsScript();

    return () => {
      if (scriptTimeoutRef.current) {
        clearTimeout(scriptTimeoutRef.current);
      }
    };
  }, [userLocation]);

  // Calculate and display route when destination coordinates change
  useEffect(() => {
    if (
      !map ||
      !directionsRenderer ||
      !destinationCoords ||
      !window.google ||
      !window.google.maps
    )
      return;

    const directionsService = new window.google.maps.DirectionsService();

    // Convert string travelMode to Google Maps TravelMode enum
    const googleTravelMode =
      window.google.maps.TravelMode[
        travelMode as keyof typeof window.google.maps.TravelMode
      ];

    directionsService.route(
      {
        origin: userLocation,
        destination: destinationCoords,
        travelMode: googleTravelMode,
        provideRouteAlternatives: true,
        optimizeWaypoints: true,
      },
      (
        result: google.maps.DirectionsResult | null,
        status: google.maps.DirectionsStatus
      ) => {
        if (status === window.google.maps.DirectionsStatus.OK && result) {
          directionsRenderer.setDirections(result);

          // Fit map to show the entire route
          const bounds = new window.google.maps.LatLngBounds();
          bounds.extend(userLocation);
          bounds.extend(destinationCoords);
          map.fitBounds(bounds);

          // Update route info
          setRouteInfo({
            distance: result.routes[0].legs[0].distance?.text,
            duration: result.routes[0].legs[0].duration?.text,
          });

          // Find destination details
          if (destinationName) {
            const destinationInfo = POPULAR_DESTINATIONS.find(
              (dest) => dest.name === destinationName
            );

            // Create location details
            setSelectedLocation({
              name: destinationName,
              distance: result.routes[0].legs[0].distance?.text,
              duration: result.routes[0].legs[0].duration?.text,
              image: imageUrl,
              rating: rating,
              description: destinationInfo?.description,
              type: destinationInfo?.type,
            });

            // Add destination marker
            const destinationMarker = new window.google.maps.Marker({
              position: destinationCoords,
              map: map,
              title: destinationName,
            });
          }
        } else {
          console.error("Directions request failed:", status);
        }
      }
    );
  }, [
    destinationCoords,
    destinationName,
    map,
    directionsRenderer,
    travelMode,
    userLocation,
    rating,
    imageUrl,
  ]);

  // Add popular destinations markers
  const addPopularDestinationsMarkers = (mapInstance: google.maps.Map) => {
    POPULAR_DESTINATIONS.forEach((destination) => {
      const marker = new window.google.maps.Marker({
        position: { lat: destination.lat, lng: destination.lng },
        map: mapInstance,
        title: destination.name,
        animation: window.google.maps.Animation.DROP,
      });

      marker.addListener("click", () => {
        // Set selected location
        setSelectedLocation({
          name: destination.name,
          image: destination.image,
          rating: destination.rating,
          description: destination.description,
          type: destination.type,
        });

        // Calculate route to this destination
        if (window.google && window.google.maps) {
          const directionsService = new window.google.maps.DirectionsService();
          const googleTravelMode =
            window.google.maps.TravelMode[
              travelMode as keyof typeof window.google.maps.TravelMode
            ];

          directionsService.route(
            {
              origin: userLocation,
              destination: { lat: destination.lat, lng: destination.lng },
              travelMode: googleTravelMode,
            },
            (
              result: google.maps.DirectionsResult | null,
              status: google.maps.DirectionsStatus
            ) => {
              if (status === window.google.maps.DirectionsStatus.OK && result) {
                if (directionsRenderer) {
                  directionsRenderer.setDirections(result);
                }

                // Update route info
                setRouteInfo({
                  distance: result.routes[0].legs[0].distance?.text,
                  duration: result.routes[0].legs[0].duration?.text,
                });

                // Update selected location with route info
                setSelectedLocation((prev) => ({
                  ...prev!,
                  distance: result.routes[0].legs[0].distance?.text,
                  duration: result.routes[0].legs[0].duration?.text,
                }));

                // Fit map to show the entire route
                const bounds = new window.google.maps.LatLngBounds();
                bounds.extend(userLocation);
                bounds.extend({ lat: destination.lat, lng: destination.lng });
                mapInstance.fitBounds(bounds);
              }
            }
          );
        }
      });
    });
  };

  // Change travel mode
  const changeTravelMode = (mode: string) => {
    setTravelMode(mode);

    // Recalculate route if a location is selected
    if (selectedLocation && map && directionsRenderer) {
      const destination = POPULAR_DESTINATIONS.find(
        (dest) => dest.name === selectedLocation.name
      );

      if (destination && window.google && window.google.maps) {
        const directionsService = new window.google.maps.DirectionsService();
        const googleTravelMode =
          window.google.maps.TravelMode[
            mode as keyof typeof window.google.maps.TravelMode
          ];

        directionsService.route(
          {
            origin: userLocation,
            destination: { lat: destination.lat, lng: destination.lng },
            travelMode: googleTravelMode,
          },
          (
            result: google.maps.DirectionsResult | null,
            status: google.maps.DirectionsStatus
          ) => {
            if (status === window.google.maps.DirectionsStatus.OK && result) {
              directionsRenderer.setDirections(result);

              // Update route info
              setRouteInfo({
                distance: result.routes[0].legs[0].distance?.text,
                duration: result.routes[0].legs[0].duration?.text,
              });

              // Update selected location with new route info
              setSelectedLocation((prev) => ({
                ...prev!,
                distance: result.routes[0].legs[0].distance?.text,
                duration: result.routes[0].legs[0].duration?.text,
              }));
            }
          }
        );
      }
    }
  };

  return (
    <div className="h-full flex">
      {/* Location error notification */}
      {locationError && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-50 bg-amber-600 text-white px-4 py-2 rounded-md text-sm shadow-lg">
          <p>{locationError}</p>
        </div>
      )}

      {/* Sidebar for location details */}
      {selectedLocation && (
        <div className="w-80 h-full bg-slate-800 border-r border-teal-900/50 overflow-y-auto">
          <Card className="border-0 rounded-none bg-transparent text-white">
            <CardHeader className="relative pb-0">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4 text-white hover:bg-white/10 z-10"
                onClick={() => setSelectedLocation(null)}
              >
                <X className="h-5 w-5" />
              </Button>

              <div className="relative h-48 -mx-6 -mt-6 mb-4">
                <img
                  src={
                    selectedLocation.image ||
                    `/placeholder.svg?height=200&width=320`
                  }
                  alt={selectedLocation.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>

                {selectedLocation.type && (
                  <Badge className="absolute top-4 left-4 bg-teal-600">
                    {selectedLocation.type}
                  </Badge>
                )}

                {selectedLocation.rating && (
                  <div className="absolute top-4 right-12 flex items-center bg-black/50 rounded-full px-2 py-1">
                    <Star className="h-3.5 w-3.5 text-amber-400 mr-1 fill-amber-400" />
                    <span className="text-xs font-medium">
                      {selectedLocation.rating}
                    </span>
                  </div>
                )}
              </div>

              <CardTitle className="text-xl mb-1">
                {selectedLocation.name}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {selectedLocation.description && (
                <p className="text-sm text-white/80">
                  {selectedLocation.description}
                </p>
              )}

              {(selectedLocation.distance || selectedLocation.duration) && (
                <div className="bg-slate-700/50 rounded-lg p-3 space-y-2">
                  <h4 className="text-sm font-medium text-teal-400">
                    Route Information
                  </h4>

                  <div className="grid grid-cols-2 gap-2">
                    {selectedLocation.distance && (
                      <div className="flex items-center text-sm">
                        <Navigation className="h-4 w-4 mr-2 text-white/60" />
                        <span>{selectedLocation.distance}</span>
                      </div>
                    )}

                    {selectedLocation.duration && (
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-2 text-white/60" />
                        <span>{selectedLocation.duration}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="pt-2">
                <h4 className="text-sm font-medium text-teal-400 mb-2">
                  Travel Mode
                </h4>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={travelMode === "DRIVING" ? "default" : "outline"}
                    className={
                      travelMode === "DRIVING"
                        ? "bg-teal-600"
                        : "border-teal-500 text-teal-400"
                    }
                    onClick={() => changeTravelMode("DRIVING")}
                  >
                    Driving
                  </Button>
                  <Button
                    size="sm"
                    variant={travelMode === "WALKING" ? "default" : "outline"}
                    className={
                      travelMode === "WALKING"
                        ? "bg-teal-600"
                        : "border-teal-500 text-teal-400"
                    }
                    onClick={() => changeTravelMode("WALKING")}
                  >
                    Walking
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Map container */}
      <div className="flex-1 flex flex-col">
        {!selectedLocation && destinationCoords && (
          <div className="bg-slate-800 p-3 border-b border-teal-900/50">
            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                size="sm"
                variant={travelMode === "DRIVING" ? "default" : "outline"}
                className={
                  travelMode === "DRIVING"
                    ? "bg-teal-600"
                    : "border-teal-500 text-teal-400"
                }
                onClick={() => changeTravelMode("DRIVING")}
              >
                Driving
              </Button>
              <Button
                size="sm"
                variant={travelMode === "WALKING" ? "default" : "outline"}
                className={
                  travelMode === "WALKING"
                    ? "bg-teal-600"
                    : "border-teal-500 text-teal-400"
                }
                onClick={() => changeTravelMode("WALKING")}
              >
                Walking
              </Button>
            </div>
          </div>
        )}
        <div ref={mapRef} className="flex-1 w-full h-full" />
      </div>
    </div>
  );
}
