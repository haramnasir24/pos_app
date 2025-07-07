"use client";

import { MdOutlineAddShoppingCart } from "react-icons/md";
import { useContext, useState, useEffect } from "react";
import { CartContext, Discount, TaxRate } from "../../context/CartContext";
import { css, cx } from "../../../../styled-system/css";
import Image from "next/image";
import {
  handleCheckoutUtil,
  handleItemTaxToggleUtil,
} from "../../utils/cartDrawerUtils";
import { OrderConfirmation } from "./OrderConfirmation";

type CartDrawerProps = {
  accessToken: string;
  cartInventoryInfo: Record<string, { state: string; quantity: string }>;
  taxes_data: TaxRate[];
  discounts: Discount[];
};

export default function CartDrawer({
  cartInventoryInfo,
  taxes_data,
  discounts,
}: CartDrawerProps) {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    toggleItemTax,
    setItemTaxRate,
    getOrderSummary,
    clearCart,
  } = useContext(CartContext);

  const [open, setOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [availableDiscounts, setAvailableDiscounts] =
    useState<Discount[]>(discounts);
  const [availableTaxRates, setAvailableTaxRates] =
    useState<TaxRate[]>(taxes_data);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  // * returns an array of all items in cart at the moment
  const items = Object.values(cart);
  const orderSummary = getOrderSummary();

  const subtotal = orderSummary.subtotal;

  console.log(discounts);

  // * utility functions
  // const handleCheckout = () =>
  //   handleCheckoutUtil({
  //     items,
  //     orderSummary,
  //     clearCart,
  //     setOrderSuccess,
  //     setShowCheckout,
  //     setOrderError,
  //     setOpen,
  //     setIsProcessing,
  //   });

  // * toggles the tax for each item
  const handleItemTaxToggle = (itemId: string, is_taxable: boolean) =>
    handleItemTaxToggleUtil({
      itemId,
      is_taxable,
      toggleItemTax,
    });

  // * show order confirmation
  if (orderSuccess) {
    <OrderConfirmation />;
  }

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
            setOrderError(null);
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

                  //* inventory management
                  const inventoryQty =
                    typeof quantity === "string"
                      ? parseInt(quantity, 10)
                      : quantity ?? 0;
                  const atMaxQty = item.quantity >= inventoryQty;

                  return (
                    <div>
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
                            fontSize: "sm",
                            display: "flex",
                            alignItems: "center",
                            gap: "1",
                          })}
                        >
                          <input
                            type="checkbox"
                            checked={item.is_taxable ?? false}
                            onChange={(e) =>
                              handleItemTaxToggle(item.id, e.target.checked)
                            }
                            className={css({ mr: "1" })}
                          />
                          Apply Tax
                        </label>

                        <select
                          value={item.itemTaxRate || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "") {
                              return;
                            }
                            setItemTaxRate(item.id, parseFloat(value));
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
                          {taxes_data.map((tax: TaxRate) => (
                            <option key={tax.id} value={tax.percentage}>
                              {tax.name} ({tax.percentage}%)
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Item level discount display */}

                      <div
                        className={css({
                          display: "flex",
                          alignItems: "center",
                          mt: "4",
                          gap: "2",
                          mb: "2",
                        })}
                      >
                        <label
                          className={css({
                            fontSize: "sm",
                            display: "flex",
                            alignItems: "center",
                            gap: "1",
                          })}
                        >
                          <input className={css({ mr: "1" })} type="checkbox" />
                          Discounts
                        </label>
                        {item.category === "furniture" &&
                          (() => {
                            const furnitureDiscounts = discounts.filter(
                              (discount: Discount) =>
                                discount.name === "20% Off Furniture"
                            );
                            return (
                              <select
                                value={item.itemDiscountId || ""}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (value === "") {
                                    return;
                                  }
                                  // handle selection
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
                                {furnitureDiscounts.map(
                                  (discount: Discount) => (
                                    <option
                                      key={discount.id}
                                      value={discount.id}
                                    >
                                      {discount.name}
                                    </option>
                                  )
                                )}
                              </select>
                            );
                          })()}
                      </div>
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
          // this is temporaray, add checkout view here
          <OrderConfirmation />
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
