import { auth } from "~/auth";
import { redirect } from "next/navigation";
import { css } from "../../../styled-system/css";
import { stack, container, center } from "../../../styled-system/patterns";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import ProductSection from "../components/dashboard/ProductSection";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <div className={css({ minH: "100vh", bg: "gray.50" })}>
      <DashboardHeader />

      <main className={css({ py: "12" })}>
        <div className={container({ maxW: "7xl" })}>
          <div className={center({ maxW: "6xl", mx: "auto" })}>
            <div className={stack({ gap: "8" })}>
              <div className={css({ textAlign: "center" })}>
                <h2
                  className={css({
                    fontSize: "4xl",
                    fontWeight: "bold",
                    color: "gray.900",
                    mb: "4",
                  })}
                >
                  Welcome back, {session.user?.name}!
                </h2>
                <p
                  className={css({
                    fontSize: "lg",
                    color: "gray.600",
                    maxW: "2xl",
                    mx: "auto",
                  })}
                >
                  Manage your Square integration, view products, and handle
                  transactions all in one place.
                </p>
              </div>

              {/* Product Section */}

              <ProductSection accessToken={session?.accessToken || ""} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
