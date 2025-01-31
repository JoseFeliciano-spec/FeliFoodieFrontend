"use client";
import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Heart, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Restaurant {
  nombre: string;
  calificacion: number;
  direccion: string;
  imagen: string | null;
  precio: string;
  referencia: string;
}

interface CityData {
  ciudad: string;
  restaurantes: Restaurant[];
}

interface RestaurantCarouselProps {
  datos: CityData[];
}

export default function RestaurantCarousel({ datos }: RestaurantCarouselProps) {
  const [currentCity, setCurrentCity] = useState(0);

  const nextCity = () => {
    setCurrentCity((prev) => (prev + 1) % datos.length);
  };

  const previousCity = () => {
    setCurrentCity((prev) => (prev - 1 + datos.length) % datos.length);
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">
          Restaurantes en {datos[currentCity ?? 0].ciudad}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={previousCity}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextCity}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {datos[currentCity].restaurantes.map((restaurant) => (
          <RestaurantCard key={restaurant.referencia} restaurant={restaurant} />
        ))}
      </div>
    </div>
  );
}

function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  const [isFavorite, setIsFavorite] = useState(false);

  // Function to get price indicator
  const getPriceIndicator = (price: string) => {
    switch (price.toLowerCase()) {
      case "económico":
        return "$";
      case "moderado":
        return "$$";
      case "costoso":
        return "$$$";
      default:
        return "$$";
    }
  };

  return (
    <div className="group cursor-pointer space-y-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
        <Image
          src={restaurant.imagen || "/placeholder.jpg"}
          alt={restaurant.nombre}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
        >
          <Heart
            className={cn(
              "w-5 h-5 transition-colors",
              isFavorite ? "fill-red-500 stroke-red-500" : "stroke-gray-600"
            )}
          />
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">{restaurant.nombre}</h3>
          <div className="flex gap-x-1">
            <Star className="w-5 h-5" />

            <span className="font-semibold">{restaurant.calificacion}</span>
          </div>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <span>{restaurant.direccion}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            {getPriceIndicator(restaurant.precio)} • {restaurant.precio}
          </span>
        </div>
      </div>
    </div>
  );
}
