"use server";
import { axios } from "@/lib/axios";
export async function fetchPlacesTopHome() {
  const response = await axios.get("/v1/places/top-restaurants");

  return response?.data;
}
