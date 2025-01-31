"use client";
import { MapPin, LocateFixed, Landmark } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useForm, FormProvider } from "react-hook-form";
import CommandSearch from "@/components/ui/form/CommandSearch";
import toast from "react-hot-toast";
import { useState } from "react";

export default function HomeSearch() {
  const methods = useForm<{
    country: string | null;
    ubitation: string | null;
    place: string | null;
  }>({
    defaultValues: {
      country: null,
      ubitation: null,
      place: null,
    },
  });

  const { control, handleSubmit, setValue } = methods;
  const router = useRouter();
  const [isLocationLoading, setIsLocationLoading] = useState(false);

  const onClickAdd = async (): Promise<{
    latitude: number;
    longitude: number;
  }> => {
    setIsLocationLoading(true);
    try {
      return await new Promise<{ latitude: any; longitude: any }>(
        (resolve, reject) => {
          if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const { latitude, longitude } = position.coords;
                resolve({ latitude, longitude });
              },
              (error) => {
                reject(
                  new Error("Error obteniendo la ubicación: " + error.message)
                );
              }
            );
          } else {
            reject(
              new Error("Geolocalización no es compatible en este navegador.")
            );
          }
        }
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error desconocido");
      throw error;
    } finally {
      setIsLocationLoading(false);
    }
  };

  const onClick = (data: any) => {
    if (data?.country === "Cercano") {
      router.push(
        `/browser?country=${data?.ubitation}&place=${data?.place ?? ""}`
      );
    } else {
      router.push(
        `/browser?country=${data?.country}&place${data?.place ?? ""}`
      );
    }
  };

  return (
    <FormProvider {...methods}>
      <div
        className="flex flex-col w-full max-w-xl space-y-4 
                    lg:bg-white lg:rounded-md lg:h-16 lg:flex-row lg:items-center lg:space-y-0 lg:pr-2 z-20"
      >
        <div
          className="flex flex-col w-full space-y-4 
                     lg:flex-row lg:space-y-0 lg:space-x-2 lg:h-full"
        >
          <CommandSearch
            control={control}
            name="country"
            url="v1/places/search"
            required={true}
            className="w-full z-40 max-lg:h-14"
            classNameDropdown="!z-40"
            placeholder="Buscar ciudad"
            onValueChange={async (location) => {
              try {
                const { latitude, longitude } = await location();

                if (latitude !== null && longitude !== null) {
                  setValue("ubitation", `${latitude}@${longitude}`);
                } else {
                  throw new Error("Ubicación no disponible");
                }
              } catch {
                toast.error("Error al obtener la ubicación");
              }
            }}
            mappingData={(item) => ({
              id: item.cityId,
              name: item.fullName,
              icon: (
                <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
              ),
            })}
            itemAdd={[
              {
                id: "cercano",
                name: "Cercano",
                icon: (
                  <LocateFixed className="h-4 w-4 text-muted-foreground shrink-0" />
                ),
                onClick: onClickAdd,
              },
            ]}
          />
          <CommandSearch
            control={control}
            name="place"
            className="w-full lg:w-72 z-30 max-lg:h-14"
            classNameDropdown="!w-72 !z-30"
            url="v1/places/search-places"
            placeholder="Buscar Lugar"
            mappingData={(item) => ({
              id: item.placeId,
              name: item.name,
              icon: (
                <Landmark className="h-4 w-4 text-muted-foreground shrink-0" />
              ),
            })}
          />
        </div>
        <Button
          onClick={handleSubmit(onClick)}
          disabled={isLocationLoading}
          className="w-full py-6 bg-principal-color text-white 
                     lg:w-32 lg:py-2 lg:px-4
                     rounded-md hover:bg-opacity-90 
                     transition-colors duration-300 
                     shadow-md active:scale-95 z-20"
        >
          {isLocationLoading ? "Cargando..." : "Buscar"}
        </Button>
      </div>
    </FormProvider>
  );
}
