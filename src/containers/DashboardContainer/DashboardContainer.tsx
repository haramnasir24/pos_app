// * this container contains the business logic and the UI

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { css } from "~/styled-system/css";
import { center, container, stack } from "~/styled-system/patterns";
import { Suspense } from "react";

import ProductSectionSkeleton from "@/components/composites/dashboard/products/ProductSectionSkeleton";
import ProductSection from "@/components/composites/dashboard/products/ProductSection";
import DashboardHeader from "@/components/composites/dashboard/header/DashboardHeader";
import { useDashboardData } from "./useDashboardData";

/**
 * DashboardContainer is an async server component that handles all data fetching
 * and renders the dashboard UI for authenticated users. Redirects to home if not authenticated.
 */
export default async function DashboardContainer() {
  // * Check the session
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  // * custom hook that fetches data server side
  const { products, inventoryData } = await useDashboardData(session);

  return (
    <div className={css({ minH: "100vh", bg: "gray.50" })}>
      <DashboardHeader />

      <main className={css({ py: ["6", "8", "12"], mt: "6" })}>
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
