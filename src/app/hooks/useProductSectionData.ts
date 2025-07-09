import { useState, useMemo } from "react";
import { useProductList } from "@/app/hooks/useProductList";
import { useInventoryData } from "@/app/hooks/useInventoryData";
import { useDiscounts } from "@/app/hooks/useDiscounts";
import { usePricingRules } from "@/app/hooks/usePricingRules";
import { useProductSets } from "@/app/hooks/useProductSets";
import {
  extractCategories,
  extractDiscounts,
  extractImages,
  extractItemIds,
  extractItems,
  extractPricingRules,
  extractProductSets,
  extractTaxes,
  extractVariationIds,
} from "../utils/dataExtractionUtils";
import {
  createDiscountToProductSetMap,
  transformCategories,
  transformDiscounts,
  transformPricingRules,
  transformProductSets,
  transformTaxes,
} from "../utils/productDataTransformers";
import { createDiscountApplications } from "../utils/discountApplicationUtils";
import {
  buildCartInventoryInfo,
  buildImageMap,
  buildInventoryMap,
} from "../utils/inventoryImageUtils";

export function useProductSectionData({
  accessToken,
  products,
  inventory,
}: {
  accessToken: string;
  products?: any;
  inventory?: any;
}) {
  // * set params for fetching products
  const [params, setParams] = useState<{
    types: string;
    query?: string;
  }>({
    types: "item, image, category, tax, discount, pricing_rule, product_set",
  });

  // * custom hook for fetching products - only run when there's a query
  const { data, isPending, error } = useProductList(
    params.query ? accessToken : "",
    params
  );

  // * custom hook for fetching discounts - only run when there's a query
  const {
    discounts: fetchedDiscounts,
    isLoading: discountsLoading,
    error: discountsError,
  } = useDiscounts(params.query ? accessToken : "");

  // * custom hook for fetching pricing rules - only run when there's a query
  const {
    pricingRules: fetchedPricingRules,
    isLoading: pricingRulesLoading,
    error: pricingRulesError,
  } = usePricingRules(params.query ? accessToken : "");

  // * custom hook for fetching product sets - only run when there's a query
  const {
    productSets: fetchedProductSets,
    isLoading: productSetsLoading,
    error: productSetsError,
  } = useProductSets(params.query ? accessToken : "");

  // * use server-side products if provided, otherwise use client-fetched data
  const productData = useMemo(() => {
    // * if search/filter then use client rendered data
    if (params.query) {
      return data;
    }
    return products;
  }, [data, products]);

  // console.log("Product data:", productData);

  // * get the items
  const items = extractItems(productData);

  // * get the taxes and discounts
  const taxes = extractTaxes(productData);

  // * variation ids are used for fetching inventory counts
  const variationIds = extractVariationIds(items);

  // TODO: change this into a hook that runs only when the categories change
  const categories = extractCategories(productData); // * get the categories for use in filter functionality

  // * get all item IDs
  const allItemIds = extractItemIds(items);

  // * build image map for quick lookup of image URLs by image id
  const images = extractImages(productData);

  const imageMap = buildImageMap(images);

  // * use fetched discounts if available, otherwise fall back to product data
  const discounts =
    fetchedDiscounts.length > 0
      ? fetchedDiscounts
      : extractDiscounts(productData);

  // * retrieve the pricing rule and products sets array
  const pricing_rules =
    fetchedPricingRules.length > 0
      ? fetchedPricingRules
      : extractPricingRules(productData);

  const product_sets =
    fetchedProductSets.length > 0
      ? fetchedProductSets
      : extractProductSets(productData);

  // * convert raw data to a structured data
  const taxes_data = transformTaxes(taxes);
  const discounts_data = transformDiscounts(discounts);
  const pricing_rules_data = transformPricingRules(pricing_rules);
  const product_sets_data = transformProductSets(product_sets);
  const categoryObjects = transformCategories(categories); // * save this to a json file

  // * maps discount IDs to the product set IDs they apply to
  const discountToProductSetMap =
    createDiscountToProductSetMap(pricing_rules_data);

  // * apply discount to product ids
  const discountApplications = createDiscountApplications(
    discountToProductSetMap,
    discounts_data,
    product_sets_data,
    allItemIds
  );

  // console.log(discountApplications);

  // * custom hook for fetching inventory
  const { data: clientInventory } = useInventoryData(
    variationIds,
    params.query ? accessToken : ""
  );
  // * use server-side inventory if provided, otherwise use client-fetched data
  const inventoryData = inventory || clientInventory;

  // * build a map from variation id to inventory info, for quick lookup
  const inventoryMap = buildInventoryMap(inventoryData);

  // * builds a map from item id to { state, quantity }, used in cart drawer
  const cartInventoryInfo = buildCartInventoryInfo(items, inventoryMap);

  return {
    params,
    setParams,
    isPending,
    error,
    items,
    taxes_data,
    discounts_data,
    cartInventoryInfo,
    inventoryMap,
    imageMap,
    variationIds,
    categoryObjects,
    discountApplications,
  };
}
