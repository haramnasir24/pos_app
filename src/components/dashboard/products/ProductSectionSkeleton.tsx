import { css } from "~/styled-system/css";

export default function ProductSectionSkeleton() {
  return (
    <div className={css({ w: "full", mt: "8" })}>
      {/* Search bar skeleton */}
      <div
        className={css({
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8",
          mb: "6",
          width: "100%",
        })}
      >
        <div
          className={css({
            w: "32",
            h: "10",
            bg: "gray.200",
            borderRadius: "md",
          })}
        />
        <div
          className={css({
            w: "64",
            h: "10",
            bg: "gray.200",
            borderRadius: "md",
          })}
        />
      </div>

      {/* Product grid skeleton */}
      <div
        className={css({
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "4",
        })}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className={css({
              h: "64",
              bg: "gray.200",
              borderRadius: "lg",
            })}
          />
        ))}
      </div>
    </div>
  );
}
