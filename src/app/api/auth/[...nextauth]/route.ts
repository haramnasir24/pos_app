import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";


const SQUARE_CLIENT_ID = process.env.SQUARE_CLIENT_ID!;
const SQUARE_CLIENT_SECRET = process.env.SQUARE_CLIENT_SECRET!;

export const authOptions: NextAuthConfig = {
  providers: [
    {
      id: "square",
      name: "Square",
      type: "oauth",
      clientId: SQUARE_CLIENT_ID,
      clientSecret: SQUARE_CLIENT_SECRET,
      authorization: {
        url: "https://connect.squareupsandbox.com/oauth2/authorize",
        params: {
          scope: "MERCHANT_PROFILE_READ PAYMENTS_READ",
          response_type: "code",
        },
      },
      token: {
        url: "https://connect.squareupsandbox.com/oauth2/token",
      },
      userinfo: {
        url: "https://connect.squareupsandbox.com/v2/merchants/me",
      },
      profile(profile) {
        return {
          id: profile.merchant?.id,
          name: profile.merchant?.business_name,
          email: profile.merchant?.email || null,
        };
      },
    },
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      //  session.user.id = token.sub;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
