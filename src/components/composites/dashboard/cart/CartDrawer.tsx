"use client";

import { MdOutlineAddShoppingCart } from "react-icons/md";
import { useContext, useState } from "react";
import { CartContext, TaxRate } from "../../../../shared/context/CartContext";
import { OrderSummary } from "../order/OrderSummary";

import CartItemCard from "./CartItemCard";
import { css, cx } from "~/styled-system/css";
import CustomSelect from "@/components/primitives/CustomSelect";
import {
  ORDER_LEVEL_DISCOUNTS,
  ORDER_LEVEL_TAXES,
} from "@/shared/constants/order_discounts_taxes";

/**
 * Props for the CartDrawer component.
 * @property {string} [accessToken] - Optional access token for API calls.
 * @property {Record<string, { state: string; quantity: string }>} cartInventoryInfo - Inventory info for cart items.
 * @property {TaxRate[]} taxes_data - List of available tax rates.
 * @property {string[]} itemVariationIds - List of item variation IDs.
 */
type CartDrawerProps = {
  accessToken?: string;
  cartInventoryInfo: Record<string, { state: string; quantity: string }>;
  itemVariationIds: string[];
};

/**
 * Represents the selected tax state for an item.
 * @property {number} [itemTaxRate] - Selected tax rate for the item.
 * @property {boolean} [enabled] - Whether tax is enabled for the item.
 */
type SelectedTax = {
  itemTaxRate?: number;
  enabled?: boolean;
};

/**
 * Drawer component for displaying and managing the shopping cart.
 * Handles item-level and order-level discounts/taxes, inventory, and checkout.
 */
