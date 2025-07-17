import {
  CategoryObject,
  Discount,
  PricingRule,
  Product,
  ProductSet,
  Tax,
} from "@/shared/types/product";

/**
 * Extracts items from product data
 */
export function extractItems(productData: any): Product[] {
  return productData?.objects?.filter((obj: any) => obj.type === "ITEM") || [];
}

/**
 * Extracts taxes from product data (both objects and related_objects)
 */
export function extractTaxes(productData: any): Tax[] {
  return [
    ...(productData?.objects?.filter((obj: any) => obj.type === "TAX") ?? []),
    ...(productData?.related_objects?.filter(
      (obj: any) => obj.type === "TAX"
    ) ?? []),
  ];
}

/**
 * Extracts discounts from product data
 */
export function extractDiscounts(productData: any): Discount[] {
  return (
    productData?.objects?.filter((obj: any) => obj.type === "DISCOUNT") || []
  );
}

/**
 * Extracts pricing rules from product data
 */
export function extractPricingRules(productData: any): PricingRule[] {
  return (
    productData?.objects?.filter((obj: any) => obj.type === "PRICING_RULE") ||
    []
  );
}

/**
 * Extracts product sets from product data
 */
export function extractProductSets(productData: any): ProductSet[] {
  return (
    productData?.objects?.filter((obj: any) => obj.type === "PRODUCT_SET") || []
  );
}

/**
 * Extracts categories from product data
 */
export function extractCategories(productData: any): CategoryObject[] {
  return (
    productData?.objects?.filter((obj: any) => obj.type === "CATEGORY") || []
  );
}

/**
 * Determines which data source to use based on whether there's a query
 */
export function determineProductData(
  data: any,
  products: any,
  params: { query?: string }
): any {
  // If search/filter then use client data
  if (params.query) {
    return data;
  }
  return products;
}

/**
 * Determines if client-side fetching is happening
 */
export function isClientSideFetching(
  params: { query?: string },
  isPending: boolean
): boolean {
  return Boolean(params.query && isPending);
}

/**
 * Extracts all item IDs from items array
 */
export function extractItemIds(items: any[]): string[] {
  return items.map((item: any) => item.id);
}

/**
 * Extracts variation IDs from items array
 */
export function extractVariationIds(items: any[]): string[] {
  // * flatMap is used to return an array of arrays as a single array
  return items.flatMap(
    (item: any) => item.item_data?.variations?.map((v: any) => v.id) ?? []
  );
}

/**
 * Extracts all images from product data (both objects and related_objects)
 */
export function extractImages(productData: any): any[] {
  return [
    ...(productData?.objects?.filter((obj: any) => obj.type === "IMAGE") ?? []),
    ...(productData?.related_objects?.filter(
      (obj: any) => obj.type === "IMAGE"
    ) ?? []),
  ];
}
