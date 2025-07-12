import { css } from "~/styled-system/css";
import { DashboardSignOutButton } from "../signout/DashboardSignOutButton";
import { container } from "~/styled-system/patterns";

export default function DashboardHeader() {
  return (
    <header
      className={css({
        bg: "white",
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
              fontSize: ["lg", "xl", "2xl"],
              fontWeight: ["semibold", "bold", "bold"],
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
