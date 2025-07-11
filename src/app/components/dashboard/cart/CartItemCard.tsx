"use client";

import { useState } from "react";
import { css } from "../../../../../styled-system/css";
import Image from "next/image";
import CustomSelect from "../../ui/CustomSelect";

/**
 * Props for CartItemCard
 */
type CartItemCardProps = {
  item: any;
  inventory: { state: string; quantity: string };
  atMaxQty: boolean;
  selectedDiscount: any;
  selectedTax: any;
  discounts: any[];
  taxes: any[];
  onQtyChange: (qty: number) => void;
  onRemove: () => void;
  onDiscountToggle: (checked: boolean) => void;
  onDiscountSelect: (discount: any) => void;
  onTaxToggle: (checked: boolean) => void;
  onTaxSelect: (value: string) => void;
};

export default function CartItemCard({
  item,
  inventory,
  atMaxQty,
  selectedDiscount,
  selectedTax,
  discounts,
  taxes,
  onQtyChange,
  onRemove,
  onDiscountToggle,
  onDiscountSelect,
  onTaxToggle,
  onTaxSelect,
}: CartItemCardProps) {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: "2",
        bg: "white",
        boxShadow: "sm",
        borderRadius: "lg",
        p: "4",
        mb: "4",
      })}
    >
      <div
        className={css({
          display: "flex",
          alignItems: "center",
          gap: "4",
        })}
      >
        <Image
          src={item.imageUrl}
          alt={item.name}
          width={48}
          height={48}
          className={css({ borderRadius: "md" })}
        />
        <div className={css({ flex: 1 })}>
          <div className={css({ fontWeight: "semibold", fontSize: "sm" })}>
            {item.name}
          </div>
          <div className={css({ color: "gray.600", fontSize: "xs" })}>
            ${item.price ? (item.price / 100).toFixed(2) : "N/A"}
          </div>
          <div className={css({ color: "gray.400", fontSize: "xs" })}>
            {inventory?.state ?? "Unknown"} | Qty in stock:{" "}
            {inventory?.quantity ?? "-"}
          </div>
        </div>
        <button
          className={css({
            color: "red.500",
            fontSize: "lg",
            ml: "2",
            bg: "none",
            border: "none",
            cursor: "pointer",
          })}
          onClick={onRemove}
          aria-label="Remove item"
        >
          &times;
        </button>
      </div>
      <div
        className={css({
          display: "flex",
          alignItems: "center",
          gap: "2",
          mt: "2",
        })}
      >
        <button
          className={css({
            px: "2",
            py: "0.5",
            bg: "gray.200",
            borderRadius: "md",
            fontWeight: "400",
            fontSize: "sm",
            cursor: "pointer",
          })}
          onClick={() => onQtyChange(item.quantity - 1)}
          disabled={item.quantity <= 1}
        >
          -
        </button>
        <span className={css({ px: "2", fontWeight: "400" })}>
          {item.quantity}
        </span>
        <button
          className={css({
            px: "2",
            py: "0.5",
            bg: atMaxQty ? "gray.100" : "gray.200",
            borderRadius: "md",
            color: atMaxQty ? "gray.400" : undefined,
            cursor: atMaxQty ? "not-allowed" : "pointer",
            fontWeight: "400",
            fontSize: "sm",
          })}
          onClick={() => onQtyChange(item.quantity + 1)}
          disabled={atMaxQty}
        >
          +
        </button>
        <button
          className={css({
            ml: "auto",
            fontSize: "xs",
            color: "blue.500",
            bg: "none",
            border: "none",
            cursor: "pointer",
            textDecoration: "underline",
          })}
          onClick={() => setShowOptions((v) => !v)}
        >
          {showOptions ? "Hide options" : "More options"}
        </button>
      </div>
      {showOptions && (
        <div
          className={css({
            mt: "3",
            display: "flex",
            flexDirection: "column",
            gap: "2",
            bg: "gray.50",
            borderRadius: "md",
            p: "3",
          })}
        >
          {/* Tax */}
          {taxes.length > 0 && (
            <div
              className={css({
                display: "flex",
                alignItems: "center",
                gap: "2",
              })}
            >
              <label
                className={css({
                  fontSize: "xs",
                  display: "flex",
                  alignItems: "center",
                  gap: "1",
                })}
              >
                <input
                  className={css({ mr: "1" })}
                  type="checkbox"
                  checked={!!item.is_taxable && item.itemTaxRate !== undefined}
                  onChange={(e) => onTaxToggle(e.target.checked)}
                />
                Apply Tax
              </label>
              <CustomSelect
                value={item.itemTaxRate?.toString() ?? ""}
                onChange={onTaxSelect}
                options={[
                  { value: "", label: "Select Tax" },
                  ...taxes.map((tax) => ({
                    value: tax.percentage?.toString() ?? "",
                    label: `${tax.name} (${tax.percentage}%)`,
                  })),
                ]}
                placeholder="Select Tax"
                size="sm"
                className={css({ minW: "32" })}
              />
            </div>
          )}
          {/* Discount */}
          {discounts.length > 0 && (
            <div
              className={css({
                display: "flex",
                alignItems: "center",
                gap: "2",
              })}
            >
              <label
                className={css({
                  fontSize: "xs",
                  display: "flex",
                  alignItems: "center",
                  gap: "1",
                })}
              >
                <input
                  className={css({ mr: "1" })}
                  type="checkbox"
                  checked={!!item.itemDiscount}
                  onChange={(e) => onDiscountToggle(e.target.checked)}
                />
                Apply Discount
              </label>
              <CustomSelect
                value={selectedDiscount?.discount_name || ""}
                onChange={(value) => {
                  const discount = discounts.find(
                    (d) => d.discount_name === value
                  );
                  onDiscountSelect(discount);
                }}
                options={[
                  { value: "", label: "Select Discount" },
                  ...discounts.map((discount) => ({
                    value: discount.discount_name,
                    label: `${discount.discount_name}`,
                  })),
                ]}
                placeholder="Select Discount"
                size="sm"
                className={css({ minW: "32" })}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
