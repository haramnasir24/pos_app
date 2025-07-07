"use client";

import { signOut } from "next-auth/react";

import { css } from "../../../../styled-system/css";
import { button } from "../button";

export function DashboardSignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className={button({ style: 'dashboard'})}
    >
      Sign Out
    </button>
  );
}
