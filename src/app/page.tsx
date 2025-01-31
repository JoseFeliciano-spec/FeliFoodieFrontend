import Image from "next/image";
import main_bg from "@/assets/png/main.png";
import HomeSearch from "@/components/home/HomeSearch";
import RestaurantCarousel from "@/components/home/RestaurantCarousel";
import { fetchPlacesTopHome } from "@/actions/home/place";

export default async function Page() {
  const data: any = await fetchPlacesTopHome();

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <main
        className="flex flex-col-reverse items-center justify-center 
                     px-4 py-8 bg-mobile-color lg:bg-principal-color 
                     min-h-[30rem] w-full 
                     lg:px-16 lg:flex-row lg:relative"
      >
        <div className="w-full min-w-fit lg:w-1/2 flex flex-col items-center lg:items-start space-y-6 lg:pr-8">
          <h1
            className="text-2xl text-center lg:text-left font-semibold text-white 
                       max-w-xl lg:w-3/4"
          >
            Descubre los mejores restaurantes en Cartagena y el mundo
          </h1>

          <HomeSearch />
        </div>

        <div
          className="w-full mt-4 flex justify-center 
                      lg:w-1/2 lg:mt-0 lg:absolute lg:right-16 lg:top-1/2 lg:-translate-y-1/2"
        >
          <Image
            src={main_bg}
            alt="Logo"
            className="object-contain w-1/3 md:w-1/4"
          />
        </div>
      </main>
      <section
        className="w-full px-4 md:px-8 lg:px-16 
                   max-w-screen-2xl mx-auto 
                   lg:my-5 
                   lg:rounded-xl 
                   flex flex-col 
                   gap-y-6 
                   relative"
      >
        <RestaurantCarousel datos={data} />
      </section>
    </div>
  );
}
