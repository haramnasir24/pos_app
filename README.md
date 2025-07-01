# use server actions for post requests (throughout code)

## use sdk alternatively for api requests to cursor

**look into square apis
catalog api 
check if search catalog products api can be used for search and filter aswell
check response of search catalog products

look into checkout management**



For each product, you’ll need:
A unique idempotency_key (can be a UUID or random string)
An object of type ITEM
item_data with:
name (from your product title)
description
variations (at least one, with price in cents)
Optionally, category_id, image_ids, etc.

curl https://connect.squareupsandbox.com/v2/catalog/object \
  -X POST \
  -H 'Square-Version: 2025-06-18' \
  -H 'Authorization: Bearer ACCESS_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "idempotency_key": "unique-key-1",
    "object": {
      "type": "ITEM",
      "id": "#essence_mascara_lash_princess",
      "item_data": {
        "name": "Essence Mascara Lash Princess",
        "description": "The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects. Achieve dramatic lashes with this long-lasting and cruelty-free formula.",
        "variations": [
          {
            "id": "#essence_mascara_lash_princess_var",
            "type": "ITEM_VARIATION",
            "item_variation_data": {
              "name": "Default",
              "price_money": {
                "amount": 999,
                "currency": "USD"
              },
              "pricing_type": "FIXED_PRICING"
            }
          }
        ]
      }
    }
  }'

You must first upload each image using the CreateCatalogImage endpoint.
The response will give you an image_id.
Then, add "image_ids": ["IMAGE_ID"] to your item_data

Step 6: Product Data Fetching
Implement server-side rendering for initial product load
Add infinite scrolling or pagination

Step 7: Search & Filtering
Implement debounced search functionality
Create filter options (category, price range, etc.)
Use React Query for search caching


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
