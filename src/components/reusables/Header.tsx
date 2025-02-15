"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin } from "lucide-react";

export default function Header() {
  const [location, setLocation] = useState("");

  return (
    <header className="bg-[#222831] shadow-md p-4">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#00ADB5]">Travel Advisor</h1>
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Enter location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-64 bg-[#393E46] text-white border border-[#00ADB5] placeholder-gray-400 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#00ADB5] focus:outline-none"
          />
          <Button
            variant="outline"
            size="icon"
            className="border border-[#00ADB5] text-[#00ADB5] hover:bg-[#00ADB5] hover:text-white transition"
          >
            <Search className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="border border-[#00ADB5] text-[#00ADB5] hover:bg-[#00ADB5] hover:text-white transition"
          >
            <MapPin className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
