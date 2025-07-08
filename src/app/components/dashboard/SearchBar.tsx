"use client";

import { useState, useEffect } from "react";

import { css } from "../../../../styled-system/css";
import { useDebounce } from "@/app/hooks/useDebounce";

interface SearchBarProps {
  setParams: (params: Record<string, any>) => void;
  prevParams: Record<string, any>;
}

// Debounce hook

export default function SearchBar({ setParams, prevParams }: SearchBarProps) {
  const [searchInput, setSearchInput] = useState("");
  // ? does debounced search depends on search input
  const debouncedSearch = useDebounce(searchInput, 500);

  useEffect(() => {
    if (debouncedSearch.length >= 3) {
      setParams({
        ...prevParams,
        query: {
          ...prevParams.query,
          text_query: {
            keywords: [debouncedSearch],
          },
        },
      });
    } else {
      // If less than 3 chars, show initial product listing, remove search query
      setParams({
        types: "item, image, category, tax, discount",
        query: {
          ...prevParams.query,
          text_query: undefined,
        },
      });
    }
  }, [debouncedSearch]);

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
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
        value={searchInput}
        onChange={(event) => setSearchInput(event.target.value)}
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
            boxShadow: "0 0 0 1px rgb(61, 62, 62)",
          },
          transition: "border-color 0.2s, box-shadow 0.2s",
        })}
      />
    </form>
  );
}
