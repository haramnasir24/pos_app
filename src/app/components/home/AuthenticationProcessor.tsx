import { css } from "../../../../styled-system/css";

export default function AuthenticationProcessor() {
  return (
    <div
      className={css({
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to bottom right, #eff6ff, #e0e7ff)",
      })}
    >
      <div
        className={css({
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        })}
      >
        <div
          className={css({
            position: "relative",
          })}
        >
          <div
            className={css({
              animation: "spin 1s linear infinite",
              borderRadius: "50%",
              height: "80px",
              width: "80px",
              border: "4px solid #3b82f6",
              borderTopColor: "transparent",
              margin: "0 auto",
            })}
          ></div>
        </div>
        <div>
          <p
            className={css({
              fontSize: "20px",
              fontWeight: "600",
              color: "#1f2937",
              marginBottom: "8px",
            })}
          >
            Processing Authentication
          </p>
          <p
            className={css({
              color: "#6b7280",
            })}
          >
            Please wait while we complete your sign-in...
          </p>
        </div>
      </div>
    </div>
  );
}
