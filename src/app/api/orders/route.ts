// * api endpoint for creating an order

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { orderData, accessToken } = await request.json();

    if (!accessToken) {
      return NextResponse.json(
        { error: "Access token is required" },
        { status: 400 }
      );
    }

    if (!orderData) {
      return NextResponse.json(
        { error: "Order data is required" },
        { status: 400 }
      );
    }

    const response = await fetch("https://connect.squareupsandbox.com/v2/orders", {
      method: "POST",
      headers: {
        "Square-Version": "2025-06-18",
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Square API error:", errorData);
      return NextResponse.json(
        { error: "Failed to create order", details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 