// this is the API route that fetches products from the Square API
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const types = searchParams.get('types');
  const accessToken = req.headers.get('authorization')?.replace('Bearer ', '');

  const url = `https://connect.squareupsandbox.com/v2/catalog/list?types=${types}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Square-Version": "2025-06-18",
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}