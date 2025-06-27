// for directly testing the square oauth api without configuring for authjs

import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      new URL("/oauth-result?status=denied", req.url)
    );
  }

  if (!code) {
    return new NextResponse("Missing authorization code.", { status: 400 });
  }

  try {
    const tokenRes = await axios.post(
      "https://connect.squareupsandbox.com/oauth2/token",
      {
        client_id: process.env.SQUARE_CLIENT_ID,
        client_secret: process.env.SQUARE_CLIENT_SECRET,
        code: code,
        grant_type: "authorization_code",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const { access_token, refresh_token, merchant_id } = tokenRes.data;

    console.log("Access Token:", access_token);
    console.log("Refresh Token:", refresh_token);
    console.log("Merchant ID:", merchant_id);

    return NextResponse.json({ 
      access_token, 
      refresh_token, 
      merchant_id 
    });

    // return NextResponse.redirect(
    //   new URL("/oauth-result?status=approved", req.url)
    // );
  } catch (err) {
    console.error("Token exchange error:", err);
    // return NextResponse.redirect(
    //   new URL("/oauth-result?status=error", req.url)
    // );
  }
}
