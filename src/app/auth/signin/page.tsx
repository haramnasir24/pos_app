// use this page to test the oauth flow manually
// for this set redirect uri to http://localhost:3000/auth/signin at square developer portal
// and go to http://localhost:3000/auth/signin to test the oauth flow

"use client";

import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useRef,useState } from "react";


import ErrorComponent from "@/app/components/home/error/ErrorComponent";
import Loader from "@/app/components/home/loader/Loader";

import handleOAuthCallback from "@/app/utils/auth/handleOAuthCallback";

import { css } from "../../../../styled-system/css";
import SignInText from "@/app/components/home/signin/SignInText";
import SignInButton from "@/app/components/home/signin/SignInButton";
import Authenticated from "@/app/components/home/auth/Authenticated";
import AuthenticationProcessor from "@/app/components/home/auth/AuthenticationProcessor";

export default function SignInPage() {
  const { data: session, status } = useSession(); // useSession returns a session object on client side
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const processedCodes = useRef<Set<string>>(new Set());

  // check if we are returning from Square OAuth
  useEffect(() => {
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (code && !isProcessing && !processedCodes.current.has(code)) {
      processedCodes.current.add(code);
      setIsProcessing(true);
      handleOAuthCallback({ code, setError, setIsProcessing });
    } else if (error) {
      setError(`OAuth error: ${error}`);
    }
  }, [searchParams.toString()]);

  // Show loading state while checking session
  if (status === "loading") {
    return <Loader />;
  }
  
  // Check if in the middle of OAuth flow (has code parameter)
  const hasOAuthCode = searchParams.get("code");

  // If user is already authenticated and not in OAuth flow, show sign-out option
  if (session && !hasOAuthCode && !isProcessing) {
    return (
      <Authenticated session={session} />
    );
  }

  if (isProcessing) {
    return <AuthenticationProcessor />
  }

  return (
    <div
      className={css({
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(to bottom right, #eff6ff, #e0e7ff, #f3e8ff)",
        padding: "16px",
      })}
    >
      <div
        className={css({
          maxWidth: "448px",
          width: "100%",
        })}
      >
        <div
          className={css({
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            padding: "32px",
          })}
        >
          <SignInText />

          {error && <ErrorComponent error={error} />}

          <SignInButton />

          <div
            className={css({
              marginTop: "32px",
              textAlign: "center",
            })}
          >
            <p
              className={css({
                fontSize: "14px",
                color: "#6b7280",
              })}
            >
              By signing in, you agree to our{" "}
              <a
                href="#"
                className={css({
                  color: "#2563eb",
                  _hover: {
                    color: "#1d4ed8",
                  },
                  fontWeight: "500",
                })}
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="#"
                className={css({
                  color: "#2563eb",
                  _hover: {
                    color: "#1d4ed8",
                  },
                  fontWeight: "500",
                })}
              >
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
