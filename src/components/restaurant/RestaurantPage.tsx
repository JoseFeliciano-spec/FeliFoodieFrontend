"use client";
import React, { useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import Image from "next/image";
import {
  Star,
  MapPin,
  Heart,
  Globe,
  Share2,
  Navigation,
  Clock,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UtensilsCrossed } from "lucide-react";
import { useRouter } from "next/navigation";

const RestaurantNotFound = () => {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Alert variant="destructive" className="mb-6">
          <UtensilsCrossed className="h-5 w-5" />
          <AlertTitle className="ml-2">Restaurante no encontrado</AlertTitle>
          <AlertDescription>
            Lo sentimos, no pudimos encontrar el restaurante que estás buscando.
          </AlertDescription>
        </Alert>

        <div className="text-center space-y-4">
          <p className="text-gray-600">
            Esto puede deberse a que el restaurante ya no existe o la
            información no está disponible en este momento.
          </p>

          <div className="flex flex-col gap-2">
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="w-full"
            >
              Volver atrás
            </Button>

            <Button onClick={() => router.push("/")} className="w-full">
              Ir al inicio
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const fetchRestaurant = (placeId: string) => {
  return axios.get(`/v1/places/search-restaurant`, {
    params: { search: placeId },
  });
};

export default function RestaurantPage({
  id,
  user,
}: {
  id: string;
  user?: any;
}) {
  const [isFavorite, setIsFavorite] = React.useState(false);

  const {
    data: restaurant,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["restaurant", id],
    queryFn: () => fetchRestaurant(id),
  });

  const mutation = useMutation({
    mutationFn: ({ body }: any) => {
      return axios.post("v1/history-places", body, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      });
    },
  });

  const onSubmit = async (body: any) => {
    await mutation.mutateAsync({
      body: { ...body, photo: body?.photos?.[0].url },
    });
  };

  useEffect(() => {
    if (user && restaurant) {
      onSubmit(restaurant?.data);
    }
  }, [user, restaurant?.data]);

  if (isLoading)
    return <div className="min-h-screen bg-gray-50 p-8">Cargando...</div>;

  if (isError) return <div>Error: {error.message}</div>;

  const restaurantData = restaurant?.data;

  if (!restaurantData) return <RestaurantNotFound />;

  const isCurrentlyOpen = () => {
    if (!restaurantData?.openingHours) return false;
    const now = new Date();
    const days = [
      "domingo",
      "lunes",
      "martes",
      "miércoles",
      "jueves",
      "viernes",
      "sábado",
    ];
    const today = days[now.getDay()];
    const currentHours = restaurantData.openingHours.find((h: any) =>
      h.toLowerCase().startsWith(today)
    );
    if (!currentHours) return false;

    const [, hours] = currentHours.split(": ");
    const [open, close] = hours.split("–");
    const currentTime = now.getHours() * 100 + now.getMinutes();
    const openTime = parseInt(open?.split(":").join(""));
    const closeTime = parseInt(close?.split(":").join(""));

    return currentTime >= openTime && currentTime <= closeTime;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex justify-between items-start">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {restaurantData?.name}
            </h1>
            <Button
              variant="ghost"
              size="icon"
              className="mt-1"
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <Heart
                className={`w-6 h-6 ${
                  isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"
                }`}
              />
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center">
              <Star className="w-5 h-5 text-yellow-400 mr-1" />
              <span className="font-semibold text-gray-900">
                {restaurantData?.rating}
              </span>
              <span className="ml-1">
                ({restaurantData?.totalRatings} reseñas)
              </span>
            </div>
            <Badge variant={"secondary"}>
              {isCurrentlyOpen() ? "Abierto" : "Cerrado"}
            </Badge>
            <Badge variant="outline">{restaurantData?.priceLevel}</Badge>
          </div>

          <div className="flex flex-col gap-2 text-gray-600">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>{restaurantData?.address}</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {restaurantData?.types?.map((type: any, index: any) => (
                <Badge key={index} variant="secondary" className="capitalize">
                  {type.replace(/_/g, " ")}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-12 gap-4 mb-8">
          <div className="col-span-12 lg:col-span-8 h-96 relative rounded-xl overflow-hidden">
            {restaurantData?.photos?.[0]?.url && (
              <Image
                src={restaurantData?.photos?.[0]?.url}
                alt={restaurantData.name}
                fill
                className="object-cover w-full h-full"
              />
            )}
          </div>
          <div className="col-span-12 lg:col-span-4 grid grid-rows-2 gap-4">
            {restaurantData?.photos
              ?.slice(1, 3)
              .map((photo: any, index: any) => (
                <div
                  key={index}
                  className="h-full relative rounded-xl overflow-hidden"
                >
                  <Image
                    src={photo?.url}
                    fill
                    alt={`${restaurantData.name} ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="w-full border-b">
                <TabsTrigger value="info" className="text-base">
                  Información
                </TabsTrigger>
                <TabsTrigger value="reviews" className="text-base">
                  Reseñas ({restaurantData?.reviews?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="photos" className="text-base">
                  Fotos ({restaurantData?.photos?.length || 0})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="pt-6">
                <div className="space-y-8">
                  {/* Hours Section */}
                  <div>
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                      <Clock className="w-5 h-5 mr-2" />
                      Horario de Apertura
                    </h2>
                    <div className="grid gap-2 text-gray-600">
                      {restaurantData?.openingHours?.map(
                        (hours: any, index: any) => {
                          const [day, time] = hours.split(": ");
                          const isToday =
                            new Date()
                              .toLocaleDateString("es-ES", { weekday: "long" })
                              .toLowerCase() === day.toLowerCase();
                          return (
                            <div
                              key={index}
                              className={`flex justify-between py-2 border-b ${
                                isToday ? "bg-gray-50 font-medium" : ""
                              }`}
                            >
                              <span className="capitalize">{day}</span>
                              <span>{time}</span>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>

                  {/* Location Section */}
                  <div>
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                      <Navigation className="w-5 h-5 mr-2" />
                      Ubicación
                    </h2>
                    <div className="aspect-video relative rounded-xl overflow-hidden bg-gray-100">
                      <Alert>
                        <AlertDescription>
                          Mapa no disponible en este momento
                        </AlertDescription>
                      </Alert>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="pt-6">
                <div className="space-y-6">
                  {/* Review Summary */}
                  <div className="bg-gray-50 p-6 rounded-xl mb-6">
                    <h3 className="text-xl font-semibold mb-4">
                      Resumen de Reseñas
                    </h3>
                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-gray-900">
                          {restaurantData?.rating}
                        </div>
                        <div className="text-sm text-gray-500">
                          Calificación General
                        </div>
                      </div>
                      <div className="flex-1">
                        {[5, 4, 3, 2, 1].map((rating) => {
                          const count =
                            restaurantData?.reviews?.filter(
                              (r: any) => r.rating === rating
                            ).length || 0;
                          const percentage =
                            (count / (restaurantData?.reviews?.length || 1)) *
                            100;
                          return (
                            <div
                              key={rating}
                              className="flex items-center gap-2"
                            >
                              <span className="w-8 text-sm text-gray-600">
                                {rating}★
                              </span>
                              <div className="flex-1 h-2 bg-gray-200 rounded-full">
                                <div
                                  className="h-2 bg-yellow-400 rounded-full"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Individual Reviews */}
                  {restaurantData?.reviews?.map((review: any, index: any) => (
                    <div key={index} className="border-b pb-6 last:border-b-0">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 relative rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                          <Image
                            fill
                            src={review?.profilePhotoUrl}
                            alt={review.authorName}
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{review.authorName}</h3>
                          <div className="flex items-center gap-2 my-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={16}
                                  className={
                                    i < review.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">
                              {review.relativeTimeDescription}
                            </span>
                          </div>
                          <p className="text-gray-600 whitespace-pre-line">
                            {review.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="photos" className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {restaurantData?.photos?.map((photo: any, index: any) => (
                    <div
                      key={index}
                      className="aspect-square relative rounded-xl overflow-hidden"
                    >
                      <Image
                        src={photo?.url}
                        fill
                        alt={`${restaurantData.name} ${index + 1}`}
                        className="object-cover w-full h-full hover:scale-105 transition-transform"
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <Badge variant={"secondary"} className="px-3 py-1">
                      {isCurrentlyOpen() ? "Abierto ahora" : "Cerrado"}
                    </Badge>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        navigator.share({
                          title: restaurantData?.name,
                          text: `Visita ${restaurantData?.name}`,
                          url: window.location.href,
                        })
                      }
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <Button
                      onClick={() => {
                        window.open(
                          "https://github.com/JoseFeliciano-spec?tab=repositories",
                          "_blank"
                        );
                      }}
                      className="w-full bg-primary text-white hover:bg-primary/90 h-12"
                    >
                      Ir a mi github
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() =>
                        window.open(
                          `https://www.google.com/maps/search/?api=1&query=${restaurantData?.location?.lat},${restaurantData?.location?.lng}`,
                          "_blank"
                        )
                      }
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      Cómo llegar
                    </Button>

                    {restaurantData?.website && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() =>
                          window.open(restaurantData.website, "_blank")
                        }
                      >
                        <Globe className="w-4 h-4 mr-2" />
                        Visitar sitio web
                      </Button>
                    )}
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="font-semibold mb-2">
                      Información adicional
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Precio: {restaurantData?.priceLevel}</li>
                      <li>• {restaurantData?.totalRatings} reseñas en total</li>
                      <li>
                        • Calificación promedio: {restaurantData?.rating}/5
                      </li>
                      <li>
                        • Ubicado en {restaurantData?.address?.split(",")[3]}
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Mobile Action Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() =>
              window.open(
                `https://www.google.com/maps/search/?api=1&query=${restaurantData?.location?.lat},${restaurantData?.location?.lng}`,
                "_blank"
              )
            }
          >
            <Navigation className="w-4 h-4 mr-2" />
            Cómo llegar
          </Button>
          <Button
            onClick={() => {
              window.open(
                "https://github.com/JoseFeliciano-spec?tab=repositories",
                "_blank"
              );
            }}
            className="flex-1 bg-primary text-white hover:bg-primary/90"
          >
            Ir a mi github
          </Button>
        </div>
      </div>
    </div>
  );
}
