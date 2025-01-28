"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Layers } from "lucide-react";

export default function Map() {
  const [zoom, setZoom] = useState(12);

  return (
    <div className="relative w-full h-[calc(100vh-128px)] bg-gray-200 rounded-lg overflow-hidden">
      <div className="absolute inset-0 bg-blue-100 flex items-center justify-center">
        <span className="text-4xl font-bold text-blue-500">
          Map Placeholder
        </span>
      </div>
      <div className="absolute bottom-4 right-4 space-y-2">
        <Button
          variant="secondary"
          size="icon"
          onClick={() => setZoom(Math.min(zoom + 1, 20))}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={() => setZoom(Math.max(zoom - 1, 1))}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="secondary" size="icon">
          <Layers className="h-4 w-4" />
        </Button>
      </div>
      <div className="absolute bottom-4 left-4 bg-white px-2 py-1 rounded-md shadow-md">
        Zoom: {zoom}x
      </div>
    </div>
  );
}
