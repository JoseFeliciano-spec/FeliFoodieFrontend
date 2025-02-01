import { getUser } from "@/actions/auth/getUser";
import RestaurantPage from "@/components/restaurant/RestaurantPage";
import { Metadata } from "next";
import { axios } from "@/lib/axios"; // Usamos la misma instancia de axios

const fetchRestaurantMetadata = async (id: string) => {
  try {
    const response = await axios.get(`/v1/places/search-restaurant`, {
      params: { search: id },
      // Configuración de caché para Next.js (equivalente a { next: { revalidate: 3600 } })
      headers: {
        "Cache-Control": "public, s-maxage=3600",
        "CDN-Cache-Control": "public, s-maxage=3600",
        "Vercel-CDN-Cache-Control": "public, s-maxage=3600",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching restaurant metadata:", error);
    return null;
  }
};

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const restaurant = await fetchRestaurantMetadata(params.id);

  if (!restaurant) {
    return {
      title: "Restaurante no encontrado",
      description: "El restaurante solicitado no existe",
    };
  }

  const metadata: Metadata = {
    title: `${restaurant.name} | FeliFoodie`,
    description: `${restaurant.name} - ${restaurant.address}. Disfruta de una experiencia culinaria única. Calificación ⭐ ${restaurant.rating}/5. ${restaurant.priceLevel}`,
    openGraph: {
      title: restaurant.name,
      description: `Ubicado en ${
        restaurant.address
      } | Especialidades: ${restaurant.types?.join(", ")}`,
      type: "website",
      url: `/restaurantes/${params.id}`,
      images: restaurant.photos?.[0]?.url
        ? [
            {
              url: restaurant.photos[0].url,
              width: 1200,
              height: 630,
              alt: restaurant.name,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: restaurant.name,
      description: `Descubre ${restaurant.name} | Calificación ⭐ ${restaurant.rating}/5 | ${restaurant.address}`,
      images: {
        url: restaurant.photos?.[0]?.url || "/default-restaurant.jpg",
        alt: restaurant.name,
      },
    },
    keywords: [
      ...(restaurant.types || []),
      "restaurante",
      "comida",
      "gastronomía",
      restaurant.name?.split(" ")[0],
      restaurant.address?.split(",")[0],
    ],
    alternates: {
      canonical: `/restaurantes/${params.id}`,
    },
  };

  return metadata;
}

export default async function PageId({ params }: { params: { id: string } }) {
  const user = await getUser();

  return <RestaurantPage user={user?.data} id={params?.id} />;
}
