"use client";

import { signOut } from "next-auth/react";
import { css } from "../../../../styled-system/css";

export function DashboardSignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className={css({
        px: "4",
        py: "2",
        bg: "red.500",
        color: "white",
        rounded: "lg",
        fontSize: "sm",
        fontWeight: "medium",
        transition: "all 0.2s",
        cursor: "pointer",
        _hover: {
          bg: "red.600",
          shadow: "md",
        },
      })}
    >
      Sign Out
    </button>
  );
}
