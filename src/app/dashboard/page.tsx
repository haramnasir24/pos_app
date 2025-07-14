import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";

import { authOptions } from "../api/auth/[...nextauth]/route";

import { css } from "../../../styled-system/css";
import { center, container, stack } from "../../../styled-system/patterns";
import { Suspense } from "react";
import DashboardHeader from "@/components/dashboard/header/DashboardHeader";
import ProductSectionSkeleton from "@/components/dashboard/products/ProductSectionSkeleton";
import ProductSection from "@/components/dashboard/products/ProductSection";
import { API_CONFIG } from "@/constants/api";

/**
 * Dashboard page for authenticated users.
 * Fetches products and inventory server-side, and renders the product section.
 * Redirects to home if not authenticated.
 */
export default async function DashboardPage() {
  // * Check the session
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  // * Fetch products server side
  let products = null;
  try {
    const response = await fetch(
      `${API_CONFIG.SQUARE_BASE_URL}/v2/catalog/search`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Square-Version": "2025-06-18",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          object_types: [
            "ITEM",
            "IMAGE",
            "CATEGORY",
            "TAX",
            "DISCOUNT",
            "PRICING_RULE",
            "PRODUCT_SET",
          ],
          include_related_objects: true,
        }),
      }
    );
    if (response.ok) {
      products = await response.json();
    }
  } catch (e) {
    // fail silently, fallback to client fetch
  }

  /**
   * Extract item and variation IDs from products.
   */
  const items =
    products.objects?.filter((obj: any) => obj.type === "ITEM") || [];

  const variationIds = items?.flatMap(
    (item: any) => item.item_data?.variations?.map((v: any) => v.id) ?? []
  );

  // * Fetch inventory server side
  let inventoryData = null;
  try {
    const response = await fetch(
      `${API_CONFIG.SQUARE_BASE_URL}/v2/inventory/counts/batch-retrieve`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Square-Version": "2025-06-18",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          catalog_object_ids: variationIds,
        }),
      }
    );
    if (response.ok) {
      inventoryData = await response.json();
    }
  } catch (e) {
    // fail silently, fallback to client fetch
  }

  return (
    <div className={css({ minH: "100vh", bg: "gray.50" })}>
      <DashboardHeader />

      <main className={css({ py: ["6", "8", "12"] })}>
        <div className={container({ maxW: "7xl" })}>
          <div className={center({ maxW: "6xl", mx: "auto" })}>
            <div className={stack({ gap: ["4", "6", "8"] })}>
              <div className={css({ textAlign: "center" })}>
                <h2
                  className={css({
                    fontSize: ["lg", "2xl", "3xl"],
                    fontWeight: "bold",
                    color: "gray.900",
                    mb: "4",
                  })}
                >
                  Welcome back, {session.user?.name}!
                </h2>
                <p
                  className={css({
                    fontSize: ["sm", "md", "lg"],
                    color: "gray.600",
                    maxW: "1xl",
                    mx: "auto",
                  })}
                >
                  Manage your Square integration, view products, and handle
                  transactions all in one place.
                </p>
              </div>

              {/* Product Section */}
              <Suspense fallback={<ProductSectionSkeleton />}>
                <ProductSection
                  accessToken={session.accessToken ?? ""}
                  products={products}
                  inventory={inventoryData}
                />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
