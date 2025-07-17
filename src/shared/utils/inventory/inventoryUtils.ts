/**
 * Builds a map from variation ID to inventory info for quick lookup
 */
export function buildInventoryMap(inventoryData: any): Record<string, { state: string; quantity: string }> {
  const map: Record<string, { state: string; quantity: string }> = {};
  
  if (inventoryData?.counts) {
    for (const count of inventoryData.counts) {
      map[count.catalog_object_id] = {
        state: count.state,
        quantity: count.quantity,
      };
    }
  }
  
  return map;
}

/**
 * Builds a map from item ID to inventory info for cart functionality
 */
export function buildCartInventoryInfo(
  items: any[],
  inventoryMap: Record<string, { state: string; quantity: string }>
): Record<string, { state: string; quantity: string }> {
  const map: Record<string, { state: string; quantity: string }> = {};
  
  items.forEach((item: any) => {
    const variationId = item.item_data?.variations?.[0]?.id;
    if (variationId && inventoryMap[variationId]) {
      map[item.id] = inventoryMap[variationId];
    }
  });
  
  return map;
}


