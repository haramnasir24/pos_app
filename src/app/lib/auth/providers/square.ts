import { OAuthConfig } from "@auth/core/providers";

export const SquareProvider = (): OAuthConfig<any> => ({
  id: "square",
  name: "Square",
  type: "oauth",
  authorization: {
    url: "https://connect.squareupsandbox.com/oauth2/authorize", // Updated to match the actual redirect
    params: {
      scope: "MERCHANT_PROFILE_READ",
      response_type: "code",
    },
  },
  token: "https://connect.squareupsandbox.com/oauth2/token", // Keep this as connect. for API calls
  checks: ["state"], // Disable PKCE, only use state parameter
  userinfo: {
    url: "https://connect.squareupsandbox.com/v2/merchants/me",
    async request({ tokens }: { tokens: { access_token: string } }) {
      const res = await fetch("https://connect.squareupsandbox.com/v2/merchants/me", {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      });
      const data = await res.json();
      return data.merchant;
    },
  },
  profile(profile) {
    return {
      id: profile.id,
      name: profile.business_name || profile.name || "Square User",
      email: null,
      image: null,
    };
  },
  clientId: process.env.SQUARE_CLIENT_ID!,
  clientSecret: process.env.SQUARE_CLIENT_SECRET!,
});
