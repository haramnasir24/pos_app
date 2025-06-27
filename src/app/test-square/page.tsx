'use client';

import { useState } from 'react';

export default function TestSquarePage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const startOAuth = () => {
    const clientId = process.env.NEXT_PUBLIC_SQUARE_CLIENT_ID!;
    const redirectUri = 'http://localhost:3000/api/auth/square/callback';
    
    const authUrl = new URL('https://connect.squareupsandbox.com/oauth2/authorize');
    authUrl.searchParams.set('client_id', clientId);
    authUrl.searchParams.set('scope', 'MERCHANT_PROFILE_READ');
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('redirect_uri', redirectUri);
    
    window.location.href = authUrl.toString();
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Square OAuth Test</h1>
      
      <div className="space-y-4">
        <button
          onClick={startOAuth}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Start Square OAuth Flow
        </button>
    
      </div>
      
      {result && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Result:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Instructions:</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>Click "Start Square OAuth Flow" to begin the OAuth process</li>
          <li>You'll be redirected to Square for authorization</li>
          <li>After authorization, you'll be redirected to the manual callback</li>
        </ol>
      </div>
    </div>
  );
} 