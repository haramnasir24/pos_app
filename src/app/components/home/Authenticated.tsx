import { HomeSignOutButton } from "./HomeSignOutButton";
import { css } from "../../../../styled-system/css";
import { flex } from "../../../../styled-system/patterns";
import { Session } from "next-auth";

type sessionProps = {
  session: Session;
};

export default function Authenticated({ session }: sessionProps) {
  return (
    <div
      className={css({
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to bottom right, #f0fdf4, #d1fae5)",
        padding: "16px",
      })}
    >
      <div
        className={css({
          maxWidth: "448px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "32px",
        })}
      >
        <div
          className={css({
            textAlign: "center",
          })}
        >
          <div
            className={css({
              margin: "0 auto",
              height: "64px",
              width: "64px",
              backgroundColor: "#dcfce7",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "16px",
            })}
          >
            <svg
              className={css({
                height: "32px",
                width: "32px",
                color: "#16a34a",
              })}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2
            className={css({
              fontSize: "30px",
              fontWeight: "700",
              color: "#111827",
              marginBottom: "8px",
            })}
          >
            Already Signed In
          </h2>
          <p
            className={css({
              color: "#6b7280",
            })}
          >
            You are currently signed in as:
          </p>
        </div>

        <div
          className={css({
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            border: "1px solid #e5e7eb",
            padding: "24px",
          })}
        >
          <div
            className={flex({
              alignItems: "center",
              gap: "12px",
              marginBottom: "16px",
            })}
          >
            <div
              className={css({
                height: "40px",
                width: "40px",
                backgroundColor: "#dbeafe",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              })}
            >
              <span
                className={css({
                  color: "#2563eb",
                  fontWeight: "600",
                  fontSize: "18px",
                })}
              >
                {session.user?.name?.charAt(0) || "U"}
              </span>
            </div>
            <div>
              <p
                className={css({
                  fontWeight: "600",
                  color: "#111827",
                })}
              >
                {session.user?.name}
              </p>
              {(session as any).merchantId && (
                <p
                  className={css({
                    fontSize: "14px",
                    color: "#6b7280",
                  })}
                >
                  Merchant ID: {(session as any).merchantId}
                  {/* Merchant ID: {session.user?.id} */}
                </p>
              )}
            </div>
          </div>
        </div>

        <div
          className={css({
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          })}
        >
          <button
            onClick={() => (window.location.href = "/dashboard")}
            className={css({
              width: "100%",
              background: "linear-gradient(to right, #10b981, #059669)",
              color: "white",
              padding: "12px 16px",
              borderRadius: "8px",
              fontWeight: "500",
              _hover: {
                background: "linear-gradient(to right, #059669, #047857)",
                transform: "scale(1.02)",
              },
              _focus: {
                outline: "none",
                ring: "2px",
                ringColor: "#10b981",
                ringOffset: "2px",
              },
              transition: "all 0.2s",
              transform: "scale(1)",
            })}
          >
            Go to Dashboard
          </button>

          <HomeSignOutButton />
        </div>
      </div>
    </div>
  );
}
