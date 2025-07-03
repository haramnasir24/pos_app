"use client";

import { useEffect, useState, useMemo } from "react";

import { useProductList } from "@/app/hooks/useProductList";

import Loader from "./Loader";
import SearchBar from "./SearchBar";
import { css } from "../../../../styled-system/css";
import ProductCard from "./ProductCard";
import CartDrawer from "./CartDrawer";
import { useInventoryData } from "@/app/hooks/useInventoryData";

type ProductSectionProps = {
  accessToken: string;
  products?: any;
};

export default function ProductSection({
  accessToken,
  products,
}: ProductSectionProps) {
  const [params, setParams] = useState({ types: "item, image" });
  const { data, isPending, error } = useProductList(accessToken, params);

  // get the inventory alert type and threshold using item_data?.variations?.[0]?.item_variation_data.location_overrides[0]
  const productData = products || data; // if products rendered on server side or else get the client data through react query
  console.log("product data:", productData);
  const items =
    productData?.objects?.filter((obj: any) => obj.type === "ITEM") || [];
  const variationIds = useMemo(
    () =>
      items.flatMap(
        (item: any) => item.item_data?.variations?.map((v: any) => v.id) ?? []
      ),
    [items]
  );

  const { data: inventoryData } = useInventoryData(variationIds, accessToken);
  console.log("inventory counts:", inventoryData?.counts ?? []);

  // build a map from variation id to inventory info for quick lookup
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

  return (
    <div className={css({ w: "full", mt: "8" })}>
      <CartDrawer />

      <div
        className={css({
          display: "flex",
          justifyContent: "flex-start",
          mb: "6",
          width: "100%",
        })}
      >
        <SearchBar
          setParams={(newParams) => setParams({ ...params, ...newParams })}
          prevParams={params}
        />
      </div>

      {isPending && !products && <Loader />}
      {error && <div>Error loading products</div>}

      {productData && (() => {
        // build image map
        const images = productData.objects?.filter(
          (obj: any) => obj.type === "IMAGE"
        );
        const imageMap: Record<string, string> = {};
        images.forEach((img: any) => {
          imageMap[img.id] = img.image_data?.url;
        });

        // render product cards using items, their images, and inventory counts and inventory state
        return (
          <div
            className={css({
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "4",
            })}
          >
            {items.map((item: any) => {
              const name = item.item_data?.name ?? "Name unknown";
              const variation = item.item_data?.variations?.[0]?.item_variation_data;
              const variationId = item.item_data?.variations?.[0]?.id;
              const price = variation?.price_money?.amount ?? null;
              const imageId = item.item_data?.image_ids?.[0];
              const imageUrl = imageId ? imageMap[imageId] : "/placeholder.jpg";

              // Get inventory info for this variation
              const inventory = variationId ? inventoryMap[variationId] : undefined;
              const state = inventory?.state ?? "Unknown";
              const quantity = inventory?.quantity ?? "-";

              return (
                <div
                  key={item.id}
                  className={css({
                    border: "1px solid token(colors.gray.200)",
                    borderRadius: "md",
                    p: "2",
                    bg: "white",
                    boxShadow: "sm",
                  })}
                >
                  <ProductCard
                    id={item.id}
                    name={name}
                    price={price}
                    imageUrl={imageUrl}
                  />
                  {/* <div className={css({ mt: "2", display: "flex", alignItems: "center", gap: "2" })}>
                    <span
                      className={css({
                        px: "2",
                        py: "1",
                        borderRadius: "full",
                        fontSize: "xs",
                        fontWeight: "bold",
                        bg: state === "IN_STOCK" ? "green.100" : "red.100",
                        color: state === "IN_STOCK" ? "green.700" : "red.700",
                      })}
                    >
                      {state}
                    </span>
                    <span
                      className={css({
                        fontSize: "sm",
                        color: "gray.700",
                        ml: "2",
                      })}
                    >
                      Qty: {quantity}
                    </span>
                  </div> */}
                </div>
              );
            })}
          </div>
        );
      })()}
    </div>
  );
}
