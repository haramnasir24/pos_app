"use client";

import { useSession, signIn, signOut } from "next-auth/react";

const AuthButton = () => {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        <p>Welcome, {session.user?.name}</p>
        <button onClick={() => signOut()}>Logout</button>
      </>
    );
  }

  return <button onClick={() => signIn("square")}>Login with Square</button>;
};

export default AuthButton;
