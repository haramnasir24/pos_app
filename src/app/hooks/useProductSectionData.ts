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
  const [params, setParams] = useState({ types: "item, image, category" });

  // * custom hook for fetching products
  const { data, isPending, error } = useProductList(accessToken, params);

  // * use server-side products if provided, otherwise use client-fetched data
  const productData = products || data;

  // TODO: change this into a hook that runs only when the categories change
  // // * get the categories for use in filter functionality
  // const categories =
  //   productData?.objects?.filter((obj: any) => obj.type === "CATEGORY") || [];

  // // * create an array of objects containing category names (values) and ids (keys)
  // // * save this to a json file
  // const categoryObjects = categories.map((category: any) => ({
  //   id: category.id,
  //   name: category.category_data?.name,
  // }));

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
    isPending,
    error,
    items,
    // categoryObjects,
    cartInventoryInfo,
    inventoryMap,
    imageMap,
  };
}
