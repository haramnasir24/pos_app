"use client";

import { css } from "../../../../../styled-system/css";
import ProductCard from "./ProductCard";
import CartDrawer from "../CartDrawer";
import Loader from "../Loader";
import SearchBar from "../SearchBar";
import FilterButton from "../filter/FilterButton";
import { useProductSectionData } from "../../../hooks/useProductSectionData";

type ProductSectionProps = {
  accessToken: string;
  products?: any;
  inventory?: any;
};

export default function ProductSection({
  accessToken,
  products,
  inventory,
}: ProductSectionProps) {
  const {
    params,
    setParams,
    isPending,
    error,
    items,
    cartInventoryInfo,
    inventoryMap,
    imageMap,
  } = useProductSectionData({ accessToken, products, inventory });

  return (
    <div className={css({ w: "full", mt: "8" })}>
      {/* cart drawer */}
      <CartDrawer cartInventoryInfo={cartInventoryInfo} />

      <div
        className={css({
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8",
          mb: "6",
          width: "100%",
        })}
      >
        {/* filter button and search bar */}
        <FilterButton
          setParams={(newParams) => setParams({ ...params, ...newParams })}
          prevParams={params}
        />
        <SearchBar
          setParams={(newParams) => setParams({ ...params, ...newParams })}
          prevParams={params}
        />
      </div>

      {isPending && !products && <Loader />}
      {error && <div>Error loading products</div>}
      {!isPending && !error && items.length === 0 && (
        <div style={{ textAlign: 'center', margin: '2rem 0', color: '#888' }}>No items found</div>
      )}

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
                state={state}
                quantity={quantity}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
