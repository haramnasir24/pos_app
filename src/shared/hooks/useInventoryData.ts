import { useQuery } from "@tanstack/react-query";
import { fetchInventory } from "../services/inventoryService";

export function useInventoryData(variationIds: string[], accessToken: string) {
  // useQuery is used for get requests
  return useQuery({
    queryKey: ["inventory", variationIds],
    queryFn: () => fetchInventory(accessToken, variationIds), // service
    enabled: !!accessToken && variationIds.length > 0,
  });
}
