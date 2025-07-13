"use client";

import ProductCard from "./ProductCard";
import CartDrawer from "../cart/CartDrawer";

import SearchBar from "../search/SearchBar";
import FilterButton from "../filter/FilterButton";
import { useProductSectionData } from "../../../hooks/useProductSectionData";
import { css } from "~/styled-system/css";
import Loader from "@/components/ui/HomeLoader";
import DashboardLoader from "@/components/ui/DashboardLoader";

/**
 * Props for the ProductSection component.
 */
type ProductSectionProps = {
  accessToken: string;
  products?: any;
  inventory?: any;
};

/**
 * Section component for displaying a grid of products with filtering, search, and cart drawer.
 * Handles data loading, error states, and product mapping.
 */
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
    variationIds,
    categoryObjects,
    discountApplications,
  } = useProductSectionData({ accessToken, products, inventory });

  // * Render the main product section layout
  return (
    <div className={css({ w: "full", mt: "8" })}>
      {/* cart drawer */}
      <CartDrawer
        accessToken={accessToken}
        cartInventoryInfo={cartInventoryInfo}
        taxes_data={taxes_data} // * remove this
        itemVariationIds={variationIds}
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
      {isPending && !products && <DashboardLoader />}
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
          // * Extract product and variation details
          const name = item.item_data?.name ?? "Name unknown";
          const variation =
            item.item_data?.variations?.[0]?.item_variation_data;
          const variationId = item.item_data?.variations?.[0]?.id;
          const price = variation?.price_money?.amount ?? null;
          const imageId = item.item_data?.image_ids?.[0];
          const imageUrl = imageId ? imageMap[imageId] : "/placeholder.jpg";
          const is_taxable = item.item_data?.is_taxable;
          const tax_ids = item.item_data?.tax_ids;
          const categoryId = item.item_data?.categories?.[0]?.id;

          // * Match tax ids with taxes_data
          const matchedTaxes = (tax_ids ?? []).map((tax_id: string) => {
            const tax = taxes_data.find((t: any) => t.id === tax_id);
            return tax ? { name: tax.name, percentage: tax.percentage } : null;
          });

          // * Get sales tax rate for the item
          const salesTax = matchedTaxes.filter(
            (obj: any) => obj?.name === "Sales Tax"
          );
          const itemTaxRate = salesTax[0]?.percentage;

          // * Build discounts array for each item
          const discounts = discountApplications
            .filter((app: any) => {
              if (app.applied_product_ids.includes(item.id)) return true;
              if (categoryId && app.applied_product_ids.includes(categoryId))
                return true;
              return false;
            })
            .map((app: any) => ({
              discount_name: app.discount_name,
              discount_value: app.discount_value,
            }));

          // * Inventory management
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
                variantId={variationId}
                discounts={discounts}
                taxes={matchedTaxes}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
