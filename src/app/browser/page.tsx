import BrowserHome from "@/components/browser/BrowserHome";
import { Metadata } from "next";
import { axios } from "@/lib/axios";

const fetchBrowserMetadata = async (city: string = "") => {
  try {
    const response = await axios.get("v1/places/browser-places", {
      params: {
        city,
        pageNo: 1,
        pageSize: 1,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching browser metadata:", error);
    return null;
  }
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { country?: string };
}): Promise<Metadata> {
  const browserData = await fetchBrowserMetadata(searchParams.country);

  const cityName = browserData?.city?.name || "Cartagena";
  const totalRestaurants = browserData?.totalResults || "varios";

  console.log(browserData);

  const metadata: Metadata = {
    title: `Explora los Mejores Restaurantes en ${cityName} | FeliFoodie`,
    description: `Descubre ${totalRestaurants} restaurantes en ${cityName}. Encuentra los mejores lugares para comer, calificaciones, reseñas y más.`,
    openGraph: {
      title: `Restaurantes en ${cityName} | FeliFoodie`,
      description: `Explora ${totalRestaurants} restaurantes en ${cityName}. Encuentra el lugar perfecto para tu próxima experiencia gastronómica.`,
      type: "website",
      url: `/browser${searchParams.country ? `/${searchParams.country}` : ""}`,
      images: [
        {
          url: browserData?.data?.[0]?.photo,
          width: 1200,
          height: 630,
          alt: `Restaurantes en ${cityName}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Restaurantes en ${cityName} | FeliFoodie`,
      description: `Descubre los mejores restaurantes en ${cityName}. Calificaciones, ubicaciones y reseñas de usuarios.`,
      images: {
        url: "/browser-og-image.jpg",
        alt: `Restaurantes en ${cityName}`,
      },
    },
    keywords: [
      "restaurantes",
      "comida",
      "gastronomía",
      cityName,
      "búsqueda de restaurantes",
      "mejores restaurantes",
      "donde comer",
      "reservas",
      "reseñas de restaurantes",
    ],
    alternates: {
      canonical: `/browser${
        searchParams.country ? `/${searchParams.country}` : ""
      }`,
    },
  };

  return metadata;
}

export default function Browser({ searchParams }: any) {
  return (
    <BrowserHome country={searchParams?.country} place={searchParams?.place} />
  );
}
