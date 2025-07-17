"use client";

import { useState, useEffect } from "react";


import { useDebounce } from "@/shared/hooks/useDebounce";
import { css } from "~/styled-system/css";

/**
 * Props for the SearchBar component.
 */
interface SearchBarProps {
  setParams: (params: Record<string, any>) => void;
  prevParams: Record<string, any>;
}

/**
 * Search bar component for filtering products by keyword with debounce.
 * Updates params when the user types at least 3 characters.
 */
export default function SearchBar({ setParams, prevParams }: SearchBarProps) {
  const [searchInput, setSearchInput] = useState("");
  // Debounced search input value
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
        types: "item, image, category, tax, discount, pricing_rule, product_set",
        query: {
          ...prevParams.query,
          text_query: undefined,
        },
      });
      // setSearchInput('');
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
