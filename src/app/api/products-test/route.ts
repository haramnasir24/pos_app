import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const res = await fetch("https://dummyjson.com/products");
  const data = await res.json();
  // Pretty print JSON
  const pretty = JSON.stringify(data, null, 2);
  return new NextResponse(pretty, {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
} 