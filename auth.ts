import NextAuth from "next-auth";
// import { authConfig } from "./src/app/lib/auth/config";

// export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);

// export const { handlers, auth, signIn, signOut } = NextAuth({
//   providers: [
//     {
//       id: "square",
//       name: "Square",
//       type: "oauth",
//       clientId: process.env.SQUARE_CLIENT_ID!,
//       clientSecret: process.env.SQUARE_CLIENT_SECRET!,
//       authorization: {
//         url: "https://connect.squareupsandbox.com/oauth2/authorize",
//         params: { scope: "MERCHANT_PROFILE_READ", response_type: "code" },
//       },
//       token: "https://connect.squareupsandbox.com/oauth2/token",
//       userinfo: {
//         url: "https://connect.squareupsandbox.com/v2/merchants/me",
//         async request({ tokens }: { tokens: { access_token: string } }) {
//           const res = await fetch(
//             "https://connect.squareupsandbox.com/v2/merchants/me",
//             {
//               headers: {
//                 Authorization: `Bearer ${tokens.access_token}`,
//                 "Square-Version": "2023-10-18",
//               },
//             }
//           );
//           const data = await res.json();
//           return data.merchant;
//         },
//       },
//       profile(profile) {
//         return {
//           id: profile.id,
//           name: profile.business_name || profile.name || "Square User",
//           email: profile.email || null,
//           image: null,
//         };
//       },
//     },
//   ],
//   debug: true,
// });



export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    {
      id: "credentials",
      name: "Credentials",
      type: "credentials",
      credentials: {
        accessToken: { label: "Access Token", type: "text" },
        refreshToken: { label: "Refresh Token", type: "text" },
        merchantId: { label: "Merchant ID", type: "text" },
        merchantName: { label: "Merchant Name", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.accessToken) {
          return null;
        }
        
        return {
          id: credentials.merchantId as string,
          name: credentials.merchantName as string,
          email: null,
          image: null,
          accessToken: credentials.accessToken as string,
          refreshToken: credentials.refreshToken as string,
          merchantId: credentials.merchantId as string,
        };
      },
    },
    {
      id: "square",
      name: "Square",
      type: "oauth",
      clientId: process.env.SQUARE_CLIENT_ID!,
      clientSecret: process.env.SQUARE_CLIENT_SECRET!,
      authorization: {
        url: "https://connect.squareupsandbox.com/oauth2/authorize",
        params: { 
          scope: "MERCHANT_PROFILE_READ", 
          response_type: "code" 
        },
      },
      token: {
        url: "https://connect.squareupsandbox.com/oauth2/token",
        async request({ client, params, checks, provider }: any) {
          console.log("Custom token request for Square");
          console.log("Code:", params.code);
          console.log("Redirect URI:", client.redirectUri);
          console.log("Checks:", checks);
          
          const body = new URLSearchParams({
            client_id: client.clientId,
            client_secret: client.clientSecret,
            code: params.code!,
            grant_type: "authorization_code",
            redirect_uri: client.redirectUri,
          });

          // Add PKCE code verifier if present (even though we don't want PKCE, NextAuth might still send it)
          if (checks?.code_verifier) {
            console.log("Adding code_verifier:", checks.code_verifier);
            body.append("code_verifier", checks.code_verifier);
          }

          console.log("Request body:", body.toString());

          const response = await fetch(provider.token?.url!, {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            method: "POST",
            body,
          });

          console.log("Token response status:", response.status);
          console.log("Token response headers:", Object.fromEntries(response.headers.entries()));
          
          const responseText = await response.text();
          console.log("Token response body:", responseText);
          
          if (!response.ok) {
            console.error("Token request failed:", response.status, responseText);
            throw new Error(`Token request failed: ${response.status} ${responseText}`);
          }

          const tokens = JSON.parse(responseText);
          console.log("Received tokens:", tokens);
          
          // Return the format NextAuth expects
          return {
            tokens: {
              access_token: tokens.access_token,
              refresh_token: tokens.refresh_token,
              expires_in: tokens.expires_at ? Math.floor((new Date(tokens.expires_at).getTime() - Date.now()) / 1000) : undefined,
              token_type: tokens.token_type,
            },
          };
        },
      },
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
          
          if (!res.ok) {
            const errorText = await res.text();
            console.error("Userinfo request failed:", res.status, errorText);
            throw new Error(`Userinfo request failed: ${res.status} ${errorText}`);
          }
          
          const data = await res.json();
          return data.merchant;
        },
      },
      profile(profile) {
        return {
          id: profile.id,
          name: profile.business_name || profile.name || "Square User",
          email: profile.owner_email || profile.email || null,
          image: null,
        };
      },
      checks: [], // Try to disable PKCE
    },
  ],
  callbacks: {
    async jwt({ token, account, profile, user }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
        token.merchantId = account.merchant_id;
      }
      
      // Handle credentials provider
      if (user && 'accessToken' in user) {
        token.accessToken = (user as any).accessToken;
        token.refreshToken = (user as any).refreshToken;
        token.merchantId = (user as any).merchantId;
      }
      
      return token;
    },
    async session({ session, token }: any) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken;
      session.merchantId = token.merchantId;
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  debug: process.env.NODE_ENV === 'development',
});
