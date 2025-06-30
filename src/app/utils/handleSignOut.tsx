import { signOut } from "next-auth/react";

export const handleSignOut = () => {
    signOut({ callbackUrl: '/auth/signin' });
};