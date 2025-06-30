// this is a hook that fetches products from the Square API

import { fetchProducts } from "@/app/utils/fetchProducts";
import { useQuery } from "@tanstack/react-query";

export function useProductList(access_token: string, params?: Record<string, string>) {
  // useQuery is used for get requests
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => fetchProducts(access_token, params),
    enabled: !!access_token,
  });
}
