import { NextRequest, NextResponse } from "next/server";

const SQUARE_VERSION = "2025-06-18";

export async function POST(request: NextRequest) {
  try {
    const { accessToken } = await request.json();

    if (!accessToken) {
      return NextResponse.json(
        { error: "Access token is required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      "https://connect.squareupsandbox.com/v2/catalog/search",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Square-Version": SQUARE_VERSION,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          object_types: ["DISCOUNT"],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Square API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch discounts:", error);
    return NextResponse.json(
      { error: "Failed to fetch discounts" },
      { status: 500 }
    );
  }
} 