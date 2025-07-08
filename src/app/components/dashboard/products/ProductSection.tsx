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
    taxes_data,
    discounts_data,
    cartInventoryInfo,
    inventoryMap,
    imageMap,
    categoryObjects,
  } = useProductSectionData({ accessToken, products, inventory });

  // *  it is an array of objects with id and name
  // console.log(categoryObjects);

  return (
    <div className={css({ w: "full", mt: "8" })}>
      {/* cart drawer */}
      <CartDrawer
        accessToken={accessToken}
        cartInventoryInfo={cartInventoryInfo}
        taxes_data={taxes_data}
        discounts={discounts_data}
      />

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
        <div style={{ textAlign: "center", margin: "2rem 0", color: "#888" }}>
          No items found
        </div>
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
          const variation =
            item.item_data?.variations?.[0]?.item_variation_data;
          const variationId = item.item_data?.variations?.[0]?.id;
          const price = variation?.price_money?.amount ?? null;
          const imageId = item.item_data?.image_ids?.[0];
          const imageUrl = imageId ? imageMap[imageId] : "/placeholder.jpg";
          const is_taxable = item.item_data?.is_taxable;
          // const is_taxable = false;
          const tax_ids = item.item_data?.tax_ids;
          // const tax_ids = ["QIRBKGD6VQ2ENYHOZNG4U5EL"]; // * sales tax id
          // const tax_id = tax_ids[0];
          const categoryId = item.item_data?.categories[0]?.id;
          const category = categoryObjects.find((obj: any) => obj?.id === categoryId);

          // * match these tax ids with the retrieved taxes_data
          const matchedTaxes = (tax_ids ?? []).map((tax_id: string) => {
            const tax = taxes_data.find((t: any) => t.id === tax_id);
            return tax ? { name: tax.name, percentage: tax.percentage } : null;
          });

          const salesTax = matchedTaxes.filter(
            (obj: any) => obj?.name === "Sales Tax"
          );
          const itemTaxRate = salesTax[0]?.percentage; // * applying sales tax for each item by default
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
                is_taxable={is_taxable}
                itemTaxRate={itemTaxRate}
                category={category?.name}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
