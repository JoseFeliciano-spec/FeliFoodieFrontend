"use client";
import { MapPin, LocateFixed, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import CommandSearch from "@/components/ui/form/CommandSearch";
import toast from "react-hot-toast";
import { useCallback } from "react";

export default function HomeSearch() {
  const { control, handleSubmit, setValue } = useForm();

  const onClick = (e: any) => {
    console.log(e);
  };

  const onClickAdd = useCallback(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log(latitude, longitude);
          setValue("ubication", `${latitude}-${longitude}`);
        },
        (error) => {
          console.error("Error obteniendo la ubicación:", error.message);
          toast.error("Ha ocurrido un error al obtener la ubicación");
        }
      );
    } else {
      toast.error("Geolocalización no es compatible en este navegador.");
    }
  }, [setValue]);

  return (
    <div className="bg-white rounded-md h-16 w-full lg:w-3/4 flex items-center justify-between pr-2">
      <div className="flex w-full h-full">
        <CommandSearch
          control={control}
          name="country"
          url="v1/places/search"
          required={true}
          className="z-20"
          classNameDropdown="!z-20"
          placeholder="Buscar ciudad"
          onValueChange={(locationId) => console.log("Selected:", locationId)}
          mappingData={(item) => ({
            id: item.cityId,
            name: item.fullName,
            icon: <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />,
          })}
          itemAdd={[
            {
              id: "cerano",
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
          className="w-72 z-20"
          classNameDropdown="!w-72 !z-20"
          url="v1/places/search-places"
          required={true}
          placeholder="Buscar Lugar"
          onValueChange={(locationId) => console.log("Selected:", locationId)}
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
        className="bg-principal-color w-28"
      >
        Buscar
      </Button>
    </div>
  );
}
