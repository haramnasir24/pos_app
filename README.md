# use server actions for post requests (throughout code)

## use sdk alternatively for api requests to cursor

check if search catalog products api can be used for search and filter aswell
look into checkout management*

**Step 6: Product Data Fetching**
Implement server-side rendering for initial product load
Use React Query for search caching
Add infinite scrolling or pagination

**Step 7: Search & Filtering**
Implement debounced search functionality
Create filter options (category, price range, etc.)

Step 8: Shopping Cart with Streaming UI
Create cart context using React Context API
Implement streaming UI for cart updates
Create side drawer component with smooth animations

Step 9: Product Cards with Quantity Controls
Design responsive product cards
Implement quantity controls that replace "Add to Cart" button
Add loading states and error handling

Step 10: Optimize Performance
Implement proper loading states
Add skeleton screens for better perceived performance
Optimize images and implement lazy loading


Use Next.js server actions to integrate directly with Square POS APIs.
Implement functions for product retrieval, discount and tax options, and order processing.
Ensure Square API calls are made securely using authenticated sessions.


<!-- import { NextRequest, NextResponse } from "next/server";
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
} -->
