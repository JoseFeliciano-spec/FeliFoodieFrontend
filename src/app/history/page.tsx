import { getUser } from "@/actions/auth/getUser";
import HistoryPage from "@/components/history/HistoryPage";
import React from "react";

export default async function PageHistory() {
  const user = await getUser();
  return <HistoryPage user={user?.data} />;
}
