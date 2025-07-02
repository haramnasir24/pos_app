'use client';

import { signIn, signOut,useSession } from 'next-auth/react';
import { useState } from 'react';

export default function TestAuthPage() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn('square', { callbackUrl: '/test-auth' });
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut({ callbackUrl: '/test-auth' });
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading') {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Square OAuth Test Page</h1>
      
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h2 className="text-lg font-semibold mb-2">Authentication Status</h2>
        <p><strong>Status:</strong> {status}</p>
        <p><strong>Authenticated:</strong> {session ? 'Yes' : 'No'}</p>
      </div>

      {session ? (
        <div className="mb-6 p-4 bg-green-100 rounded">
          <h2 className="text-lg font-semibold mb-2">Session Data</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-yellow-100 rounded">
          <p>Not authenticated. Click the button below to sign in with Square.</p>
        </div>
      )}

      <div className="space-x-4">
        {!session ? (
          <button
            onClick={handleSignIn}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign in with Square'}
          </button>
        ) : (
          <button
            onClick={handleSignOut}
            disabled={isLoading}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
          >
            {isLoading ? 'Signing out...' : 'Sign out'}
          </button>
        )}
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h2 className="text-lg font-semibold mb-2">Debug Information</h2>
        <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
        <p><strong>Square Client ID:</strong> {process.env.NEXT_PUBLIC_SQUARE_CLIENT_ID ? 'Set' : 'Not set'}</p>
        <p><strong>Square Client Secret:</strong> {process.env.SQUARE_CLIENT_SECRET ? 'Set' : 'Not set'}</p>
        <p><strong>NEXTAUTH_URL:</strong> {process.env.NEXTAUTH_URL || 'Not set (defaults to http://localhost:3000)'}</p>
        <p><strong>NEXTAUTH_SECRET:</strong> {process.env.NEXTAUTH_SECRET ? 'Set' : 'Not set'}</p>
      </div>
    </div>
  );
} 