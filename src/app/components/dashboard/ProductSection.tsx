"use client";

import { useState } from "react";

import { useProductList } from "@/app/hooks/useProductList";

import Loader from "./Loader";
import SearchBar from "./SearchBar";
import { css } from "../../../../styled-system/css";
import Image from "next/image";
import ProductCard from "./ProductCard";
import CartDrawer from "./CartDrawer";

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

  const productData = products || data; // if products rendered on server side or else get the client data through react query

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

      {productData &&
        (() => {
          // build image map
          const images = productData.objects?.filter(
            (obj: any) => obj.type === "IMAGE"
          );
          // research 'Record' data structure
          const imageMap: Record<string, string> = {};
          images.forEach((img: any) => {
            imageMap[img.id] = img.image_data?.url;
          });

          // get items
          const items = productData.objects?.filter(
            (obj: any) => obj.type === "ITEM"
          );

          // render product cards using items and their images
          return (
            <div
              className={css({
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", // research this
                gap: "4",
              })}
            >
              {items.map((item: any) => {
                const name = item.item_data?.name ?? "Name unknown";
                const variation =
                  item.item_data?.variations?.[0]?.item_variation_data;
                const price = variation?.price_money?.amount ?? null;
                const imageId = item.item_data?.image_ids?.[0];
                const imageUrl = imageId
                  ? imageMap[imageId]
                  : "/placeholder.jpg";

                return (
                  <ProductCard
                    key={item.id}
                    id={item.id}
                    name={name}
                    price={price}
                    imageUrl={imageUrl}
                  />
                );
              })}
            </div>
          );
        })()}
    </div>
  );
}
