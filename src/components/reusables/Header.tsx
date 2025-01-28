"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin } from "lucide-react";

export default function Header() {
  const [location, setLocation] = useState("");

  return (
    <header className="bg-white shadow-md p-4">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">Travel Advisor</h1>
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Enter location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-64"
          />
          <Button variant="outline" size="icon">
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <MapPin className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
