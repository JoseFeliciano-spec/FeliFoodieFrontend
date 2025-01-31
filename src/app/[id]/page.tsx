import { getUser } from "@/actions/auth/getUser";
import RestaurantPage from "@/components/restaurant/RestaruantPage";

export default async function PageId({ params }: { params: { id: string } }) {
  const user = await getUser();

  return <RestaurantPage user={user?.data} id={params?.id} />;
}
