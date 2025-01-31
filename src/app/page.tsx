import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { UserCircle } from "lucide-react";
import { ChevronDown } from "lucide-react";
import logo from "@/assets/png/logo.png";
import main_bg from "@/assets/png/main.png";
import { getUser } from "@/actions/auth/getUser";
import ButtonLogout from "@/components/auth/ButtonLogout";
import HomeSearch from "@/components/home/HomeSearch";
import RestaurantCarousel from "@/components/home/RestaurantCarousel";
import { fetchPlacesTopHome } from "@/actions/home/place";

export default async function Page() {
  const user = await getUser();
  const data: any = await fetchPlacesTopHome();

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <header className="flex justify-between items-center px-4 py-3 shadow-sm">
        <Image src={logo} className="object-contain w-36" alt="Logo" />
        {user?.message === "No se encontró token de autenticación" ? (
          <Button asChild className="bg-principal-color">
            <Link href="/login">
              <p className="text-sm">Iniciar sesión</p>
            </Link>
          </Button>
        ) : (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <UserCircle className="h-5 w-5" />
                <span>{user?.data?.name}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48">
              <div className="flex flex-col space-y-1">
                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                  {user?.data?.email}
                </div>
                <Separator />
                <ButtonLogout />
              </div>
            </PopoverContent>
          </Popover>
        )}
      </header>

      <main className="lg:my-5 flex lg:px-56 justify-center bg-principal-color min-h-[30rem] h-[60dvh] container lg:min-w-[70rem] lg:w-[85vw] mx-auto lg:rounded-xl flex-col gap-y-10 relative">
        <p className="text-4xl font-semibold text-white w-3/4">
          Descubre los mejores restaurante en Cartagena y el mundo
        </p>

        <HomeSearch />

        <Image
          src={main_bg}
          className="object-contain w-1/3 absolute -right-12"
          alt="Logo"
        />
      </main>
      <section className="lg:my-5 flex lg:px-56 justify-center container lg:min-w-[70rem] lg:w-[85vw] mx-auto lg:rounded-xl flex-col gap-y-10 relative">
        <RestaurantCarousel datos={data} />
      </section>
    </div>
  );
}
