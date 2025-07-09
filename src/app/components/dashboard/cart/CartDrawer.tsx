"use client";

import { MdOutlineAddShoppingCart } from "react-icons/md";
import { useContext, useState } from "react";
import { CartContext, TaxRate } from "../../../context/CartContext";
import { css, cx } from "../../../../../styled-system/css";
import Image from "next/image";
import { OrderConfirmation } from "../order/OrderConfirmation";


type CartDrawerProps = {
  accessToken?: string;
  cartInventoryInfo: Record<string, { state: string; quantity: string }>;
  taxes_data: TaxRate[];
  itemVariationIds: string[];
};

type SelectedTax = {
  itemTaxRate?: number;
  enabled?: boolean;
};

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

  const [showAddedMessage, setShowAddedMessage] = useState(false);

  const items = Object.values(cart); // * returns an array of all items in cart at the moment
  const orderSummary = getOrderSummary();

  // * utility functions for cart

  // * handle discount toggle
  const handleDiscountToggle = (item: any, checked: boolean) => {
    if (checked && selectedDiscounts[item.id]) {
      applyItemDiscount(item.id, selectedDiscounts[item.id]);
    } else {
      removeItemDiscount(item.id);
    }
  };

  // * handle discount select
  const handleDiscountSelect = (item: any, discount: any) => {
    setSelectedDiscounts((prev) => ({
      ...prev,
      [item.id]: discount,
    }));
    // If already checked, apply immediately
    if (discount && item.itemDiscount) {
      applyItemDiscount(item.id, discount);
    }
  };

  // * handle tax toggle
  const handleTaxToggle = (item: any, checked: boolean) => {
    toggleItemTax(item.id, checked);
  };

  // * handle tax select
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
        })}
        onClick={() => setOpen(true)}
      >
        Cart ({items.length}){/* <MdOutlineAddShoppingCart /> */}
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
                {items.map((item) => {
                  const inventory = cartInventoryInfo[item.id];
                  const state = inventory?.state ?? "Unknown";
                  const quantity = inventory?.quantity ?? "-";
                  // * get the disconts and taxes for each item
                  const discounts = item.discounts || [];
                  const taxes = item.taxes || [];

                  //* inventory management
                  const inventoryQty =
                    typeof quantity === "string"
                      ? parseInt(quantity, 10)
                      : quantity ?? 0;
                  const atMaxQty = item.quantity >= inventoryQty;

                  return (
                    <div
                      className={css({
                        py: "2",
                        px: "3",
                        bg: "gray.50",
                        borderRadius: "md",
                        mb: "4",
                      })}
                    >
                      <div
                        key={item.id}
                        className={css({
                          display: "flex",
                          alignItems: "center",
                          mb: "2",
                        })}
                      >
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          width={48}
                          height={48}
                          className={css({ borderRadius: "md", mr: "3" })}
                        />
                        <div className={css({ flex: 1 })}>
                          <div
                            className={css({
                              fontSize: "sm",
                              fontWeight: "medium",
                            })}
                          >
                            {item.name}
                          </div>
                          <div
                            className={css({
                              color: "gray.600",
                              fontSize: "xs",
                            })}
                          >
                            $
                            {item.price ? (item.price / 100).toFixed(2) : "N/A"}
                          </div>
                        </div>
                        <div
                          className={css({
                            display: "flex",
                            alignItems: "center",
                            gap: "1",
                          })}
                        >
                          <button
                            className={css({
                              px: "2",
                              py: "1",
                              bg: "gray.200",
                              borderRadius: "md",
                            })}
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className={css({ px: "2" })}>
                            {item.quantity}
                          </span>
                          <button
                            className={css({
                              px: "2",
                              py: "1",
                              bg: atMaxQty ? "gray.100" : "gray.200",
                              borderRadius: "md",
                              color: atMaxQty ? "gray.400" : undefined,
                              cursor: atMaxQty ? "not-allowed" : undefined,
                            })}
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            disabled={atMaxQty}
                          >
                            +
                          </button>
                          <button
                            className={css({
                              ml: "2",
                              color: "red.500",
                              fontSize: "sm",
                            })}
                            onClick={() => removeFromCart(item.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      {/* Item-level tax toggle */}
                      {taxes.length > 0 && (
                        <div
                          className={css({
                            display: "flex",
                            alignItems: "center",
                            gap: "2",
                            mb: "4",
                            mt: "4",
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
                              checked={
                                !!item.is_taxable &&
                                item.itemTaxRate !== undefined
                              }
                              disabled={!selectedTaxes[item.id]}
                              onChange={(e) =>
                                handleTaxToggle(item, e.target.checked)
                              }
                            />
                            Apply Tax
                          </label>
                          <select
                            value={item.itemTaxRate ?? ""}
                            onChange={(e) =>
                              handleTaxSelect(item, e.target.value)
                            }
                            className={css({
                              fontSize: "xs",
                              px: "2",
                              py: "1",
                              border: "1px solid",
                              borderColor: "gray.300",
                              borderRadius: "md",
                            })}
                          >
                            <option value="">Select Tax</option>
                            {taxes.map((tax, idx) => (
                              <option
                                key={idx}
                                value={
                                  tax.percentage !== null
                                    ? Number(tax.percentage)
                                    : ""
                                }
                              >
                                {tax.name} ({tax.percentage}%)
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* Item level discount display */}
                      {discounts.length > 0 && (
                        <div
                          className={css({
                            display: "flex",
                            alignItems: "center",
                            gap: "2",
                            mb: "4",
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
                              disabled={!selectedDiscounts[item.id]}
                              onChange={(e) =>
                                handleDiscountToggle(item, e.target.checked)
                              }
                            />
                            Apply Discount
                          </label>
                          <select
                            value={
                              selectedDiscounts[item.id]?.discount_name || ""
                            }
                            onChange={(e) => {
                              const discount = discounts.find(
                                (d) => d.discount_name === e.target.value
                              );
                              handleDiscountSelect(item, discount);
                            }}
                            className={css({
                              fontSize: "xs",
                              px: "2",
                              py: "1",
                              border: "1px solid",
                              borderColor: "gray.300",
                              borderRadius: "md",
                            })}
                          >
                            <option value="">Select Discount</option>
                            {discounts.map((discount, idx) => (
                              <option key={idx} value={discount.discount_name}>
                                {discount.discount_name} (
                                {discount.discount_value})
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <div
              className={css({
                mt: "auto",
                pt: "4",
                borderTop: "1px solid",
                borderColor: "gray.200",
              })}
            >
              <div
                className={css({ fontWeight: "bold", fontSize: "lg", mb: "2" })}
              >
                Total: ${(orderSummary.total / 100).toFixed(2)}
              </div>
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
          // TODO: take to the page where order is placed and all the orders api response is shown
          // this is temporary, add order summary here
          <OrderConfirmation
            items={items}
            accessToken={accessToken || ""}
            onClose={() => {
              setShowCheckout(false);
              setOpen(false);
              clearCart();
            }}
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
