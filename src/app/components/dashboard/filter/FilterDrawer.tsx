import { useEffect, useState } from "react";
import { css } from "~/styled-system/css";

type CategoryObj = { id: string; name: string };

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  onApply: (selectedCategories: CategoryObj[]) => void;
  categoryObjects: CategoryObj[];
}

export default function FilterDrawer({
  open,
  onClose,
  onApply,
  categoryObjects,
}: FilterDrawerProps) {
  const [selected, setSelected] = useState<CategoryObj[]>([]);

  // * reset selected when drawer opens
  // useEffect(() => {
  //   if (open) setSelected([]);
  // }, [open]);

  // * adds or removes a category object from the selected list
  const handleToggle = (category: CategoryObj) => {
    setSelected((prev) =>
      prev.some((c) => c.id === category.id)
        ? prev.filter((c) => c.id !== category.id)
        : [...prev, category]
    );
  };

  // * passes the selected category objects and then closes the drawer
  const handleApply = () => {
    onApply(selected);
    onClose();
  };

  const handleClear = () => {
    setSelected([]);
    onApply([]); // * call the API with no filter query
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className={css({
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            bg: "blackAlpha.200",
            zIndex: 99,
          })}
          onClick={onClose}
        />
      )}
      {/* Drawer */}
      <div
        className={css({
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: 80,
          bg: "white",
          boxShadow: "lg",
          zIndex: 100,
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          display: "flex",
          flexDirection: "column",
          p: 6,
        })}
      >
        <button
          className={css({
            alignSelf: "flex-end",
            fontSize: "2xl",
            bg: "none",
            border: "none",
            cursor: "pointer",
            mb: 2,
          })}
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className={css({ fontWeight: "bold", fontSize: "2xl", mb: 4 })}>
          Filter by Category
        </h2>

        {open && (
          <div className={css({ flex: 1, overflowY: "auto" })}>
            {categoryObjects.map((category) => (
              <label
                key={category.id}
                className={css({
                  display: "flex",
                  alignItems: "center",
                  mb: 3,
                  cursor: "pointer",
                })}
              >
                <input
                  type="checkbox"
                  checked={selected.some((c) => c.id === category.id)}
                  onChange={() => handleToggle(category)}
                  className={css({ mr: 2, cursor: "pointer" })}
                />
                {category.name}
              </label>
            ))}
          </div>
        )}

        <button
          className={css({
            mt: 6,
            py: 3,
            bg: "blue.600",
            color: "white",
            border: "none",
            borderRadius: "md",
            fontWeight: "semibold",
            fontSize: "lg",
            cursor: "pointer",
            _hover: { bg: "blue.700" },
          })}
          onClick={handleApply}
        >
          Apply Filter
        </button>
        <button
          className={css({
            mt: 2,
            py: 3,
            bg: "gray.200",
            color: "black",
            border: "none",
            borderRadius: "md",
            fontWeight: "semibold",
            fontSize: "lg",
            cursor: "pointer",
            _hover: { bg: "gray.300" },
          })}
          onClick={handleClear}
        >
          Clear Filter
        </button>
      </div>
    </>
  );
}
