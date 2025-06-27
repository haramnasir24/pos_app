import NextAuth from "next-auth";
// import { authConfig } from "./src/app/lib/auth/config";

// export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    {
      id: "square", // this will be used as signIn("square") and in callback URLs
      name: "Square",
      type: "oauth", // OAuth 2.0 provider
      // issuer: "https://YOUR_SQUARE_ISSUER_URL",
      clientId: process.env.SQUARE_CLIENT_ID!,
      clientSecret: process.env.SQUARE_CLIENT_SECRET!,
      authorization: {
        url: "https://connect.squareupsandbox.com/oauth2/authorize",
        params: {
          scope: "MERCHANT_PROFILE_READ",
          response_type: "code",
        },
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
                "Square-Version": "2023-10-18", // look this up
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
      checks: ["state"],
    },
  ],
  secret: process.env.AUTH_SECRET!,
  trustHost: true,
  debug: true,
  callbacks: {
    async session({ session, token }) {
      return session;
    },
    async jwt({ token, account, profile }) {
      return token;
    },
  },
});


// callbacks: {
//     async session({ session, token }) {
//       session.user.id = token.sub ?? "";
//       return session;
//     },
//   },


// token: {
//   url: "https://connect.squareupsandbox.com/oauth2/token",
//   async request({ client, params, checks, provider }) {
//     const response = await fetch("https://connect.squareupsandbox.com/oauth2/token", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "Square-Version": "2023-10-18", // Use latest Square API version
//       },
//       body: JSON.stringify({
//         client_id: provider.clientId,
//         client_secret: provider.clientSecret,
//         code: params.code,
//         grant_type: "authorization_code",
//       }),
//     });
//     return await response.json();
//   },
// },