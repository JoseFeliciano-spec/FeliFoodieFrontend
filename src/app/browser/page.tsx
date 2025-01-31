import BrowserHome from "@/components/browser/BrowserHome";
export default function Browser({ searchParams }: any) {
  return (
    <BrowserHome country={searchParams?.country} place={searchParams?.place} />
  );
}
