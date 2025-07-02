import { DashboardSignOutButton } from "./DashboardSignOutButton";
import { css } from "../../../../styled-system/css";
import { container } from "../../../../styled-system/patterns";
import CartDrawer from "./CartDrawer";

export default function DashboardHeader() {
  return (
    <header
      className={css({
        bg: "white",
        // borderBottom: "1px solid",
        // borderColor: "gray.200",
        px: "6",
        py: "4",
        shadow: "sm",
      })}
    >
      <div className={container({ maxW: "7xl" })}>
        <div
          className={css({
            display: "flex",
            justifyContent: "left",
            alignItems: "center",
            width: "100%",
            gap: "4",
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
  );
}
