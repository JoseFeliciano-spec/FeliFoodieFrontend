import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  UserCircle,
  ChevronDown,
  Menu,
  History,
  Search,
  Star,
} from "lucide-react";
import logo from "@/assets/png/logo.png";
import { getUser } from "@/actions/auth/getUser";
import ButtonLogout from "@/components/auth/ButtonLogout";

export default async function ProviderHome({ children }: any) {
  const user = await getUser();

  return (
    <>
      <header className="flex justify-between items-center px-4 py-3 shadow-sm">
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <nav className="flex flex-col gap-4 mt-8">
                <SheetClose asChild>
                  <Link
                    href="/browser"
                    className="flex items-center gap-2 px-2 py-2 hover:bg-gray-100 rounded-md"
                  >
                    <Search className="h-5 w-5" />
                    <span>Browser</span>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="/history"
                    className="flex items-center gap-2 px-2 py-2 hover:bg-gray-100 rounded-md"
                  >
                    <History className="h-5 w-5" />
                    <span>Historial</span>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="/favorites"
                    className="flex items-center gap-2 px-2 py-2 hover:bg-gray-100 rounded-md"
                  >
                    <Star className="h-5 w-5" />
                    <span>Favoritos</span>
                  </Link>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
          <Link href={"/"}>
            <Image
              src={logo}
              className="object-contain w-36 cursor-pointer"
              alt="Logo"
            />
          </Link>
        </div>

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
      {children}
    </>
  );
}