export default function CartDrawer({
  accessToken,
  cartInventoryInfo,
}: CartDrawerProps) {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    toggleItemTax,
    getOrderSummary,
    clearCart,
    applyItemDiscount,
    removeItemDiscount,
    setItemTaxRate,
  } = useContext(CartContext);

  const items = Object.values(cart); // * returns an array of all items present in cart at the moment

  const [open, setOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  // * store selected discount per item
  const [selectedDiscounts, setSelectedDiscounts] = useState<
    Record<string, any>
  >({});

  // * store selected taxes per item
  const [selectedTaxes, setSelectedTaxes] = useState<
    Record<string, SelectedTax>
  >({});

  // * store selected order-level discount/tax
  const [selectedOrderDiscount, setSelectedOrderDiscount] = useState<any>(null);
  const [selectedOrderTax, setSelectedOrderTax] = useState<any>(null);

  // * exclusivity logic: if order-level is selected, disable item-level, and vice versa
  const isOrderLevelActive = !!selectedOrderDiscount || !!selectedOrderTax;
  const isItemLevelActive = items.some(
    (item) =>
      item.itemDiscount || (item.is_taxable && item.itemTaxRate !== undefined)
  );

  /**
   * Handles switching between order-level and item-level discounts/taxes.
   * Clears item-level discounts/taxes when order-level is selected.
   * @param {"discount"|"tax"} type - Type of order-level change.
   * @param {any} value - Selected discount or tax value.
   */
  const handleOrderLevelChange = (type: "discount" | "tax", value: any) => {
    if (type === "discount") {
      setSelectedOrderDiscount(value);
    } else {
      setSelectedOrderTax(value);
    }
    // clear all item-level discounts/taxes
    items.forEach((item) => {
      removeItemDiscount(item.id);
      toggleItemTax(item.id, false);
      // Only call setItemTaxRate if item.itemTaxRate is a number
      if (typeof item.itemTaxRate === "number") {
        setItemTaxRate(item.id, 0); // set to 0 to clear
      }
    });
  };

  /**
   * Clears order-level discount/tax if any item-level discount/tax is selected.
   */
  const handleItemLevelChange = () => {
    setSelectedOrderDiscount(null);
    setSelectedOrderTax(null);
  };

  /**
   * Calculates the order summary for the drawer, considering order-level discounts/taxes if selected.
   */
  const getDrawerOrderSummary = () => {
    if (isOrderLevelActive) {
      // Uniformly distribute order-level discount/tax
      let subtotal = items.reduce(
        (sum, item) => sum + (item.price ?? 0) * item.quantity,
        0
      );
      let discountAmount = 0;
      let taxAmount = 0;
      if (selectedOrderDiscount) {
        const percent = parseFloat(selectedOrderDiscount.percentage);
        if (!isNaN(percent)) {
          discountAmount = (subtotal * percent) / 100;
        }
      }
      const discountedSubtotal = subtotal - discountAmount;
      if (selectedOrderTax) {
        const percent = parseFloat(selectedOrderTax.percentage);
        if (!isNaN(percent)) {
          taxAmount = (discountedSubtotal * percent) / 100;
        }
      }
      const total = discountedSubtotal + taxAmount;
      return { subtotal, discountAmount, taxAmount, total };
    } else {
      // fallback to context's item-level summary
      return getOrderSummary();
    }
  };

  const drawerOrderSummary = getDrawerOrderSummary();

  /**
   * Handles toggling of item-level discounts.
   * @param {any} item - The cart item.
   * @param {boolean} checked - Whether the discount is applied.
   */
  const handleDiscountToggle = (item: any, checked: boolean) => {
    handleItemLevelChange();
    if (checked && selectedDiscounts[item.id]) {
      applyItemDiscount(item.id, selectedDiscounts[item.id]);
    } else {
      removeItemDiscount(item.id);
    }
  };

  /**
   * Handles selection of a discount for an item.
   * @param {any} item - The cart item.
   * @param {any} discount - The selected discount.
   */
  const handleDiscountSelect = (item: any, discount: any) => {
    setSelectedDiscounts((prev) => ({
      ...prev,
      [item.id]: discount,
    }));
  };

  /**
   * Handles toggling of item-level taxes.
   * @param {any} item - The cart item.
   * @param {boolean} checked - Whether the tax is applied.
   */
  const handleTaxToggle = (item: any, checked: boolean) => {
    handleItemLevelChange();
    toggleItemTax(item.id, checked);
  };

  /**
   * Handles selection of a tax rate for an item.
   * @param {any} item - The cart item.
   * @param {string} value - The selected tax rate value.
   */
  const handleTaxSelect = (item: any, value: string) => {
    const taxRate = value === "" ? undefined : parseFloat(value);
    setSelectedTaxes((prev) => ({
      ...prev,
      [item.id]: {
        ...prev[item.id],
        itemTaxRate: taxRate,
      },
    }));
    if (typeof taxRate === "number") {
      setItemTaxRate(item.id, taxRate);
    }
  };

  return (
    <>
      <button
        className={css({
          position: "fixed",
          top: "3",
          right: "6",
          zIndex: 50,
          bg: "blue.600",
          color: "white",
          px: "4",
          py: "2",
          borderRadius: "md",
          fontWeight: "bold",
          _hover: { bg: "blue.700" },
          display: "flex",
          alignItems: "center",
          gap: "2",
        })}
        onClick={() => setOpen(true)}
        aria-label={`Open cart with ${items.length} items`}
      >
        <MdOutlineAddShoppingCart size={22} />
        <span>({items.length})</span>
      </button>
      <div
        className={cx(
          css({
            position: "fixed",
            top: 0,
            right: 0,
            height: "100vh",
            width: "96",
            bg: "white",
            boxShadow: "lg",
            zIndex: 100,
            transform: open ? "translateX(0)" : "translateX(100%)",
            transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            display: "flex",
            flexDirection: "column",
            p: "6",
          })
        )}
        style={{ transform: open ? "translateX(0)" : "translateX(100%)" }}
      >
        <button
          className={css({
            alignSelf: "flex-end",
            mb: "4",
            color: "gray.600",
            fontSize: "xl",
            cursor: "pointer",
          })}
          onClick={() => {
            setOpen(false);
            setShowCheckout(false);
          }}
        >
          &times;
        </button>

        {!showCheckout ? (
          <>
            <h2
              className={css({ fontSize: "2xl", fontWeight: "bold", mb: "4" })}
            >
              Shopping Cart
            </h2>
            {items.length === 0 ? (
              <p className={css({ color: "gray.500" })}>Your cart is empty.</p>
            ) : (
              <div className={css({ flex: 1, overflowY: "auto" })}>
                {items.map((item, idx) => {
                  const inventory = cartInventoryInfo[item.id];
                  const state = inventory?.state ?? "Unknown";
                  const quantity = inventory?.quantity ?? "-";
                  const discounts = item.discounts || [];
                  const taxes = item.taxes || [];
                  const inventoryQty =
                    typeof quantity === "string"
                      ? parseInt(quantity, 10)
                      : quantity ?? 0;
                  const atMaxQty = item.quantity >= inventoryQty;
                  return (
                    <CartItemCard
                      key={item.id}
                      item={item}
                      inventory={inventory}
                      atMaxQty={atMaxQty}
                      selectedDiscount={selectedDiscounts[item.id]}
                      selectedTax={selectedTaxes[item.id]}
                      discounts={discounts}
                      taxes={taxes}
                      onQtyChange={(qty) => updateQuantity(item.id, qty)}
                      onRemove={() => removeFromCart(item.id)}
                      onDiscountToggle={(checked) =>
                        handleDiscountToggle(item, checked)
                      }
                      onDiscountSelect={(discount) =>
                        handleDiscountSelect(item, discount)
                      }
                      onTaxToggle={(checked) => handleTaxToggle(item, checked)}
                      onTaxSelect={(value) => handleTaxSelect(item, value)}
                    />
                  );
                })}
              </div>
            )}

            <div
              className={css({
                mt: "auto",
                pt: "4",
                borderTop: "none",
                display: "flex",
                flexDirection: "column",
                gap: "2",
              })}
            >
              <div
                className={css({
                  bg: "white",
                  boxShadow: "sm",
                  borderRadius: "lg",
                  p: "4",
                  mb: "2",
                  display: "flex",
                  flexDirection: "column",
                  gap: "2",
                })}
              >
                {/* Order-level discount/tax controls */}
                <label
                  className={css({
                    fontSize: "sm",
                    fontWeight: "bold",
                    mr: "2",
                  })}
                >
                  Order Discount:
                </label>
                <CustomSelect
                  value={selectedOrderDiscount?.name || ""}
                  onChange={(value) => {
                    const discount =
                      ORDER_LEVEL_DISCOUNTS.find((d) => d.name === value) ||
                      null;
                    handleOrderLevelChange("discount", discount);
                  }}
                  disabled={isItemLevelActive}
                  options={[
                    { value: "", label: "Select Discount" },
                    ...ORDER_LEVEL_DISCOUNTS.map((discount) => ({
                      value: discount.name,
                      label: `${discount.name} (${discount.percentage}%)`,
                    })),
                  ]}
                  placeholder="Select Discount"
                  size="sm"
                  className={css({ mr: "2" })}
                />
                <label
                  className={css({
                    fontSize: "sm",
                    fontWeight: "bold",
                    mr: "2",
                  })}
                >
                  Order Tax:
                </label>
                <CustomSelect
                  value={selectedOrderTax?.name || ""}
                  onChange={(value) => {
                    const tax =
                      ORDER_LEVEL_TAXES.find((t) => t.name === value) || null;
                    handleOrderLevelChange("tax", tax);
                  }}
                  disabled={isItemLevelActive}
                  options={[
                    { value: "", label: "Select Tax" },
                    ...ORDER_LEVEL_TAXES.map((tax) => ({
                      value: tax.name,
                      label: `${tax.name} (${tax.percentage}%)`,
                    })),
                  ]}
                  placeholder="Select Tax"
                  size="sm"
                />
                {isItemLevelActive && (
                  <span
                    className={css({
                      color: "red.500",
                      fontSize: "xs",
                      ml: "2",
                    })}
                  >
                    (Disable item-level discounts/taxes to use order-level)
                  </span>
                )}
                {/* Show order-level discount/tax if active */}
                {isOrderLevelActive && (
                  <div
                    className={css({
                      fontSize: "xs",
                      color: "gray.700",
                      mb: "1",
                    })}
                  >
                    {selectedOrderDiscount && (
                      <div>
                        <b>Order Discount:</b> {selectedOrderDiscount.name} (-
                        {selectedOrderDiscount.percentage}%)
                      </div>
                    )}
                    {selectedOrderTax && (
                      <div>
                        <b>Order Tax:</b> {selectedOrderTax.name} (+
                        {selectedOrderTax.percentage}%)
                      </div>
                    )}
                  </div>
                )}
                <div
                  className={css({
                    fontWeight: "bold",
                    fontSize: "lg",
                    mb: "1",
                  })}
                >
                  Total: ${(drawerOrderSummary.total / 100).toFixed(2)}
                </div>
              </div>
              <button
                className={css({
                  w: "full",
                  bg: "gray.200",
                  color: "black",
                  py: "2",
                  borderRadius: "md",
                  fontWeight: "semibold",
                  fontSize: "sm",
                  _hover: { bg: "gray.300" },
                })}
                disabled={items.length === 0}
                onClick={() => {
                  clearCart();
                  setShowCheckout(false);
                }}
              >
                Clear Cart
              </button>
              <button
                className={css({
                  w: "full",
                  bg: "green.600",
                  color: "white",
                  py: "3",
                  borderRadius: "md",
                  fontWeight: "bold",
                  fontSize: "md",
                  _hover: { bg: "green.700" },
                })}
                disabled={items.length === 0}
                onClick={() => setShowCheckout(true)}
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        ) : (
          <OrderSummary
            items={items}
            accessToken={accessToken || ""}
            onGoBack={() => setShowCheckout(false)}
            clearCart={clearCart}
            setShowCheckout={setShowCheckout}
            setOpen={setOpen}
          />
        )}
      </div>

      {open && (
        // * creates the background overlay
        <div
          className={css({
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.2)",
            zIndex: 99,
          })}
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
