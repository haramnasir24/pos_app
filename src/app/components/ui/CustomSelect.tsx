"use client";

import { useState, useRef, useEffect } from "react";
import { css } from "../../../../styled-system/css";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { cx } from "../../../../styled-system/css";

/**
 * Props for the CustomSelect component.
 * @property {string} value - Current selected value.
 * @property {function} onChange - Callback when selection changes.
 * @property {Array<{value: string, label: string}>} options - Available options.
 * @property {string} placeholder - Placeholder text when no option is selected.
 * @property {boolean} disabled - Whether the select is disabled.
 * @property {string} size - Size variant: "sm", "md", "lg".
 * @property {string} className - Additional CSS classes.
 */
type CustomSelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
};

/**
 * ustom select component with dropdown functionality.
 * Features smooth animations, keyboard navigation, and accessibility support.
 */
export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  disabled = false,
  size = "md",
  className,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const selectRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get selected option label
  const selectedOption = options.find((option) => option.value === value);
  const displayValue = selectedOption?.label || "";

  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
        setFocusedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setFocusedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          event.preventDefault();
          setFocusedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          );
          break;
        case "Enter":
          event.preventDefault();
          if (focusedIndex >= 0 && filteredOptions[focusedIndex]) {
            onChange(filteredOptions[focusedIndex].value);
            setIsOpen(false);
            setSearchTerm("");
            setFocusedIndex(-1);
          }
          break;
        case "Escape":
          setIsOpen(false);
          setSearchTerm("");
          setFocusedIndex(-1);
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, focusedIndex, filteredOptions, onChange]);

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setSearchTerm("");
        setFocusedIndex(-1);
      }
    }
  };

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm("");
    setFocusedIndex(-1);
  };

  const sizeStyles = {
    sm: {
      padding: "4px 10px", // more compact
      fontSize: "12px", // smaller font
      minHeight: "28px",
    },
    md: {
      padding: "8px 12px",
      fontSize: "14px",
      minHeight: "36px",
    },
    lg: {
      padding: "12px 16px",
      fontSize: "16px",
      minHeight: "44px",
    },
  };

  return (
    <div
      ref={selectRef}
      className={cx(
        css({
          position: "relative",
          width: "100%",
        }),
        className
      )}
    >
      {/* Select Trigger */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={css({
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          border: "1px solid",
          borderColor: disabled ? "gray.200" : "gray.300",
          borderRadius: "8px",
          backgroundColor: disabled ? "gray.50" : "white",
          color: disabled ? "gray.400" : "gray.900",
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "all 0.2s ease",
          ...sizeStyles[size],
          _hover: disabled
            ? undefined
            : {
                borderColor: "gray.400",
                boxShadow: "0 0 0 1px rgb(156, 163, 175)",
              },
          _focus: disabled
            ? undefined
            : {
                outline: "none",
                borderColor: "blue.500",
                boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
              },
          px: "2",
        })}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={placeholder}
      >
        <span
          className={css({
            flex: "1",
            textAlign: "left",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            color: value ? "gray.900" : "gray.500",
            fontSize: size === "sm" ? "12px" : size === "md" ? "14px" : "16px",
          })}
        >
          {displayValue || placeholder}
        </span>
        {isOpen ? (
          <IoChevronUp
            className={css({
              width: "16px",
              height: "16px",
              color: "gray.400",
              transition: "transform 0.2s ease",
            })}
          />
        ) : (
          <IoChevronDown
            className={css({
              width: "16px",
              height: "16px",
              color: "gray.400",
              transition: "transform 0.2s ease",
            })}
          />
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className={css({
            position: "absolute",
            top: "100%",
            left: "0",
            right: "0",
            zIndex: 50,
            marginTop: "4px",
            backgroundColor: "white",
            border: "1px solid",
            borderColor: "gray.200",
            borderRadius: "8px",
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            maxHeight: "200px",
            overflow: "hidden",
            animation: "slideDown 0.2s ease-out",
          })}
        >
          {/* Search Input */}
          <div
            className={css({
              padding: "6px 10px",
              borderBottom: "1px solid",
              borderColor: "gray.100",
            })}
          >
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search options..."
              className={css({
                width: "100%",
                padding: "4px 8px",
                border: "1px solid",
                borderColor: "gray.200",
                borderRadius: "4px",
                fontSize: "12px",
                outline: "none",
                _focus: {
                  borderColor: "blue.500",
                  boxShadow: "0 0 0 1px rgba(59, 130, 246, 0.1)",
                },
              })}
            />
          </div>

          {/* Options List */}
          <div
            className={css({
              maxHeight: "140px",
              overflowY: "auto",
              scrollbarWidth: "thin",
              scrollbarColor: "gray.300 transparent",
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-track": {
                background: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "gray.300",
                borderRadius: "3px",
              },
            })}
          >
            {filteredOptions.length === 0 ? (
              <div
                className={css({
                  padding: "8px",
                  textAlign: "center",
                  color: "gray.500",
                  fontSize: "12px",
                })}
              >
                No options found
              </div>
            ) : (
              filteredOptions.map((option, index) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleOptionClick(option.value)}
                  className={css({
                    width: "100%",
                    padding: "7px 10px",
                    textAlign: "left",
                    backgroundColor:
                      index === focusedIndex ? "blue.50" : "transparent",
                    color: option.value === value ? "blue.600" : "gray.900",
                    fontWeight: option.value === value ? "600" : "400",
                    cursor: "pointer",
                    border: "none",
                    fontSize: "12px",
                    transition: "background-color 0.15s ease",
                    _hover: {
                      backgroundColor: "gray.50",
                    },
                    _focus: {
                      outline: "none",
                      backgroundColor: "blue.50",
                    },
                  })}
                  role="option"
                  aria-selected={option.value === value}
                >
                  {option.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
