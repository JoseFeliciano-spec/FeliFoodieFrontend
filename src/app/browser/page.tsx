"use client";
import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  MapPin,
  Search,
  SlidersHorizontal,
  Star,
  Clock,
  Utensils,
  Tag,
  Users,
  Calendar,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface Restaurant {
  name: string;
  type: string;
  address: string;
  rating: number;
  reviews: number;
  price: string;
  discount?: string;
  badges: string[];
  images: string[];
}

const restaurants: Restaurant[] = [
  {
    name: "Le Reminet",
    type: "FRENCH",
    address: "3, rue des Grands Degrés, 75005, Paris",
    rating: 9.2,
    reviews: 18772,
    price: "€46",
    discount: "50% off food",
    badges: ["PAY", "Great Deal"],
    images: ["/placeholder.svg"],
  },
  {
    name: "La Rôtisserie du Marche Saint Germain",
    type: "FRENCH",
    address: "4 Rue Lobineau, 75006, Paris",
    rating: 9.1,
    reviews: 114,
    price: "€18",
    discount: "20% off food",
    badges: ["On A Budget"],
    images: ["/placeholder.svg"],
  },
];

export default function RestaurantListings() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const totalPages = 10;

  const generatePageNumbers = () => {
    const numbers: (number | string)[] = [];
    const pagesToShow = 5;
    const halfWay = Math.floor(pagesToShow / 2);

    if (totalPages <= pagesToShow) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= halfWay) {
      for (let i = 1; i <= pagesToShow - 1; i++) {
        numbers.push(i);
      }
      numbers.push("...", totalPages);
    } else if (currentPage > totalPages - halfWay) {
      numbers.push(1, "...");
      for (let i = totalPages - pagesToShow + 2; i <= totalPages; i++) {
        numbers.push(i);
      }
    } else {
      numbers.push(1, "...");
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        numbers.push(i);
      }
      numbers.push("...", totalPages);
    }

    return numbers;
  };

  return (
    <div className="min-h-screen bg-gray-50 px-10">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container px-4 md:px-6">
          {/* Search Bar - Full width on mobile */}
          <div className="py-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search restaurants..."
                className="w-full h-12 pl-10 pr-4 rounded-full border-2 focus:border-primary"
              />
            </div>
          </div>

          {/* Filters - Scrollable on mobile */}
          <ScrollArea className="pb-4">
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-shrink-0 h-10 px-4 rounded-full"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Date
              </Button>
              <Button
                variant="outline"
                className="flex-shrink-0 h-10 px-4 rounded-full"
              >
                <Clock className="mr-2 h-4 w-4" />
                Time
              </Button>
              <Button
                variant="outline"
                className="flex-shrink-0 h-10 px-4 rounded-full"
              >
                <Users className="mr-2 h-4 w-4" />
                Guests
              </Button>
              <Button
                variant="default"
                className="flex-shrink-0 h-10 px-4 rounded-full"
              >
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </header>

      <div className="container px-4 md:px-6 py-6">
        <div className="grid lg:grid-cols-[1fr_400px] gap-6">
          <div className="space-y-6">
            {/* Title and Sort */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                  Best restaurants in the area
                </h1>
                <p className="text-sm text-muted-foreground">
                  3,968 restaurants
                </p>
              </div>
              <Select defaultValue="rating">
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rating</SelectItem>
                  <SelectItem value="reviews">Most Reviews</SelectItem>
                  <SelectItem value="distance">Nearest First</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Restaurant Cards */}
            <div className="grid gap-6">
              {restaurants.map((restaurant, i) => (
                <Card
                  key={i}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col md:grid md:grid-cols-[1fr_1.5fr] lg:grid-cols-[1fr_1.5fr]">
                    <div className="relative">
                      <div className="absolute right-2 top-2 z-10">
                        <Button
                          size="icon"
                          variant="secondary"
                          className="rounded-full bg-white/90 hover:bg-white"
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="absolute left-2 top-2 z-10 flex flex-wrap gap-2">
                        {restaurant.badges.map((badge, index) => (
                          <Badge
                            key={index}
                            variant={badge === "PAY" ? "default" : "secondary"}
                            className="bg-white/90 text-xs"
                          >
                            {badge}
                          </Badge>
                        ))}
                      </div>
                      <div className="relative aspect-[4/3] bg-muted">
                        <img
                          src={restaurant.images[0]}
                          alt={restaurant.name}
                          className="object-cover w-full h-full"
                        />
                        <div className="absolute inset-x-0 bottom-0 flex justify-center gap-1 p-2">
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-7 w-7 rounded-full bg-white/90 hover:bg-white"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-7 w-7 rounded-full bg-white/90 hover:bg-white"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 md:p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h3 className="font-semibold text-lg line-clamp-1">
                            {restaurant.name}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {restaurant.type}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              Average price {restaurant.price}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="bg-primary text-primary-foreground text-sm font-medium px-2 py-1 rounded">
                            {restaurant.rating}
                          </div>
                          <span className="text-sm text-muted-foreground hidden sm:inline">
                            ({restaurant.reviews.toLocaleString()})
                          </span>
                        </div>
                      </div>
                      <Separator className="my-4" />
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <MapPin className="mt-1 h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <div className="text-sm">{restaurant.address}</div>
                        </div>
                        {restaurant.discount && (
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-medium text-red-500">
                              {restaurant.discount}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Special offer
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 py-4">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="hidden sm:flex"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <div className="hidden sm:flex items-center gap-2">
                {generatePageNumbers().map((page, index) => (
                  <Button
                    key={index}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => {
                      if (typeof page === "number") setCurrentPage(page);
                    }}
                    className={
                      typeof page === "string" ? "pointer-events-none" : ""
                    }
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <div className="sm:hidden flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
              </div>
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                className="hidden sm:flex"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Map - Hidden on mobile */}
          <div className="hidden lg:block sticky top-[144px] h-[calc(100vh-144px)]">
            <div className="h-full w-full rounded-lg overflow-hidden border bg-muted">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d11880.492291371422!2d12.4922309!3d41.8902102!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2s!4v1454410664178"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
