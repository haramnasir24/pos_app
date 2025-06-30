"use client";

import { useState } from "react";
import { css } from "../../../../styled-system/css";
import { useProductList } from "@/app/hooks/useProductList";

type ProductSectionProps = {
  accessToken: string;
};

export default function ProductSection({ accessToken }: ProductSectionProps) {
  const [params, setParams] = useState({ types: "item" });
  const { data, isPending, error } = useProductList(accessToken, params);

  console.log(data);

  return (
    <div className={css({ w: "full", mt: "8" })}>
      {isPending && <div>Loading...</div>}
      {error && <div>Error loading products</div>}
      {/*  TODO: create a separate product card component and apply pandacss to it */}
      {/*  TODO: ALSO UNDERSTAND THE RESPONSE FROM THE API*/}
      {/*  TODO: look into how to get image urls*/}
      {data && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "1rem",
          }}
        >
          {data.objects?.map((product: any) => {
            const name = product.item_data.name ?? "Name unknown";
            const variation =
              product.item_data?.variations?.[0]?.item_variation_data;
            const price = variation?.price_money?.amount ?? null;
            const imageId = product.item_data?.image_ids?.[0] ?? null;

            const imageUrl = imageId
              ? `/images/${imageId}.jpg`
              : "/placeholder.jpg";
            return (
              <div
                key={product.id}
                style={{
                  border: "1px solid #eee",
                  borderRadius: 8,
                  padding: 16,
                }}
              >
                <img
                  src={imageUrl}
                  alt={name}
                  style={{
                    width: "100%",
                    height: 150,
                    objectFit: "cover",
                    borderRadius: 4,
                  }}
                  onError={(e) => (e.currentTarget.src = "/placeholder.jpg")}
                />
                <h3 className={css({ fontSize: "lg", fontWeight: "bold" })}>
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
      )}
    </div>
  );
}
