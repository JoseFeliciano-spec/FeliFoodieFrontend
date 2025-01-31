"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import { ChevronLeft, ChevronRight, Heart, MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import BrowserMap from "./BrowserMap";
import { useRouter } from "next/navigation";

const fetchPlaces = async (
  city: string,
  place: string = "",
  pageNo: number = 1,
  pageSize: number = 10
) => {
  return axios.get("v1/places/browser-places", {
    params: { city, place, pageNo, pageSize },
  });
};

export default function BrowserHome({ country, place }: any) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchTerm, setSearchTerm] = React.useState(place);
  const defaultCity = "10.402358714285715@-75.5140587857143";

  const {
    data: placesData,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useQuery({
    queryFn: () => fetchPlaces(country ?? defaultCity, searchTerm, currentPage),
    queryKey: ["places", defaultCity, searchTerm, currentPage],
  });

  // Pagination calculations
  const totalPages = placesData
    ? Math.ceil(
        parseInt(placesData?.data?.totalResults) /
          parseInt(placesData?.data?.pageSize)
      )
    : 0;

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

  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 px-10">
      {/* Mobile Header - Visible only on mobile */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container px-4 md:px-6">
          {/* Search Bar - Full width on mobile */}
          <div className="py-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar restaurantes..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-12 pl-10 pr-4 rounded-full border-2 focus:border-primary"
              />
            </div>
          </div>

          {/* Mobile Filters - Scrollable */}
          {/* <ScrollArea className="pb-4">
            <div className="flex gap-2">
              {mobileFilters.map((filter, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="flex-shrink-0 h-10 px-4 rounded-full"
                  onClick={() => {
                    setMobileFiltersOpen(true);
                  }}
                >
                  {filter.icon}
                  {filter.label}
                </Button>
              ))}
              <Button
                variant="default"
                className="flex-shrink-0 h-10 px-4 rounded-full"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filtros
              </Button>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea> */}
        </div>
      </header>

      {/* Rest of the previous component remains the same, 
          but replace restaurants array with placesData?.data */}
      <div className="w-full px-4 md:px-10 py-6">
        <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
          <div className="space-y-6">
            {/* Title and Sort */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                  Mejores restaurantes en el área
                </h1>
                <p className="text-sm text-muted-foreground">
                  {placesData?.data?.totalResults || 0} restaurantes
                </p>
              </div>
              <Select defaultValue="rating">
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Mayor Calificación</SelectItem>
                  <SelectItem value="reviews">Más Reseñas</SelectItem>
                  <SelectItem value="distance">Más Cercanos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Loading and Error States */}
            {isLoading && (
              <div className="text-center py-6">Cargando restaurantes...</div>
            )}
            {isError && (
              <div className="text-center text-red-500 py-6">
                Error al cargar restaurantes:{" "}
                {error instanceof Error ? error.message : "Error desconocido"}
              </div>
            )}

            {/* Restaurant Cards */}
            <div className="grid gap-6">
              {placesData?.data?.data?.map((restaurant: any) => (
                <Card
                  key={restaurant.placeId}
                  onClick={() => {
                    router.push(`/${restaurant?.placeId}`);
                  }}
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
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
                      <div className="relative aspect-[4/3] bg-muted">
                        {restaurant.photo ? (
                          <img
                            src={restaurant.photo}
                            alt={restaurant.name}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full text-muted-foreground">
                            Sin imagen
                          </div>
                        )}
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
                              {restaurant.types?.[0]?.toUpperCase() ||
                                "Sin tipo"}
                            </Badge>
                          </div>
                        </div>
                        {restaurant.rating && (
                          <div className="flex items-center gap-1">
                            <div className="bg-primary text-primary-foreground text-sm font-medium px-2 py-1 rounded">
                              {restaurant.rating}
                            </div>
                          </div>
                        )}
                      </div>
                      <Separator className="my-4" />
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <MapPin className="mt-1 h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <div className="text-sm">{restaurant.address}</div>
                        </div>
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
                onClick={() => {
                  setCurrentPage((prev) => Math.max(prev - 1, 1));
                  if (typeof window !== "undefined") {
                    window.scrollTo(0, 0); // Desplazar al inicio solo si 'window' está disponible
                  }
                }}
                className="hidden sm:flex"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Anterior
              </Button>
              <div className="hidden sm:flex items-center gap-2">
                {generatePageNumbers().map((page, index) => (
                  <Button
                    key={index}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => {
                      if (typeof page === "number") setCurrentPage(page);
                      if (typeof window !== "undefined") {
                        window.scrollTo(0, 0); // Desplazar al inicio solo si 'window' está disponible
                      }
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
                  Página {currentPage} de {totalPages}
                </span>
              </div>
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => {
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                  if (typeof window !== "undefined") {
                    window.scrollTo(0, 0); // Desplazar al inicio solo si 'window' está disponible
                  }
                }}
                className="hidden sm:flex"
              >
                Siguiente
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Map */}
          <div className="hidden lg:block sticky top-[144px] h-[calc(100vh-144px)] w-full">
            <div className="h-full w-full rounded-lg overflow-hidden border bg-muted">
              {isSuccess && <BrowserMap places={placesData?.data?.data} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
