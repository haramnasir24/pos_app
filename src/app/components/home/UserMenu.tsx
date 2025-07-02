"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export function UserMenu() {
  console.log("SQUARE_API_BASE", process.env.SQUARE_API_BASE);
  console.log("SQUARE_CLIENT_ID", process.env.SQUARE_CLIENT_ID);

  const { data: session, status } = useSession();

  console.log("UserMenu - Status:", status);
  console.log("UserMenu - Session:", session);

  if (status === "loading") return <p>Loading...</p>;

  return session ? (
    <div>
      <p>Welcome {session.user?.name}</p>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  ) : (
    <button onClick={() => signIn("square", { callbackUrl: "/dashboard" })}>
      Sign in with Square
    </button>
  );
}
