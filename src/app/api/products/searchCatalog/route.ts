// this is the API route that fetches products from the Square API
// server side rendering

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { object_types, query, include_related_objects } = await req.json();
  const accessToken = req.headers.get("authorization")?.replace("Bearer ", "");

  const url = "https://connect.squareupsandbox.com/v2/catalog/search";
  const body = {
    object_types,
    query,
    include_related_objects,
  };

  console.log("body:", body);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Square-Version": "2025-06-18",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch products(2)" },
      { status: res.status }
    );
  }

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
