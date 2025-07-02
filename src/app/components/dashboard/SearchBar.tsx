import { useState } from "react";

import { css } from "../../../../styled-system/css";

interface SearchBarProps {
  setParams: (params: Record<string, any>) => void;
  prevParams?: Record<string, any>;
}

export default function SearchBar({
  setParams,
  prevParams = {},
}: SearchBarProps) {
  const [search, setSearch] = useState("");

  // const debouncedSearch = useDebounce(search, 300);

  // useEffect(() => {
  //   if (debouncedSearch.length >= 3) {
  //     setParams({
  //       ...prevParams,
  //       query: {
  //         text_query: {
  //           keywords: [search],
  //         },
  //       },
  //     });
  //   }
  //   else if (debouncedSearch.length === 0) {
  //     setParams({ ...prevParams, query: undefined });
  //   }
  // }, [debouncedSearch, setParams, prevParams]);

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
            borderColor: "blue.500",
            boxShadow: "0 0 0 2px #3b82f6",
          },
          transition: "border-color 0.2s, box-shadow 0.2s",
        })}
      />

      <button
        type="submit"
        className={css({
          px: "4",
          py: "2",
          bg: "blue.600",
          color: "white",
          borderRadius: "md",
          fontWeight: "medium",
          fontSize: "md",
          _hover: {
            bg: "blue.700",
            transform: "scale(1.03)",
            boxShadow: "md",
          },
          _active: {
            bg: "blue.800",
          },
          transition: "all 0.2s",
        })}
      >
        Search
      </button>
    </form>
  );
}
