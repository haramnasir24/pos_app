"use client";

import { FaFilter } from "react-icons/fa";
import FilterDrawer from "./FilterDrawer";
import { useState } from "react";
import { css } from "~/styled-system/css";
import categoryObjects from "@/shared/constants/categories.json";

import { CategoryObject } from "@/shared/types/product";
import { buildCategoryFilterParams } from "@/shared/utils/filter/filterUtils";

/**
 * Props for the FilterButton component.
 */
type FilterButtonProps = {
  setParams: (params: Record<string, any>) => void;
  prevParams: Record<string, any>;
};

/**
 * Button component to open the filter drawer and apply category filters.
 */
export default function FilterButton({
  setParams,
  prevParams,
}: FilterButtonProps) {
  const [open, setOpen] = useState(false);

  /**
   * Applies the selected categories as filters using the utility function.
   * @param {CategoryObj[]} selected - Selected categories.
   */
  const onApply = (selected: CategoryObject[]) => {
    setParams(buildCategoryFilterParams(selected, prevParams));
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
