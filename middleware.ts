//  import NextAuth from "next-auth"
// import { NextRequest } from "next/server";
// export { auth as middleware } from "./auth";

// const { auth } = NextAuth(authConfig)

// export default auth(async function middleware(req: NextRequest) {

// export const config = {
//   matcher: ["/dashboard/:path*"],
// };

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect root to sign-in page
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
