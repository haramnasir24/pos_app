"use client";

import { useSearchParams } from "next/navigation";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-red-600">
        Authentication Error
      </h1>

      <div className="mb-6 p-4 bg-red-100 rounded">
        <h2 className="text-lg font-semibold mb-2">Error Details</h2>
        <p>
          <strong>Error:</strong> {error || "Unknown error"}
        </p>
      </div>

      <div className="mb-6 p-4 bg-yellow-100 rounded">
        <h2 className="text-lg font-semibold mb-2">Common Solutions</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Check that your Square Client ID and Secret are correct</li>
          <li>
            Verify that your redirect URI in Square Developer Dashboard matches:{" "}
            <code>http://localhost:3000/api/auth/callback/square</code>
          </li>
          <li>
            Ensure your Square app has the correct permissions
            (MERCHANT_PROFILE_READ)
          </li>
          <li>
            Check that NEXTAUTH_SECRET is set in your environment variables
          </li>
          <li>
            Verify that NEXTAUTH_URL is set to{" "}
            <code>http://localhost:3000</code>
          </li>
        </ul>
      </div>

      <div className="space-x-4">
        <a
          href="/test-auth"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </a>
        <a
          href="/"
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}
