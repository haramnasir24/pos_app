import { useState, useMemo } from "react";
import { useProductList } from "@/app/hooks/useProductList";
import { useInventoryData } from "@/app/hooks/useInventoryData";

export function useProductSectionData({
  accessToken,
  products,
  inventory,
}: {
  accessToken: string;
  products?: any;
  inventory?: any;
}) {
  // * On mount, initialize state with SSR data

  // * params for fetching products
  const [params, setParams] = useState<{
    types: string;
    query?: string;
  }>({
    types: "item, image, category, tax, discount",
  });

  // * custom hook for fetching products
  const { data, isPending, error } = useProductList(accessToken, params);

  // * use server-side products if provided, otherwise use client-fetched data

  const productData = useMemo(() => {
    // * if search/filter then use client data
    if (params.query) {
      return data;
    }
    return products;
  }, [data, products]);
  // console.log("Product data:", productData);

  const isClientSideFetching = useMemo(() => {
    return params.query && isPending;
  }, [params.query, isPending]);

  // * retrieve the taxes and discounts
  const taxes =
    productData?.objects?.filter((obj: any) => obj.type === "TAX") || [];
  const discounts =
    productData?.objects?.filter((obj: any) => obj.type === "DISCOUNT") || [];

  const taxes_data = taxes.map((tax: any) => ({
    id: tax.id,
    name: tax.tax_data.name,
    percentage: parseFloat(tax.tax_data.percentage),
    enabled: tax.tax_data.enabled,
  }));

  const discounts_data = discounts.map((discount: any) => {
    const { id, discount_data } = discount;
    const base = {
      id,
      name: discount_data.name,
      type: discount_data.discount_type,
      modify_tax_basis: "MODIFY_TAX_BASIS",
    };

    if (discount_data.percentage !== undefined) {
      return {
        ...base,
        percentage: parseFloat(discount_data.percentage),
      };
    } else if (discount_data.amount_money?.amount !== undefined) {
      return {
        ...base,
        amount: discount_data.amount_money.amount,
      };
    } else {
      return base;
    }
  });

  // TODO: change this into a hook that runs only when the categories change
  // * get the categories for use in filter functionality
  const categories =
    productData?.objects?.filter((obj: any) => obj.type === "CATEGORY") || [];

  // * create an array of objects containing category names (values) and ids (keys)
  // * save this to a json file
  const categoryObjects = categories.map((category: any) => ({
    id: category.id,
    name: category.category_data?.name,
  }));

  // * get the items
  const items =
    productData?.objects?.filter((obj: any) => obj.type === "ITEM") || [];

  // * variation ids are used for fetching inventory counts
  // * useMemo so that it only runs again when items change, and it doesn't run between re-renders
  // * flatMap is used to return an array of arrays as a single array
  const variationIds = useMemo(
    () =>
      items.flatMap(
        (item: any) => item.item_data?.variations?.map((v: any) => v.id) ?? []
      ),
    [items]
  );

  // * custom hook for fetching inventory
  const { data: clientInventory } = useInventoryData(variationIds, accessToken);
  // * use server-side inventory if provided, otherwise use client-fetched data
  const inventoryData = inventory || clientInventory;

  // * build a map from variation id to inventory info for quick lookup
  // * Record used here is the typescript utility type for making key value pairs
  const inventoryMap = useMemo(() => {
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
  }, [inventoryData]);

  // * builds a map from item id to { state, quantity }
  // * associates the item with their state and quantity in inventory
  // * used in cart drawer
  const cartInventoryInfo = useMemo(() => {
    const map: Record<string, { state: string; quantity: string }> = {};
    items.forEach((item: any) => {
      const variationId = item.item_data?.variations?.[0]?.id;
      if (variationId && inventoryMap[variationId]) {
        map[item.id] = inventoryMap[variationId];
      }
    });
    return map;
  }, [items, inventoryMap]);

  // * build image map for quick lookup of image URLs by image id
  const images = [
    ...(productData?.objects?.filter((obj: any) => obj.type === "IMAGE") ?? []),
    ...(productData?.related_objects?.filter(
      (obj: any) => obj.type === "IMAGE"
    ) ?? []),
  ];
  const imageMap: Record<string, string> = {};
  images.forEach((img: any) => {
    imageMap[img.id] = img.image_data?.url;
  });

  return {
    params,
    setParams,
    isPending: isClientSideFetching,
    error,
    items,
    taxes_data,
    discounts_data,
    categoryObjects,
    cartInventoryInfo,
    inventoryMap,
    imageMap,
  };
}
