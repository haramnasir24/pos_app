// use this page to test the oauth flow manually
// for this set redirect uri to http://localhost:3000/auth/signin at square developer portal
// and go to http://localhost:3000/auth/signin to test the oauth flow

'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SignInPage() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // check if returning from Square OAuth
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    
    if (code && !isProcessing) {
      setIsProcessing(true);
      handleOAuthCallback(code);
    } else if (error) {
      setError(`OAuth error: ${error}`);
    }
  }, [searchParams, isProcessing]);

  const handleOAuthCallback = async (code: string) => {
    try {
      console.log('Processing OAuth callback with code:', code);
      
      // use the working manual callback
      const response = await fetch(`/api/auth/square/callback?code=${code}`);
      const data = await response.json();
      
      if (data.success) {
        console.log('OAuth successful, creating session...');
        
        // Create a custom session with the tokens
        const result = await signIn('credentials', {
          accessToken: data.tokens.access_token,
          refreshToken: data.tokens.refresh_token,
          merchantId: data.merchant.id,
          merchantName: data.merchant.business_name,
          redirect: false,
        });
        
        if (result?.error) {
          setError(`Session creation failed: ${result.error}`);
        } else {
          // Redirect to dashboard or home
          window.location.href = '/dashboard';
        }
      } else {
        setError(`OAuth failed: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error processing OAuth callback:', error);
      setError(`Error processing OAuth callback: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const startSquareOAuth = () => {
    const clientId = process.env.NEXT_PUBLIC_SQUARE_CLIENT_ID || 'sandbox-sq0idb-0x-Vc3av4SuTFhK9nTyIHw';
    const redirectUri = 'http://localhost:3000/auth/signin';
    
    const authUrl = new URL('https://connect.squareupsandbox.com/oauth2/authorize');
    authUrl.searchParams.set('client_id', clientId);
    authUrl.searchParams.set('scope', 'MERCHANT_PROFILE_READ');
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('redirect_uri', redirectUri);
    
    window.location.href = authUrl.toString();
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/auth/signin' });
  };

  // Show loading state while checking session
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Check if we're in the middle of OAuth flow (has code parameter)
  const hasOAuthCode = searchParams.get('code');
  
  // If user is already authenticated and not in OAuth flow, show sign-out option
  if (session && !hasOAuthCode && !isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Already Signed In
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              You are currently signed in as:
            </p>
            <div className="mt-4 p-4 bg-white rounded-lg border">
              <p className="font-medium text-gray-900">{session.user?.name}</p>
              {(session as any).merchantId && (
                <p className="text-sm text-gray-600">Merchant ID: {(session as any).merchantId}</p>
              )}
            </div>
          </div>
          
          <div className="mt-8 space-y-4">
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Go to Dashboard
            </button>
            
            <button
              onClick={handleSignOut}
              className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Processing authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        <div className="mt-8 space-y-6">
          <button
            onClick={startSquareOAuth}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sign in with Square
          </button>
        </div>
      </div>
    </div>
  );
} 