import React, { useState, useMemo } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { FaStar, FaMapMarkerAlt, FaHeart, FaShareAlt } from "react-icons/fa";

interface Location {
  lat: number;
  lng: number;
}

interface Place {
  placeId: string;
  location: Location;
  name: string;
  rating?: number;
  address?: string;
  photo?: string;
  types?: string[];
  price?: number;
}

interface BrowserMapProps {
  places: Place[];
  initialCenter?: Location;
}

const BrowserMap = ({ places, initialCenter }: BrowserMapProps) => {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  const defaultCenter = useMemo(() => {
    if (initialCenter) return initialCenter;
    if (places?.length > 0) return places?.[0].location;
    return { lat: 19.4326, lng: -99.1332 }; // Default to Mexico City
  }, [initialCenter, places]);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const mapContainerStyle = {
    width: "100%",
    height: "100%",
    borderRadius: "0.75rem",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  };

  const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "landscape",
        stylers: [{ color: "#f5f5f5" }],
      },
    ],
  };

  const handleSelectPlace = (place: Place) => {
    setSelectedPlace(place);
  };

  const toggleFavorite = (placeId: string) => {
    setFavorites((prev) =>
      prev.includes(placeId)
        ? prev.filter((id) => id !== placeId)
        : [...prev, placeId]
    );
  };

  if (loadError) return <div className="text-red-500">Error al Cargar Mapa</div>;
  if (!isLoaded) return <div className="animate-pulse">Cargando...</div>;

  return (
    <div className="hidden lg:block sticky top-[144px] h-[calc(100vh-144px)]">
      <div className="h-full w-full rounded-xl overflow-hidden shadow-lg">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={12}
          center={defaultCenter}
          options={mapOptions}
          key={`${defaultCenter.lat}-${defaultCenter.lng}`}
        >
          {places.map((place) => (
            <Marker
              key={place.placeId}
              position={place.location}
              icon={{
                url:
                  "data:image/svg+xml;utf8," +
                  encodeURIComponent(`
                  <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24">
                    <path fill="#FF5722" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    <circle cx="12" cy="9" r="2.5" fill="#FFFFFF"/>
                    <circle cx="12" cy="9" r="1.5" fill="#FF5722"/>
                  </svg>
                `),
                scaledSize: new window.google.maps.Size(50, 50),
              }}
              onClick={() => handleSelectPlace(place)}
            />
          ))}

          {selectedPlace && (
            <InfoWindow
              position={selectedPlace.location}
              onCloseClick={() => setSelectedPlace(null)}
            >
              <div className="p-4 max-w-[320px] relative">
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    onClick={() => toggleFavorite(selectedPlace.placeId)}
                    className="text-white bg-black/50 p-2 rounded-full hover:bg-black/70 transition"
                  >
                    <FaHeart
                      className={`${
                        favorites.includes(selectedPlace.placeId)
                          ? "text-red-500"
                          : "text-white"
                      }`}
                    />
                  </button>
                  <button className="text-white bg-black/50 p-2 rounded-full hover:bg-black/70 transition">
                    <FaShareAlt className="text-white" />
                  </button>
                </div>

                {selectedPlace.photo && (
                  <img
                    src={selectedPlace.photo}
                    alt={selectedPlace.name}
                    className="w-full h-[240px] object-cover rounded-xl mb-4 shadow-md"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                )}

                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold mr-2 flex-grow">
                    {selectedPlace.name}
                  </h3>
                  {selectedPlace.rating && (
                    <div className="flex items-center text-yellow-500 bg-white rounded-full px-2 py-1 shadow-sm">
                      <FaStar className="mr-1" />
                      <span>{selectedPlace.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>

                {selectedPlace.address && (
                  <p className="text-sm text-gray-600 mb-2 flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-gray-400" />
                    {selectedPlace.address}
                  </p>
                )}

                <div className="flex justify-between items-center mt-2">
                  {selectedPlace.price && (
                    <div className="font-semibold text-lg text-gray-800">
                      ${selectedPlace.price}/night
                    </div>
                  )}

                  {selectedPlace.types && (
                    <div className="flex flex-wrap gap-2">
                      {selectedPlace.types.slice(0, 3).map((type) => (
                        <span
                          key={type}
                          className="bg-gray-100 text-xs px-2 py-1 rounded-full"
                        >
                          {type.replace(/_/g, " ")}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
    </div>
  );
};

export default BrowserMap;
