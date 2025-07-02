"use client";

import { signOut } from "next-auth/react";

import { css } from "../../../../styled-system/css";

export function HomeSignOutButton() {
  return (
    <button
      onClick={() => signOut()}
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
        transition: "all 0.2s",
      })}
    >
      Sign Out
    </button>
  );
}
