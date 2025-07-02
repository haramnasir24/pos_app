import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "../api/auth/[...nextauth]/route";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import ProductSection from "../components/dashboard/ProductSection";
import { css } from "../../../styled-system/css";
import { center,container, stack } from "../../../styled-system/patterns";

export default async function DashboardPage() {
  // protect the dashboard
  const session = await getServerSession(authOptions);
  console.log("session:", session);
  console.log(session?.accessToken);

  if (!session) {
    redirect("/");
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

              <ProductSection accessToken={session.accessToken ?? ""} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
