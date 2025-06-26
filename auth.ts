import NextAuth from "next-auth";
import { authConfig } from "./src/app/lib/auth/config";

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
