"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChevronLeft, Sun, Cloud, Umbrella, Wind } from "lucide-react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className={`bg-white shadow-md transition-all duration-300 ease-in-out ${
        isOpen ? "w-80" : "w-16"
      } lg:h-[calc(100vh-64px)]`}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <ChevronLeft
          className={`h-4 w-4 transition-transform duration-300 ${
            isOpen ? "" : "rotate-180"
          }`}
        />
      </Button>
      {isOpen && (
        <div className="p-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weather</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Sun className="h-8 w-8 text-yellow-500" />
                <span className="text-2xl font-bold">25°C</span>
              </div>
              <div className="mt-2 flex justify-between text-sm text-gray-500">
                <span className="flex items-center">
                  <Cloud className="h-4 w-4 mr-1" /> 10%
                </span>
                <span className="flex items-center">
                  <Umbrella className="h-4 w-4 mr-1" /> 0%
                </span>
                <span className="flex items-center">
                  <Wind className="h-4 w-4 mr-1" /> 5 km/h
                </span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Top Attractions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>Eiffel Tower</li>
                <li>Louvre Museum</li>
                <li>Notre-Dame Cathedral</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Local Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Don't forget to try the delicious croissants at local bakeries!
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
