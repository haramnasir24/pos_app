"use client";

import { useState } from "react";
import { css } from "../../../../styled-system/css";
import { useProductList } from "@/app/hooks/useProductList";
import SearchBar from "./SearchBar";
import Loader from "./Loader";

type ProductSectionProps = {
  accessToken: string;
};

export default function ProductSection({ accessToken }: ProductSectionProps) {
  const [params, setParams] = useState({ types: "item, image" });
  const { data, isPending, error } = useProductList(accessToken, params);

  console.log(data);

  return (
    <div className={css({ w: "full", mt: "8" })}>
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

      {isPending && <Loader />}
      {error && <div>Error loading products</div>}

      {data &&
        (() => {
          // build image map
          const images = data.objects?.filter(
            (obj: any) => obj.type === "IMAGE"
          );
          // research 'Record' data structure
          const imageMap: Record<string, string> = {};
          images.forEach((img: any) => {
            imageMap[img.id] = img.image_data?.url;
          });

          // get items
          const items = data.objects?.filter((obj: any) => obj.type === "ITEM");

          // render product cards
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
                  <div
                    key={item.id}
                    className={css({
                      border: "1px solid",
                      borderColor: "gray.200",
                      borderRadius: "lg",
                      padding: "4",
                      background: "white",
                      boxShadow: "sm",
                    })}
                  >
                    <img
                      src={imageUrl}
                      alt={name}
                      className={css({
                        width: "full",
                        height: "40",
                        borderRadius: "md",
                        mb: "3",
                      })}
                      onError={(e) =>
                        (e.currentTarget.src = "/placeholder.jpg")
                      } // set this
                    />
                    <h3
                      className={css({
                        fontSize: "lg",
                        fontWeight: "bold",
                        mb: "1",
                      })}
                    >
                      {name}
                    </h3>
                    <p className={css({ fontSize: "sm", color: "gray.600" })}>
                      {price !== null
                        ? `$${(price / 100).toFixed(2)}`
                        : "Price not available"}
                    </p>
                  </div>
                );
              })}
            </div>
          );
        })()}
    </div>
  );
}
