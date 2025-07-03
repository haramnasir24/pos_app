import { useState } from "react";

import { css } from "../../../../styled-system/css";

interface SearchBarProps {
  setParams: (params: Record<string, any>) => void;
  prevParams?: Record<string, any>;
}


// search bar not working if i use SSR on initial product fetch
export default function SearchBar({
  setParams,
  prevParams = {},
}: SearchBarProps) {
  const [search, setSearch] = useState("");


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setParams({
      ...prevParams,
      query: {
        text_query: {
          keywords: [search],
        },
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={css({
        display: "flex",
        alignItems: "center",
        gap: "2",
        w: "full",
        maxW: "md",
        mx: "auto",
        mb: "6",
      })}
    >
      <input
        type="text"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search products..."
        className={css({
          flex: 1,
          px: "4",
          py: "2",
          border: "1px solid",
          borderColor: "gray.300",
          borderRadius: "md",
          fontSize: "md",
          outline: "none",
          _focus: {
            borderColor: "gray.800",
            boxShadow: "0 0 0 2px rgb(61, 63, 64)",
          },
          transition: "border-color 0.2s, box-shadow 0.2s",
        })}
      />

      <button
        type="submit"
        className={css({
          px: "4",
          py: "2",
          bg: "gray.700",
          color: "white",
          borderRadius: "md",
          fontWeight: "medium",
          fontSize: "md",
          cursor: "pointer",
          _hover: {
            bg: "gray.800",
            // transform: "scale(1.03)",
            boxShadow: "md",
          },
          _active: {
            bg: "gray.800",
          },
          transition: "all 0.2s",
        })}
      >
        Search
      </button>
    </form>
  );
}
