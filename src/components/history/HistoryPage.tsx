"use client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Heart, Star, MapPin, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { axios } from "@/lib/axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Custom hook para obtener el historial de lugares
export const useHistoryPlaces = (
  page: number,
  pageSize: number = 8,
  user: any
) => {
  return useQuery<any>({
    queryKey: ["historyPlaces", page, pageSize, user],
    queryFn: () => {
      return axios.get(
        `/v1/history-places?pageNo=${page}&pageSize=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "application/json",
          },
        }
      );
    },
  });
};

const HistoryPage = ({ user }: any) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const {
    data: paginatedData,
    isLoading,
    isError,
    error,
  } = useHistoryPlaces(currentPage, itemsPerPage, user);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-red-500">
          Error al cargar los lugares:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </div>
      </div>
    );
  }

  return (
    <section className="w-full min-h-screen bg-gray-50 px-4 py-6 md:px-8 lg:px-16">
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">
            Historial de lugares
          </h1>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-5 h-5" />
            <span className="text-sm">
              {paginatedData?.total || 0} lugares visitados
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {paginatedData?.data.map((place: any) => (
            <HistoryCard key={place.placeId} place={place} />
          ))}
        </div>

        {(paginatedData?.totalPages ?? 0) > 1 && (
          <Pagination className="mt-8">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={cn(
                    "cursor-pointer",
                    !paginatedData?.hasPreviousPage &&
                      "pointer-events-none opacity-50"
                  )}
                  title="Anterior"
                />
              </PaginationItem>

              {[...Array(paginatedData?.totalPages)].map((_, index) => {
                const page = index + 1;

                if (paginatedData?.totalPages > 7) {
                  if (
                    page === 1 ||
                    page === paginatedData.totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => handlePageChange(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  } else if (
                    page === currentPage - 2 ||
                    page === currentPage + 2
                  ) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }
                  return null;
                }

                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => handlePageChange(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    handlePageChange(
                      Math.min(paginatedData?.totalPages ?? 1, currentPage + 1)
                    )
                  }
                  title="Siguiente"
                  className={cn(
                    "cursor-pointer",
                    !paginatedData?.hasNextPage &&
                      "pointer-events-none opacity-50"
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </section>
  );
};

const HistoryCard = ({ place }: { place: any }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const router = useRouter();

  const formatDate = (date?: Date) => {
    if (!date) return "";
    return new Intl.DateTimeFormat("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  };

  // Determinar el tipo principal del lugar para mostrar
  const getPrimaryType = (types?: string[]) => {
    if (!types || types.length === 0) return "Lugar";
    const priorityTypes = ["restaurant", "cafe", "bar", "store", "park"];
    const foundType = types.find((type) => priorityTypes.includes(type));
    return foundType
      ? foundType.charAt(0).toUpperCase() + foundType.slice(1)
      : types[0];
  };

  return (
    <div
      key={place.placeId}
      className="group cursor-pointer bg-white rounded-xl 
                shadow-md hover:shadow-lg transition-all 
                duration-300 overflow-hidden"
      onClick={() => router.push(`/${place.placeId}`)}
    >
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={place?.photo || "/placeholder.jpg"}
          alt={place.name}
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
          <h3 className="font-semibold text-lg truncate pr-2">{place.name}</h3>
          {place.rating && (
            <div className="flex items-center gap-x-1 shrink-0">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="font-semibold text-sm">{place.rating}</span>
            </div>
          )}
        </div>

        {place.address && (
          <div className="flex items-center text-sm text-gray-600 gap-x-2">
            <MapPin className="w-4 h-4 shrink-0" />
            <span className="truncate">{place.address}</span>
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{getPrimaryType(place.types)}</span>
          <span className="text-gray-500 text-sm">
            {formatDate(place.accessedAt)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
