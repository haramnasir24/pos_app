// gateway that connects Next.js app to the Auth.js authentication system

import type { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth";


export const authOptions: NextAuthOptions = {
  providers: [
    {
      id: "square",
      name: "Square",
      type: "oauth",
      clientId: process.env.SQUARE_CLIENT_ID!,
      clientSecret: process.env.SQUARE_CLIENT_SECRET!,
      authorization: {
        url: `${process.env.SQUARE_API_BASE}/oauth2/authorize`,
        params: {
          scope: "MERCHANT_PROFILE_READ ITEMS_READ ITEMS_WRITE", // permissions allowed
          response_type: "code",
        },
      },
      // token exchange after receiving authorization code at the redirect callback uri
      token: {
        url: `${process.env.SQUARE_API_BASE}/oauth2/token`,
        async request({ params }) {
          const response = await fetch(
            `${process.env.SQUARE_API_BASE}/oauth2/token`,
            {
              method: "POST",
              headers: {
                "Square-Version": "2025-06-18",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                client_id: process.env.SQUARE_CLIENT_ID!,
                client_secret: process.env.SQUARE_CLIENT_SECRET!,
                code: params.code,
                grant_type: "authorization_code",
                redirect_uri: "http://localhost:3000/api/auth/callback/square",
              }),
            }
          );

          if (!response.ok) {
            throw new Error(`Token exchange failed: ${response.status}`);
          }

          const tokens = await response.json();
          console.log("Successfully received tokens:", tokens);

          return { tokens };
        },
      },
      userinfo: {
        url: `${process.env.SQUARE_API_BASE}/v2/merchants/me`,
        async request({ tokens }) {
          const res = await fetch(
            `${process.env.SQUARE_API_BASE}/v2/merchants/me`,
            {
              headers: {
                Authorization: `Bearer ${tokens.access_token}`,
                "Content-Type": "application/json",
                "Square-Version": "2025-06-18",
              },
            }
          );
          const data = await res.json();
          console.log(data.merchant);
          return data; // check this data
        },
      },
      profile(profile) {
        return {
          id: profile.merchant?.id || "default-id",
          name: profile.merchant?.business_name || null,
          email: profile.email || null,
          image: null,
        };
      },
    },
  ],
  callbacks: {
    // jwt is used to persist custom properties in the token
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.sub =
          (profile as { merchant?: { id?: string } }).merchant?.id ||
          "default-id";
        token.name =
          (profile as { merchant?: { business_name?: string } }).merchant
            ?.business_name || null;
        token.email = (profile as { email?: string }).email || null;
        token.accessToken = account?.access_token;
      }
      // On subsequent requests, just return the token as is
      console.log(token);
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub;
      }
      session.accessToken = token.accessToken as string;
      console.log("session:", session);
      console.log("session:", session.accessToken);
      return session;
    },
    async signIn({ account }) {
      console.log("Access Token:", account?.access_token);
      return true;
    },
  },
  // secret: process.env.NEXTAUTH_SECRET,
  debug: true,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
