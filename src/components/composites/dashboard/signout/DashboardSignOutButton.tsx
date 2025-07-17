"use client";

import { signOut } from "next-auth/react";
import { css } from "~/styled-system/css";

export function DashboardSignOutButton() {
  return (
    <button
      onClick={() => signOut()}
      className={css({
        px: "4",
        py: "2",
        bg: "gray.200",
        color: "black",
        rounded: "lg",
        fontSize: "sm",
        fontWeight: "medium",
        transition: "all 0.2s",
        cursor: "pointer",
        _hover: {
          bg: "gray.300",
          shadow: "md",
        },
      })}
    >
      Sign Out
    </button>
  );
}
