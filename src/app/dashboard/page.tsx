import { auth } from "~/auth";
import { redirect } from "next/navigation";
import { css } from "../../../styled-system/css";
import {
  stack,
  container,
  center,
} from "../../../styled-system/patterns";
import { DashboardSignOutButton } from "../components/dashboard/DashboardSignOutButton";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <div className={css({ minH: "100vh", bg: "gray.50" })}>
      <header
        className={css({
          bg: "white",
          borderBottom: "1px solid",
          borderColor: "gray.200",
          px: "6",
          py: "4",
          shadow: "sm",
        })}
      >
        <div className={container({ maxW: "7xl" })}>
          <div
            className={css({
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            })}
          >
            <h1
              className={css({
                fontSize: "2xl",
                fontWeight: "bold",
                color: "gray.900",
                bgGradient: "to-r",
                gradientFrom: "blue.600",
                gradientTo: "purple.600",
                bgClip: "text",
              })}
            >
              Dashboard
            </h1>
            <DashboardSignOutButton />
          </div>
        </div>
      </header>

      <main className={css({ py: "12" })}>
        <div className={container({ maxW: "7xl" })}>
          <div className={center({ maxW: "6xl", mx: "auto" })}>
            <div className={stack({ gap: "8", align: "center" })}>
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

              {/* Product Cards */}
              <div
                className={css({
                  w: "full",
                  mt: "8",
                })}
              >
                <div
                  className={css({
                    bg: "white",
                    p: "6",
                    rounded: "xl",
                    shadow: "md",
                    border: "1px solid",
                    borderColor: "gray.200",
                    transition: "all 0.2s",
                    _hover: {
                      shadow: "lg",
                      transform: "translateY(-2px)",
                    },
                  })}
                >
                  <h3
                    className={css({
                      fontSize: "xl",
                      fontWeight: "semibold",
                      color: "gray.900",
                      mb: "2",
                    })}
                  >
                    Product Management
                  </h3>
                  <p className={css({ color: "gray.600", mb: "4" })}>
                    View and manage your Square catalog products with real-time
                    synchronization.
                  </p>
                  <button
                    className={css({
                      px: "4",
                      py: "2",
                      bg: "blue.600",
                      color: "white",
                      rounded: "lg",
                      fontSize: "sm",
                      fontWeight: "medium",
                      transition: "all 0.2s",
                      _hover: {
                        bg: "blue.700",
                      },
                    })}
                  >
                    View Products
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
