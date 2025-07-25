"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export function UserMenu() {
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
    <button onClick={() => signIn("square")}>Sign in with Square</button>
  );
}
