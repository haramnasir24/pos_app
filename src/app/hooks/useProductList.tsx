// this is a hook that fetches products from the Square API

import { useQuery } from "@tanstack/react-query";

import { fetchProducts } from "@/app/utils/fetchProducts";

export function useProductList(access_token: string, params?: Record<string, string>) {
  // useQuery is used for get requests
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => fetchProducts(access_token, params),
    enabled: !!access_token,
  });
}
