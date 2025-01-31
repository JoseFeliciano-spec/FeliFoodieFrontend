import * as React from "react";
import { MapPin, X } from "lucide-react";
import { axios } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useDebounceCallback } from "usehooks-ts";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Control, Controller } from "react-hook-form";

interface Location {
  id: string;
  name: string;
  icon?: React.ReactNode;
}

interface CommandSearchProps {
  control: Control<any>;
  name: string;
  url: string;
  placeholder?: string;
  required?: boolean;
  onValueChange?: (value: string | any) => void;
  mappingData?: (item: any) => Location;
  className?: string;
  classNameDropdown?: string;
  itemAdd?: any;
}

export default function CommandSearch({
  control,
  name,
  url,
  placeholder = "Where to?",
  required = false,
  onValueChange,
  mappingData,
  className,
  classNameDropdown,
  itemAdd,
}: CommandSearchProps) {
  const [open, setOpen] = React.useState(false);
  /* const [searchValue, setSearchValue] = React.useState(""); */
  const [debouncedSearch, setDebouncedSearch] = React.useState(" ");
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  const debouncedSetSearch = useDebounceCallback((value: string) => {
    setDebouncedSearch(value);
  }, 800);

  const { data: locationsData, isLoading } = useQuery<any>({
    queryKey: ["locations", debouncedSearch],
    queryFn: () => {
      return axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/${url}?search=${debouncedSearch}`
      );
    },
    enabled: debouncedSearch.length > 0,
  });

  const locations = React.useMemo(() => {
    {
      const dataLocal = mappingData
        ? locationsData?.data?.map(mappingData)
        : locationsData?.data?.map((item: any) => ({
            id: item.cityId.toString(),
            name: item.name,
            icon: <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />,
          })) || [];

      if (itemAdd) {
        return itemAdd?.concat(dataLocal);
      }

      return dataLocal;
    }
  }, [locationsData]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={className + " w-60 h-full"} ref={containerRef}>
      <div className="relative group h-full">
        <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Controller
          name={name}
          control={control}
          rules={{ required }}
          render={({ field }) => (
            <>
              <input
                {...field}
                ref={(e) => {
                  field.ref(e);
                  if (e) {
                    inputRef.current = e;
                  }
                }}
                type="text"
                placeholder={placeholder}
                className="w-full rounded-sm border border-input px-10 h-full text-sm transition-all duration-200
                          placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#00736D]
                          hover:border-[#00736D]/50 font-bold"
                onFocus={() => setOpen(true)}
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(value);
                  /* setSearchValue(value); */
                  debouncedSetSearch(value);
                  setOpen(true);
                }}
              />
              {field.value && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    field.onChange("");
                    /* setSearchValue(""); */
                    debouncedSetSearch("");
                    if (inputRef.current) {
                      inputRef.current.focus();
                    }
                    setOpen(true);
                    onValueChange?.("");
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full
                            hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00736D]"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
              {open && (
                <div className="absolute w-fit mt-1">
                  <Command
                    className={
                      classNameDropdown + " rounded-lg border shadow-md w-60"
                    }
                  >
                    <CommandList>
                      {isLoading ? (
                        <div className="py-6 text-center text-sm text-muted-foreground">
                          Cargando la mejor experiencia...
                        </div>
                      ) : locations?.length === 0 ? (
                        <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                          No se encontró el registro.
                        </CommandEmpty>
                      ) : (
                        <CommandGroup>
                          {locations?.map((location: any) => {
                            return (
                              <CommandItem
                                key={location?.id}
                                onSelect={() => {
                                  field.onChange(location?.name);
                                  /* setSearchValue(location.name); */
                                  setOpen(false);
                                  onValueChange?.(location?.id);
                                  if (location?.onClick) {
                                    onValueChange?.(location?.onClick);
                                  }
                                }}
                                className="flex items-center gap-2 px-4 py-3 w-48 cursor-pointer hover:bg-[#00736D]/10
                                       aria-selected:bg-[#00736D]/10"
                              >
                                {location?.icon}
                                <span className="truncate font-bold">
                                  {location?.name}
                                </span>
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      )}
                    </CommandList>
                  </Command>
                </div>
              )}
            </>
          )}
        />
      </div>
    </div>
  );
}
