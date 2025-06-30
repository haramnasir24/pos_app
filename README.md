# use server actions for post requests


{
  "objects": [
    {
      "type": "ITEM",
      "id": "MB4QWHLTFLO65WBS3GUWFRIZ",
      "updated_at": "2025-06-30T13:00:21.217Z",
      "created_at": "2025-06-30T11:28:23.768Z",
      "version": 1751288421217,
      "is_deleted": false,
      "present_at_all_locations": true,
      "item_data": {
        "name": "Toothbrush",
        "is_taxable": true,
        "variations": [
          {
            "type": "ITEM_VARIATION",
            "id": "P37RYQU65ZTQ6FNUHL3RKOKV",
            "updated_at": "2025-06-30T12:54:16.177Z",
            "created_at": "2025-06-30T11:28:23.768Z",
            "version": 1751288056177,
            "is_deleted": false,
            "present_at_all_locations": true,
            "item_variation_data": {
              "item_id": "MB4QWHLTFLO65WBS3GUWFRIZ",
              "name": "Regular",
              "ordinal": 1,
              "pricing_type": "VARIABLE_PRICING",
              "inventory_alert_type": "NONE",
              "sellable": true,
              "stockable": true
            }
          }
        ],
        "product_type": "REGULAR",
        "skip_modifier_screen": false,
        "ecom_visibility": "UNAVAILABLE",
        "image_ids": [
          "CKSPAZBJXNRUVMBMIB2MK6F5"
        ],
        "categories": [
          {
            "id": "NL7H7LWRYRMGSNVEECZS4PM7",
            "ordinal": -2251765453946880
          }
        ],
        "is_archived": false,
        "reporting_category": {
          "id": "NL7H7LWRYRMGSNVEECZS4PM7",
          "ordinal": -2251765453946880
        },
        "is_alcoholic": false
      }
    },
    {
      "type": "ITEM",
      "id": "T5PMPCOF6QPDQEHXUCH2TVQY",
      "updated_at": "2025-06-30T13:00:42.123Z",
      "created_at": "2025-06-30T12:52:26.971Z",
      "version": 1751288442123,
      "is_deleted": false,
      "present_at_all_locations": true,
      "item_data": {
        "name": "Hairbrush",
        "label_color": "990838",
        "is_taxable": true,
        "variations": [
          {
            "type": "ITEM_VARIATION",
            "id": "PR23EJW6JXOLAB2OMNKWOHBY",
            "updated_at": "2025-06-30T13:00:42.123Z",
            "created_at": "2025-06-30T12:52:26.971Z",
            "version": 1751288442123,
            "is_deleted": false,
            "present_at_all_locations": true,
            "item_variation_data": {
              "item_id": "T5PMPCOF6QPDQEHXUCH2TVQY",
              "name": "Regular",
              "ordinal": 1,
              "pricing_type": "FIXED_PRICING",
              "price_money": {
                "amount": 2000,
                "currency": "USD"
              },
              "track_inventory": false,
              "sellable": true,
              "stockable": true
            }
          }
        ],
        "product_type": "REGULAR",
        "skip_modifier_screen": false,
        "ecom_visibility": "UNAVAILABLE",
        "image_ids": [
          "AHOKDYWOIB3RRXQ35S4AFJCJ"
        ],
        "categories": [
          {
            "id": "NL7H7LWRYRMGSNVEECZS4PM7",
            "ordinal": -2251799813685248
          }
        ],
        "is_archived": false,
        "reporting_category": {
          "id": "NL7H7LWRYRMGSNVEECZS4PM7",
          "ordinal": -2251799813685248
        },
        "is_alcoholic": false
      }
    },
    {
      "type": "ITEM",
      "id": "WXFU5ITW4AHPDOLYZI26YMH5",
      "updated_at": "2025-06-30T12:55:08.675Z",
      "created_at": "2025-06-30T12:54:55.51Z",
      "version": 1751288108675,
      "is_deleted": false,
      "present_at_all_locations": true,
      "item_data": {
        "name": "Mom jeans",
        "is_taxable": true,
        "variations": [
          {
            "type": "ITEM_VARIATION",
            "id": "W5FUVGSAZNSPYSZFNT3PWPKP",
            "updated_at": "2025-06-30T12:54:55.463Z",
            "created_at": "2025-06-30T12:54:55.51Z",
            "version": 1751288095463,
            "is_deleted": false,
            "present_at_all_locations": true,
            "item_variation_data": {
              "item_id": "WXFU5ITW4AHPDOLYZI26YMH5",
              "name": "",
              "ordinal": 0,
              "pricing_type": "FIXED_PRICING",
              "price_money": {
                "amount": 4500,
                "currency": "USD"
              },
              "inventory_alert_type": "NONE",
              "sellable": true,
              "stockable": true
            }
          }
        ],
        "product_type": "FOOD_AND_BEV",
        "skip_modifier_screen": false,
        "categories": [
          {
            "id": "EDXZOUKTWSRDX57X27DAVU3P",
            "ordinal": -2251799813685248
          }
        ],
        "is_archived": false,
        "reporting_category": {
          "id": "EDXZOUKTWSRDX57X27DAVU3P",
          "ordinal": -2251799813685248
        }
      }
    }
  ]
}

Step 6: Product Data Fetching
Create useProducts hook with React Query
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
