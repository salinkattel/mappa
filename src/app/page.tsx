"use client";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { destinations } from "@/lib/mockResturants";
import { useState, useRef } from "react";
import Header from "../components/reusables/Header";
import Map from "../components/main/Map";
import {
  Search,
  Mountain,
  Utensils,
  Landmark,
  Info,
  Heart,
  Star,
  MapPin,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export default function TravelAdvicePage() {
  const [activeCategory, setActiveCategory] = useState("trekking");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showMap, setShowMap] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<{
    coords: { lat: number; lng: number };
    name: string;
    rating: number;
    imageUrl: string | undefined;
  } | null>(null);

  const mapSectionRef = useRef<HTMLDivElement>(null);

  const toggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((item) => item !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const handleViewDestination = (destination: any) => {
    const coords = {
      lat: destination.coordinates?.lat || 27.7172,
      lng: destination.coordinates?.lng || 85.324,
    };

    setSelectedDestination({
      coords,
      name: destination.name,
      rating: destination.rating,
      imageUrl: destination.imageUrl,
    });

    setShowMap(true);

    setTimeout(() => {
      mapSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-teal-950 to-slate-900 text-white">
      {/* Hero Section */}
      <section className="relative w-full min-h-screen flex flex-col">
        <Header />
        <div className="relative w-full h-full">
          <img src="valley.jpg" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-teal-950/70 via-teal-900/40 to-slate-900/90 flex flex-col justify-center items-center text-center px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Discover Kathmandu
            </h1>
            <p className="text-xl md:text-2xl max-w-2xl mb-8 text-white/80">
              Explore the land of Himalayas, ancient temples, and vibrant
              cultures
            </p>
            <div className="relative w-full max-w-md">
              <Input
                placeholder="Where do you want to go?"
                className="pl-10 py-6 bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-white/50"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
            </div>
            <div className="flex gap-4 mt-6">
              <Button
                onClick={() => {
                  setShowMap(true);
                  setTimeout(() => {
                    mapSectionRef.current?.scrollIntoView({
                      behavior: "smooth",
                    });
                  }, 100);
                }}
                className="bg-teal-600 hover:bg-teal-700"
              >
                Explore Map
              </Button>
              <Button
                variant="outline"
                className="bg-white/10 border-white/20 text-white"
                onClick={() => setShowSidebar(true)}
              >
                Travel Tips
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Main Content */}
        {showMap ? (
          <div id="maps-section" className="space-y-6" ref={mapSectionRef}>
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                {selectedDestination
                  ? `Route to ${selectedDestination.name}`
                  : "Interactive Map"}
              </h2>
              <Button
                variant="outline"
                className="border-teal-500 text-teal-400 hover:bg-teal-500 hover:text-white"
                onClick={() => {
                  setShowMap(false);
                  setSelectedDestination(null);
                }}
              >
                Back to Destinations
              </Button>
            </div>
            <div className="h-[600px] rounded-lg overflow-hidden border border-teal-900/50">
              <Map
                destinationCoords={selectedDestination?.coords}
                destinationName={selectedDestination?.name}
                rating={selectedDestination?.rating}
                imageUrl={selectedDestination?.imageUrl}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-16">
            {/* Categories Section */}
            <section>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">
                  Our reccomendations by Category
                </h2>
                <Button
                  variant="ghost"
                  className="text-teal-400 hover:text-teal-300"
                  onClick={() => {
                    setShowMap(true);
                    setTimeout(() => {
                      mapSectionRef.current?.scrollIntoView({
                        behavior: "smooth",
                      });
                    }, 100);
                  }}
                >
                  View on Map <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>

              <Tabs
                defaultValue="trekking"
                className="w-full"
                onValueChange={setActiveCategory}
              >
                <TabsList className="w-full max-w-md mx-auto grid grid-cols-4 bg-slate-800/50 border border-teal-900/50 mb-8">
                  <TabsTrigger
                    value="shorttrips"
                    className="data-[state=active]:bg-teal-600 data-[state=active]:text-white"
                  >
                    <Mountain className="mr-2 h-4 w-4" />
                    Short Trips
                  </TabsTrigger>
                  <TabsTrigger
                    value="trekking"
                    className="data-[state=active]:bg-teal-600 data-[state=active]:text-white"
                  >
                    <Mountain className="mr-2 h-4 w-4" />
                    Trekking
                  </TabsTrigger>
                  <TabsTrigger
                    value="cultural"
                    className="data-[state=active]:bg-teal-600 data-[state=active]:text-white"
                  >
                    <Landmark className="mr-2 h-4 w-4" />
                    Cultural
                  </TabsTrigger>
                  <TabsTrigger
                    value="food"
                    className="data-[state=active]:bg-teal-600 data-[state=active]:text-white"
                  >
                    <Utensils className="mr-2 h-4 w-4" />
                    Food
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="shorttrips">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {destinations.shorttrips.map((trek) => (
                      <Card
                        key={trek.id}
                        className="bg-slate-800/30 backdrop-blur-md border-teal-900/50 overflow-hidden group hover:border-teal-500/50 transition-all duration-300"
                      >
                        <div className="h-[200px] relative">
                          <img
                            src={`${trek.imageUrl}`}
                            alt={trek.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleFavorite(trek.id);
                            }}
                            className="absolute top-3 right-3 bg-black/30 text-white hover:bg-black/50 z-10"
                          >
                            <Heart
                              className={`h-5 w-5 ${
                                favorites.includes(trek.id)
                                  ? "fill-amber-400 text-amber-400"
                                  : ""
                              }`}
                            />
                          </Button>
                          <div className="absolute bottom-3 left-3 flex items-center bg-black/50 rounded-full px-2 py-1">
                            <Star className="h-3.5 w-3.5 text-amber-400 mr-1" />
                            <span className="text-xs font-medium text-white">
                              {trek.rating}
                            </span>
                          </div>
                          <Badge className="absolute top-3 left-3 bg-amber-500 hover:bg-amber-600">
                            {trek.estimatedTime}
                          </Badge>
                        </div>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-white text-xl">
                            {trek.name}
                          </CardTitle>
                          <CardDescription className="text-white/70 flex items-center">
                            <MapPin className="h-3.5 w-3.5 mr-1" /> Best time to
                            go here {trek.bestTime}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-white/80">
                            {trek.description}
                          </p>
                        </CardContent>
                        <CardFooter>
                          <Button
                            className="w-full bg-teal-600 hover:bg-teal-700"
                            onClick={() => handleViewDestination(trek)}
                          >
                            View on Map
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="trekking">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {destinations.trekking.map((trek) => (
                      <Card
                        key={trek.id}
                        className="bg-slate-800/30 backdrop-blur-md border-teal-900/50 overflow-hidden group hover:border-teal-500/50 transition-all duration-300"
                      >
                        <div className="h-[200px] relative">
                          <img
                            src={`${trek.imageUrl}`}
                            alt={trek.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleFavorite(trek.id);
                            }}
                            className="absolute top-3 right-3 bg-black/30 text-white hover:bg-black/50 z-10"
                          >
                            <Heart
                              className={`h-5 w-5 ${
                                favorites.includes(trek.id)
                                  ? "fill-amber-400 text-amber-400"
                                  : ""
                              }`}
                            />
                          </Button>
                          <div className="absolute bottom-3 left-3 flex items-center bg-black/50 rounded-full px-2 py-1">
                            <Star className="h-3.5 w-3.5 text-amber-400 mr-1" />
                            <span className="text-xs font-medium text-white">
                              {trek.rating}
                            </span>
                          </div>
                          <Badge className="absolute top-3 left-3 bg-amber-500 hover:bg-amber-600">
                            {trek.difficulty}
                          </Badge>
                        </div>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-white text-xl">
                            {trek.name}
                          </CardTitle>
                          <CardDescription className="text-white/70 flex items-center">
                            <MapPin className="h-3.5 w-3.5 mr-1" /> Nepal •{" "}
                            {trek.duration}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-white/80">
                            Experience breathtaking views at {trek.elevation}{" "}
                            elevation on this unforgettable trek.
                          </p>
                        </CardContent>
                        <CardFooter>
                          <Button
                            className="w-full bg-teal-600 hover:bg-teal-700"
                            onClick={() => handleViewDestination(trek)}
                          >
                            View on Map
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="cultural">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {destinations.cultural.map((site) => (
                      <Card
                        key={site.id}
                        className="bg-slate-800/30 backdrop-blur-md border-teal-900/50 overflow-hidden group hover:border-teal-500/50 transition-all duration-300"
                      >
                        <div className="h-[200px] relative">
                          <img
                            src={`${site.imageUrl}`}
                            alt={site.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleFavorite(site.id);
                            }}
                            className="absolute top-3 right-3 bg-black/30 text-white hover:bg-black/50 z-10"
                          >
                            <Heart
                              className={`h-5 w-5 ${
                                favorites.includes(site.id)
                                  ? "fill-amber-400 text-amber-400"
                                  : ""
                              }`}
                            />
                          </Button>
                          <div className="absolute bottom-3 left-3 flex items-center bg-black/50 rounded-full px-2 py-1">
                            <Star className="h-3.5 w-3.5 text-amber-400 mr-1" />
                            <span className="text-xs font-medium text-white">
                              {site.rating}
                            </span>
                          </div>
                          <Badge className="absolute top-3 left-3 bg-amber-500 hover:bg-amber-600">
                            {site.type}
                          </Badge>
                        </div>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-white text-xl">
                            {site.name}
                          </CardTitle>
                          <CardDescription className="text-white/70 flex items-center">
                            <MapPin className="h-3.5 w-3.5 mr-1" /> Nepal •
                            Best: {site.bestTime}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-white/80">
                            Explore the rich cultural heritage of Nepal at this
                            iconic site.
                          </p>
                        </CardContent>
                        <CardFooter>
                          <Button
                            className="w-full bg-teal-600 hover:bg-teal-700"
                            onClick={() => handleViewDestination(site)}
                          >
                            View on Map
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="food">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {destinations.food.map((food) => (
                      <Card
                        key={food.id}
                        className="bg-slate-800/30 backdrop-blur-md border-teal-900/50 overflow-hidden group hover:border-teal-500/50 transition-all duration-300"
                      >
                        <div className="h-[200px] relative">
                          <img
                            src={`${food.imageUrl}`}
                            alt={food.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleFavorite(food.id);
                            }}
                            className="absolute top-3 right-3 bg-black/30 text-white hover:bg-black/50 z-10"
                          >
                            <Heart
                              className={`h-5 w-5 ${
                                favorites.includes(food.id)
                                  ? "fill-amber-400 text-amber-400"
                                  : ""
                              }`}
                            />
                          </Button>
                          <div className="absolute bottom-3 left-3 flex items-center bg-black/50 rounded-full px-2 py-1">
                            <Star className="h-3.5 w-3.5 text-amber-400 mr-1" />
                            <span className="text-xs font-medium text-white">
                              {food.rating}
                            </span>
                          </div>
                          <Badge className="absolute top-3 left-3 bg-amber-500 hover:bg-amber-600">
                            {food.specialty}
                          </Badge>
                        </div>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-white text-xl">
                            {food.name}
                          </CardTitle>
                          <CardDescription className="text-white/70 flex items-center">
                            <MapPin className="h-3.5 w-3.5 mr-1" />{" "}
                            {food.region}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-white/80">
                            Discover the authentic flavors of Nepali cuisine.
                          </p>
                        </CardContent>
                        <CardFooter>
                          <Button
                            className="w-full bg-teal-600 hover:bg-teal-700"
                            onClick={() => handleViewDestination(food)}
                          >
                            View on Map
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </section>

            {/* Travel Info Section */}
            <section className="max-w-4xl mx-auto">
              <Collapsible
                open={isInfoOpen}
                onOpenChange={setIsInfoOpen}
                className="bg-slate-800/30 backdrop-blur-md border border-teal-900/50 rounded-lg p-6"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold flex items-center">
                    <Info className="mr-2 h-5 w-5 text-teal-400" />
                    Travel Information
                  </h2>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-9 p-0">
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${
                          isInfoOpen ? "transform rotate-180" : ""
                        }`}
                      />
                      <span className="sr-only">Toggle</span>
                    </Button>
                  </CollapsibleTrigger>
                </div>

                <CollapsibleContent className="mt-6 space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium text-teal-400">
                        Best Time to Visit
                      </h3>
                      <p className="text-white/80">
                        September to November offers clear skies and mild
                        temperatures, perfect for trekking and sightseeing.
                        March to May is the second-best season with blooming
                        rhododendrons.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium text-teal-400">
                        Travel Tips
                      </h3>
                      <ul className="space-y-1 text-white/80">
                        <li>
                          • Carry cash as ATMs are limited in remote areas
                        </li>
                        <li>
                          • Get travel insurance that covers high altitude
                          trekking
                        </li>
                        <li>• Respect local customs at religious sites</li>
                        <li>• Drink only bottled or purified water</li>
                      </ul>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </section>
          </div>
        )}
      </div>

      {/* Sidebar for Travel Tips (Mobile) */}
      <Sheet open={showSidebar} onOpenChange={setShowSidebar}>
        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
          <div className="py-6">
            <h2 className="text-xl font-bold mb-4">Travel Tips</h2>
            <div className="space-y-4">
              <div className="bg-slate-800/50 rounded-lg p-4">
                <h3 className="font-medium mb-2 text-teal-400">
                  Best Time to Visit
                </h3>
                <p className="text-sm text-white/80">
                  September to November offers clear skies and mild
                  temperatures, perfect for trekking and sightseeing. March to
                  May is the second-best season with blooming rhododendrons.
                </p>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-4">
                <h3 className="font-medium mb-2 text-teal-400">
                  Essential Tips
                </h3>
                <ul className="space-y-2 text-sm text-white/80">
                  <li>• Carry cash as ATMs are limited in remote areas</li>
                  <li>
                    • Get travel insurance that covers high altitude trekking
                  </li>
                  <li>• Respect local customs at religious sites</li>
                  <li>• Drink only bottled or purified water</li>
                  <li>• Altitude sickness is real - acclimatize properly</li>
                </ul>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-4">
                <h3 className="font-medium mb-2 text-teal-400">
                  Local Customs
                </h3>
                <p className="text-sm text-white/80">
                  Remove shoes before entering temples and homes. Dress modestly
                  at religious sites. Ask permission before photographing
                  people. The traditional greeting is "Namaste" with palms
                  together.
                </p>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
