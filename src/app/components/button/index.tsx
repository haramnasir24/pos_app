import { signOut } from "next-auth/react";
import { cva } from "~/styled-system/css/cva.mjs";

const button = cva({
  base: {
    rounded: "lg",
    fontSize: "sm",
    transition: "all 0.2s",
    cursor: "pointer",
    fontWeight: "medium",
  },
  variants: {
    style: {
      dashboard: {
        bg: "red.500",
        _hover: {
          bg: "red.600",
          shadow: "md",
        },
        px: "4",
        py: "2",
        color: "white",
      },
      home: {
        width: "100%",
        bg: "white",
        color: "#374151",
        padding: "12px 16px",
        border: "1px solid #d1d5db",
        _hover: {
          bg: "#f9fafb",
        },
      },
    },
  },
});

export { button };
