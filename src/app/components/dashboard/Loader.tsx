import { css } from "../../../../styled-system/css";

export default function Loader() {
  return (
    <div
      className={css({
        minHeight: "30vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      })}
    >
      <div
        className={css({
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        })}
      >
        <div
          className={css({
            animation: "spin 1s linear infinite",
            borderRadius: "50%",
            height: "64px",
            width: "64px",
            border: "4px solid rgb(39, 39, 39)",
            borderTopColor: "transparent",
            margin: "0 auto",
          })}
        ></div>
        <p
          className={css({
            fontSize: "18px",
            fontWeight: "500",
            color: "#374151",
          })}
        >
          Loading...
        </p>
      </div>
    </div>
  );
}
