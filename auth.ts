import NextAuth from "next-auth";
// import { authConfig } from "./src/app/lib/auth/config";

// export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    {
      id: "square",
      name: "Square",
      type: "oauth",
      clientId: process.env.SQUARE_CLIENT_ID!,
      clientSecret: process.env.SQUARE_CLIENT_SECRET!,
      authorization: {
        url: "https://connect.squareupsandbox.com/oauth2/authorize",
        params: { scope: "MERCHANT_PROFILE_READ", response_type: "code" },
      },
      token: "https://connect.squareupsandbox.com/oauth2/token",
      userinfo: {
        url: "https://connect.squareupsandbox.com/v2/merchants/me",
        async request({ tokens }: { tokens: { access_token: string } }) {
          const res = await fetch(
            "https://connect.squareupsandbox.com/v2/merchants/me",
            {
              headers: {
                Authorization: `Bearer ${tokens.access_token}`,
                "Square-Version": "2023-10-18",
              },
            }
          );
          const data = await res.json();
          return data.merchant;
        },
      },
      profile(profile) {
        return {
          id: profile.id,
          name: profile.business_name || profile.name || "Square User",
          email: profile.email || null,
          image: null,
        };
      },
    },
  ],
  debug: true,
});
