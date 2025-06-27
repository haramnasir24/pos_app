// src/app/oauth-result/page.tsx

"use client";

import { useSearchParams } from "next/navigation";

export default function OAuthResultPage() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");

  const message =
    status === "approved"
      ? "Authorization successful!"
      : status === "denied"
      ? "Authorization denied. Please try again."
      : status === "error"
      ? "Something went wrong during authorization."
      : "Processing...";

  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Square OAuth</h1>
      <p>{message}</p>
    </div>
  );
}
