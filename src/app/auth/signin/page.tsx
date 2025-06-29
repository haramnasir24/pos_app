// use this page to test the oauth flow manually
// for this set redirect uri to http://localhost:3000/auth/signin at square developer portal
// and go to http://localhost:3000/auth/signin to test the oauth flow

'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { css } from '../../../../styled-system/css';
import { flex, grid, container } from '../../../../styled-system/patterns';

export default function SignInPage() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const processedCodes = useRef<Set<string>>(new Set());

  useEffect(() => {
    // check if returning from Square OAuth
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    
    if (code && !isProcessing && !processedCodes.current.has(code)) {
      processedCodes.current.add(code);
      setIsProcessing(true);
      handleOAuthCallback(code);
    } else if (error) {
      setError(`OAuth error: ${error}`);
    }
  }, [searchParams.toString()]); // Use searchParams.toString() instead of searchParams object

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
      <div className={css({
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(to bottom right, #eff6ff, #e0e7ff)'
      })}>
        <div className={css({
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        })}>
          <div className={css({
            animation: 'spin 1s linear infinite',
            borderRadius: '50%',
            height: '64px',
            width: '64px',
            border: '4px solid #3b82f6',
            borderTopColor: 'transparent',
            margin: '0 auto'
          })}></div>
          <p className={css({
            fontSize: '18px',
            fontWeight: '500',
            color: '#374151'
          })}>Loading...</p>
        </div>
      </div>
    );
  }

  // Check if in the middle of OAuth flow (has code parameter)
  const hasOAuthCode = searchParams.get('code');
  
  // If user is already authenticated and not in OAuth flow, show sign-out option
  if (session && !hasOAuthCode && !isProcessing) {
    return (
      <div className={css({
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(to bottom right, #f0fdf4, #d1fae5)',
        padding: '16px'
      })}>
        <div className={css({
          maxWidth: '448px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '32px'
        })}>
          <div className={css({
            textAlign: 'center'
          })}>
            <div className={css({
              margin: '0 auto',
              height: '64px',
              width: '64px',
              backgroundColor: '#dcfce7',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            })}>
              <svg className={css({
                height: '32px',
                width: '32px',
                color: '#16a34a'
              })} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className={css({
              fontSize: '30px',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '8px'
            })}>
              Already Signed In
            </h2>
            <p className={css({
              color: '#6b7280'
            })}>
              You are currently signed in as:
            </p>
          </div>
          
          <div className={css({
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb',
            padding: '24px'
          })}>
            <div className={flex({
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px'
            })}>
              <div className={css({
                height: '40px',
                width: '40px',
                backgroundColor: '#dbeafe',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              })}>
                <span className={css({
                  color: '#2563eb',
                  fontWeight: '600',
                  fontSize: '18px'
                })}>
                  {session.user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div>
                <p className={css({
                  fontWeight: '600',
                  color: '#111827'
                })}>{session.user?.name}</p>
                {(session as any).merchantId && (
                  <p className={css({
                    fontSize: '14px',
                    color: '#6b7280'
                  })}>Merchant ID: {(session as any).merchantId}</p>
                )}
              </div>
            </div>
          </div>
          
          <div className={css({
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          })}>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className={css({
                width: '100%',
                background: 'linear-gradient(to right, #10b981, #059669)',
                color: 'white',
                padding: '12px 16px',
                borderRadius: '8px',
                fontWeight: '500',
                _hover: {
                  background: 'linear-gradient(to right, #059669, #047857)',
                  transform: 'scale(1.02)'
                },
                _focus: {
                  outline: 'none',
                  ring: '2px',
                  ringColor: '#10b981',
                  ringOffset: '2px'
                },
                transition: 'all 0.2s',
                transform: 'scale(1)'
              })}
            >
              Go to Dashboard
            </button>
            
            <button
              onClick={handleSignOut}
              className={css({
                width: '100%',
                backgroundColor: 'white',
                color: '#374151',
                padding: '12px 16px',
                borderRadius: '8px',
                fontWeight: '500',
                border: '1px solid #d1d5db',
                _hover: {
                  backgroundColor: '#f9fafb'
                },
                _focus: {
                  outline: 'none',
                  ring: '2px',
                  ringColor: '#3b82f6',
                  ringOffset: '2px'
                },
                transition: 'all 0.2s'
              })}
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
      <div className={css({
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(to bottom right, #eff6ff, #e0e7ff)'
      })}>
        <div className={css({
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        })}>
          <div className={css({
            position: 'relative'
          })}>
            <div className={css({
              animation: 'spin 1s linear infinite',
              borderRadius: '50%',
              height: '80px',
              width: '80px',
              border: '4px solid #3b82f6',
              borderTopColor: 'transparent',
              margin: '0 auto'
            })}></div>
            {/* <div className={css({
              position: 'absolute',
              inset: '0',
              borderRadius: '50%',
              border: '4px solid #dbeafe',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            })}></div> */}
          </div>
          <div>
            <p className={css({
              fontSize: '20px',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '8px'
            })}>Processing Authentication</p>
            <p className={css({
              color: '#6b7280'
            })}>Please wait while we complete your sign-in...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={css({
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(to bottom right, #eff6ff, #e0e7ff, #f3e8ff)',
      padding: '16px'
    })}>
      <div className={css({
        maxWidth: '448px',
        width: '100%'
      })}>
        <div className={css({
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #f3f4f6',
          padding: '32px'
        })}>
          <div className={css({
            textAlign: 'center',
            marginBottom: '32px'
          })}>
            <div className={css({
              margin: '0 auto',
              height: '64px',
              width: '64px',
              background: 'linear-gradient(to bottom right, #3b82f6, #4f46e5)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            })}>
              <svg className={css({
                height: '32px',
                width: '32px',
                color: 'white'
              })} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className={css({
              fontSize: '30px',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '8px'
            })}>
              Welcome Back
            </h1>
            <p className={css({
              color: '#6b7280'
            })}>
              Sign in to your Square account to continue
            </p>
          </div>
          
          {error && (
            <div className={css({
              marginBottom: '24px',
              padding: '16px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px'
            })}>
              <div className={flex({
                alignItems: 'center'
              })}>
                <svg className={css({
                  height: '20px',
                  width: '20px',
                  color: '#f87171',
                  marginRight: '8px'
                })} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className={css({
                  color: '#b91c1c',
                  fontWeight: '500'
                })}>{error}</p>
              </div>
            </div>
          )}
          
          <button
            onClick={startSquareOAuth}
            className={css({
              width: '100%',
              background: 'linear-gradient(to right, #2563eb, #4f46e5)',
              color: 'white',
              padding: '16px 24px',
              borderRadius: '12px',
              fontWeight: '600',
              _hover: {
                background: 'linear-gradient(to right, #1d4ed8, #4338ca)',
                transform: 'scale(1.02)',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
              },
              _focus: {
                outline: 'none',
                ring: '2px',
                ringColor: '#3b82f6',
                ringOffset: '2px'
              },
              transition: 'all 0.2s',
              transform: 'scale(1)',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            })}
          >
            <div className={flex({
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px'
            })}>
              <svg className={css({
                height: '24px',
                width: '24px'
              })} fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <span>Sign in with Square</span>
            </div>
          </button>
          
          <div className={css({
            marginTop: '32px',
            textAlign: 'center'
          })}>
            <p className={css({
              fontSize: '14px',
              color: '#6b7280'
            })}>
              By signing in, you agree to our{' '}
              <a href="#" className={css({
                color: '#2563eb',
                _hover: {
                  color: '#1d4ed8'
                },
                fontWeight: '500'
              })}>
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className={css({
                color: '#2563eb',
                _hover: {
                  color: '#1d4ed8'
                },
                fontWeight: '500'
              })}>
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
