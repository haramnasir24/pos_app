// * api endpoint for getting the inventory count

import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const SQUARE_VERSION = "2025-06-18";

export async function POST(req: NextRequest) {
  try {
    const accessToken = req.headers
      .get("authorization")
      ?.replace("Bearer ", "");
    if (!accessToken) {
      return NextResponse.json(
        { error: "Missing Authorization header" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { variationIds, locationIds } = body;
    if (
      !variationIds ||
      !Array.isArray(variationIds) ||
      variationIds.length === 0
    ) {
      return NextResponse.json(
        { error: "Missing or invalid variationIds array" },
        { status: 400 }
      );
    }

    // optionally allow locationIds to be passed, otherwise omit
    const payload = {
      catalog_object_ids: variationIds,
      ...(locationIds ? { location_ids: locationIds } : {}),
    };

    const response = await axios.post(
      "https://connect.squareupsandbox.com/v2/inventory/counts/batch-retrieve",
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Square-Version": SQUARE_VERSION,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (err: any) {
    const errorMsg = err.response?.data || err.message || "Unknown error";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
