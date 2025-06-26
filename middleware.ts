 import NextAuth from "next-auth"
import { NextRequest } from "next/server";

import { authConfig } from "@/app/lib/auth/config";

const { auth } = NextAuth(authConfig)

export default auth(async function middleware(req: NextRequest) {
  // custom middleware logic goes here
})

export const config = {
  matcher: ["/dashboard/:path*"], // add paths to protect
};
