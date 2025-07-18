"use client";

import { css } from "../../../../styled-system/css";
import { handleSignOut } from "@/app/utils/handleSignOut";

export function DashboardSignOutButton() {
  return (
    <button
      onClick={handleSignOut}
      className={css({
        px: "4",
        py: "2",
        bg: "red.600",
        color: "white",
        rounded: "lg",
        fontSize: "sm",
        fontWeight: "medium",
        transition: "all 0.2s",
        _hover: {
          bg: "red.700",
          transform: "translateY(-1px)",
          shadow: "md",
        },
        _active: {
          transform: "translateY(0)",
        },
        _focus: {
          outline: "2px solid",
          outlineColor: "red.300",
          outlineOffset: "2px",
        },
      })}
    >
      Sign Out
    </button>
  );
}
