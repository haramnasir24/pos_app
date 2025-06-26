import { OAuthConfig } from "@auth/core/providers";

export const SquareProvider = (): OAuthConfig<any> => ({
  id: "square",
  name: "Square",
  type: "oauth",
  authorization: {
    url: "https://connect.squareup.com/oauth2/authorize",
    params: {
      scope: "MERCHANT_PROFILE_READ",
      response_type: "code",
      redirect_uri: "http://localhost:3000/api/auth/callback/square",
    },
  },
  token: {
    url: "https://connect.squareup.com/oauth2/token",
  },
  checks: ["state"], // recommended
  userinfo: {
    url: "https://connect.squareup.com/v2/merchants/me",
    async request({ tokens }: { tokens: { access_token: string } }) {
      const res = await fetch("https://connect.squareup.com/v2/merchants/me", {
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
