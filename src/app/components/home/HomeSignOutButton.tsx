"use client";

import { signOut } from "next-auth/react";
import { css } from "../../../../styled-system/css";
import { handleSignOut } from "../../utils/handleSignOut";

export function HomeSignOutButton() {
  return (
    <button
      onClick={handleSignOut}
      className={css({
        width: "100%",
        backgroundColor: "white",
        color: "#374151",
        padding: "12px 16px",
        borderRadius: "8px",
        fontWeight: "500",
        border: "1px solid #d1d5db",
        _hover: {
          backgroundColor: "#f9fafb",
        },
        _focus: {
          outline: "none",
          ring: "2px",
          ringColor: "#3b82f6",
          ringOffset: "2px",
        },
        transition: "all 0.2s",
      })}
    >
      Sign Out
    </button>
  );
}
