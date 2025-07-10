import { ErrorProps } from "@/app/types/error";

import { css } from "../../../../../styled-system/css";
import { flex } from "../../../../../styled-system/patterns";

export default function ErrorComponent({ error }: ErrorProps) {
  return (
    <div
      className={css({
        marginBottom: "24px",
        padding: "16px",
        backgroundColor: "#fef2f2",
        border: "1px solid #fecaca",
        borderRadius: "8px",
      })}
    >
      <div
        className={flex({
          alignItems: "center",
        })}
      >
        <svg
          className={css({
            height: "20px",
            width: "20px",
            color: "#f87171",
            marginRight: "8px",
          })}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p
          className={css({
            color: "#b91c1c",
            fontWeight: "500",
          })}
        >
          {error}
        </p>
      </div>
    </div>
  );
}
