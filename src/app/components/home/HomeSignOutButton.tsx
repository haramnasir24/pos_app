"use client";

import { signOut } from "next-auth/react";

import { css } from "../../../../styled-system/css";
import { button } from "../button";

export function HomeSignOutButton() {
  return (
    <button onClick={() => signOut()} className={button({ style: "home" })}>
      Sign Out
    </button>
  );
}
