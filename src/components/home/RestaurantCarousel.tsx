"use client";
import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Heart, Star, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

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

const RestaurantCarousel = ({ datos }: RestaurantCarouselProps) => {
  const [currentCity, setCurrentCity] = useState(0);

  const nextCity = () => {
    setCurrentCity((prev) => (prev + 1) % datos.length);
  };

  const previousCity = () => {
    setCurrentCity((prev) => (prev - 1 + datos.length) % datos.length);
  };

  return (
    <section className="w-full px-4 py-6 md:px-8 lg:px-16">
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 space-y-4 md:space-y-0">
          <h2 className="text-xl md:text-2xl font-semibold text-center md:text-left w-full">
            Restaurantes en {datos[currentCity ?? 0].ciudad}
          </h2>

          <div className="flex gap-2 justify-center w-full md:justify-end">
            <button
              onClick={previousCity}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 
                         transition-colors active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextCity}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 
                         transition-colors active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {datos[currentCity].restaurantes.map((restaurant) => (
            <RestaurantCard
              key={restaurant.referencia}
              restaurant={restaurant}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const RestaurantCard = ({ restaurant }: { restaurant: Restaurant }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const router = useRouter();

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
    <div
      key={restaurant?.referencia}
      className="group cursor-pointer bg-white rounded-xl 
                    shadow-md hover:shadow-lg transition-all 
                    duration-300 overflow-hidden"
      onClick={() => {
        router.push(`/${restaurant?.referencia}`);
      }}
    >
      <div className="relative aspect-video overflow-hidden">
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
          className="absolute top-3 right-3 p-2 rounded-full 
                     bg-white/80 backdrop-blur-sm 
                     hover:bg-white transition-colors 
                     active:scale-90"
        >
          <Heart
            className={cn(
              "w-5 h-5 transition-colors",
              isFavorite ? "fill-red-500 stroke-red-500" : "stroke-gray-600"
            )}
          />
        </button>
      </div>

      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg truncate pr-2">
            {restaurant.nombre}
          </h3>
          <div className="flex items-center gap-x-1 shrink-0">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="font-semibold text-sm">
              {restaurant.calificacion}
            </span>
          </div>
        </div>

        <div className="flex items-center text-sm text-gray-600 gap-x-2">
          <MapPin className="w-4 h-4 shrink-0" />
          <span className="truncate">{restaurant.direccion}</span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            {getPriceIndicator(restaurant.precio)} • {restaurant.precio}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCarousel;
