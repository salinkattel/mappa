"use client";
import Link from "next/link";
import { Menu, Globe, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Header() {
  return (
    <header className="absolute top-0 left-0 z-50 w-full bg-transparent">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Globe className="h-6 w-6 text-teal-400" />
              <span className="font-bold text-xl hidden sm:inline-block">
                TravelNepal
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="#"
              className="text-sm font-medium hover:text-teal-400 transition-colors"
            >
              Destinations
            </Link>
            <Link
              href="#"
              className="text-sm font-medium hover:text-teal-400 transition-colors"
            >
              Treks
            </Link>
            <Link
              href="#"
              className="text-sm font-medium hover:text-teal-400 transition-colors"
            >
              Experiences
            </Link>
            <Link
              href="#maps"
              className="text-sm font-medium hover:text-teal-400 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                const mapSection = document.getElementById("maps-section");
                if (mapSection) {
                  mapSection.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              Maps
            </Link>
            <Link
              href="#"
              className="text-sm font-medium hover:text-teal-400 transition-colors"
            >
              About
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex text-white hover:text-teal-400"
            >
              <Search className="h-5 w-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src="/placeholder.svg?height=32&width=32"
                      alt="User"
                    />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Saved Trips</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col space-y-4 mt-8">
                  <Link
                    href="#"
                    className="text-lg font-medium hover:text-teal-400 transition-colors"
                  >
                    Destinations
                  </Link>
                  <Link
                    href="#"
                    className="text-lg font-medium hover:text-teal-400 transition-colors"
                  >
                    Treks
                  </Link>
                  <Link
                    href="#"
                    className="text-lg font-medium hover:text-teal-400 transition-colors"
                  >
                    Experiences
                  </Link>
                  <Link
                    href="#maps"
                    className="text-lg font-medium hover:text-teal-400 transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      const mapSection =
                        document.getElementById("maps-section");
                      if (mapSection) {
                        mapSection.scrollIntoView({ behavior: "smooth" });
                        // Close the sheet after clicking
                        const closeButton = document.querySelector(
                          "[data-radix-collection-item]"
                        );
                        if (closeButton instanceof HTMLElement) {
                          closeButton.click();
                        }
                      }
                    }}
                  >
                    Maps
                  </Link>
                  <Link
                    href="#"
                    className="text-lg font-medium hover:text-teal-400 transition-colors"
                  >
                    About
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
