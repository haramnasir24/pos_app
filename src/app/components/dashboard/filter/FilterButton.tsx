"use client";

import { FaFilter } from "react-icons/fa";
import FilterDrawer from "./FilterDrawer";
import { useState } from "react";
import { css } from "~/styled-system/css";
import categoryObjects from "@/app/constant/categories.json";

type CategoryObj = { id: string; name: string };

type FilterButtonProps = {
  // categoryObjects: CategoryObj[];
  setParams: (params: Record<string, any>) => void;
  prevParams: Record<string, any>;
};
export default function FilterButton({
  // categoryObjects,
  setParams,
  prevParams,
}: FilterButtonProps) {
  const [open, setOpen] = useState(false);

  const onApply = (selected: CategoryObj[]) => {
    if (selected && selected.length > 0) {
      setParams({
        ...prevParams,
        query: {
          ...prevParams.query,
          set_query: {
            attribute_values: selected.map((category) => category.id),
            attribute_name: "categories",
          },
        },
      });
    } else {
      setParams({
        types: "item, image, category, tax, discount",
        query: {
          ...prevParams.query,
          set_query: undefined,
        },
      });
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        type="button"
        className={css({
          display: "flex",
          alignItems: "center",
          alignSelf: "flex-start",
          gap: 2,
          height: "45px",
          px: 4,
          py: 2,
          borderRadius: "md",
          border: "1px solid",
          borderColor: "gray.200",
          bg: "white",
          fontWeight: 400,
          cursor: "pointer",
          boxShadow: "xs",
        })}
      >
        <FaFilter style={{ fontSize: 15 }} />
        <span>Filter</span>
      </button>
      <FilterDrawer
        open={open}
        onClose={() => setOpen(false)}
        onApply={onApply}
        categoryObjects={categoryObjects}
      />
    </>
  );
}
