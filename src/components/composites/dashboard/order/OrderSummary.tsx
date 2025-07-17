import { calculateOrderData } from "@/shared/utils/cart/cartDrawerUtils";
import { useEffect, useState } from "react";
import { css } from "~/styled-system/css/css.mjs";
import { OrderConfirmation } from "./OrderConfirmation";
import {
  ORDER_LEVEL_DISCOUNTS,
  ORDER_LEVEL_TAXES,
} from "@/shared/constants/order_discounts_taxes";

/**
 * Props for the OrderSummary component.
 * @property items - Array of cart items to summarize
 * @property accessToken - Auth token for API requests
 * @property onGoBack - Callback to return to previous view
 * @property clearCart - Callback to clear the cart after order
 * @property setShowCheckout - Controls checkout modal visibility
 * @property setOpen - Controls drawer open/close state
 */
type OrderSummaryProps = {
  items: any[];
  accessToken: string;
  onGoBack: () => void;
  clearCart: () => void;
  setShowCheckout: (open: boolean) => void;
  setOpen: (open: boolean) => void;
};

/**
 * Displays a summary of the current order, including items, discounts, taxes, and totals.
 * Handles order calculation, error/loading states, and order confirmation.
 */
export const OrderSummary = ({
  items,
  accessToken,
  onGoBack,
  clearCart,
  setShowCheckout,
  setOpen,
}: OrderSummaryProps) => {
  const [orderPreview, setOrderPreview] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  /**
   * Shows the order confirmation dialog.
   */
  const handlePlaceOrder = () => {
    setShowConfirmation(true);
  };

  useEffect(() => {
    /**
     * Calculates the order preview by calling the backend API.
     * Handles loading and error states.
     */
    const calculateOrder = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // * calculate order
        const orderData = calculateOrderData({
          items,
          orderDiscounts: ORDER_LEVEL_DISCOUNTS,
          orderTaxes: ORDER_LEVEL_TAXES,
        });

        // * make API call to square orders api to calculate order
        const response = await fetch("/api/orders/calculate-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderData,
            accessToken,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to create order");
        }

        const result = await response.json();
        setOrderPreview(result);
      } catch (err) {
        console.error("Error creating order:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    calculateOrder();
  }, [items, accessToken]);

  // * retrieving order data from the orders api response
  console.log(orderPreview);

  /**
   * Formats a cent value as a dollar string.
   * @param amount - Amount in cents
   * @returns Formatted string in dollars
   */
  const formatMoney = (amount: number | undefined) =>
    typeof amount === "number" ? `$${(amount / 100).toFixed(2)}` : "N/A";

  /**
   * Gets the tax name by UID from the order preview.
   * @param uid - Tax UID
   * @returns Tax name or fallback
   */
  const getTaxName = (uid: string) =>
    orderPreview?.order?.taxes?.find((t: any) => t.uid === uid)?.name || "Tax";
  /**
   * Gets the discount name by UID from the order preview.
   * @param uid - Discount UID
   * @returns Discount name or fallback
   */
  const getDiscountName = (uid: string) =>
    orderPreview?.order?.discounts?.find((d: any) => d.uid === uid)?.name ||
    "Discount";

  if (isLoading) {
    // * Loading state UI
    return (
      <div
        className={css({
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bg: "white",
          p: "8",
          borderRadius: "lg",
          boxShadow: "xl",
          zIndex: 200,
          textAlign: "center",
        })}
      >
        <div className={css({ color: "blue.600", fontSize: "2xl", mb: "4" })}>
          ⏳
        </div>
        <h2 className={css({ fontSize: "xl", fontWeight: "bold", mb: "2" })}>
          Calculating Order...
        </h2>
        <p className={css({ color: "gray.600" })}>
          Please wait while we prepare your order summary
        </p>
      </div>
    );
  }

  if (error) {
    // * Error state UI
    return (
      <div
        className={css({
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bg: "white",
          p: "8",
          borderRadius: "lg",
          boxShadow: "xl",
          zIndex: 200,
          textAlign: "center",
        })}
      >
        <div className={css({ color: "red.600", fontSize: "2xl", mb: "4" })}>
          ✗
        </div>
        <h2 className={css({ fontSize: "xl", fontWeight: "bold", mb: "2" })}>
          Order Failed
        </h2>
        <p className={css({ color: "gray.600", mb: "4" })}>{error}</p>
      </div>
    );
  }

  if (showConfirmation) {
    // * Show order confirmation dialog
    return (
      <OrderConfirmation
        items={items}
        accessToken={accessToken}
        orderDiscounts={ORDER_LEVEL_DISCOUNTS}
        orderTaxes={ORDER_LEVEL_TAXES}
        onClose={() => {
          clearCart();
          setShowCheckout(false);
          setOpen(false); // <-- close the drawer
        }}
      />
    );
  }

  return (
    !isLoading && (
      <div
        className={css({
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bg: "white",
          p: "8",
          borderRadius: "lg",
          boxShadow: "xl",
          zIndex: 200,
          textAlign: "center",
          maxW: "2xl",
          maxH: "90vh",
          overflowY: "auto",
          minWidth: "350px",
          mt: "2",
        })}
      >
        <button
          onClick={onGoBack}
          className={css({
            position: "absolute",
            top: "4",
            left: "4",
            bg: "gray.200",
            color: "gray.800",
            borderRadius: "md",
            px: "3",
            py: "1",
            fontWeight: "semibold",
            _hover: { bg: "gray.300" },
            mb: "6",
          })}
        >
          ← Go Back
        </button>
        {/* Order Summary */}
        <div className={css({ textAlign: "left", mb: "6", mt: "6" })}>
          <h3
            className={css({
              fontSize: "lg",
              fontWeight: "bold",
              mb: "6",
              mt: "8",
              color: "gray.800",
              letterSpacing: "tight",
            })}
          >
            Order Summary
          </h3>

          {/* Items List with old/new values, applied discounts/taxes */}
          <div className={css({ mb: "4" })}>
            <h4
              className={css({
                fontSize: "md",
                fontWeight: "semibold",
                mb: "2",
                color: "gray.700",
              })}
            >
              Items ({orderPreview?.order?.line_items?.length || 0})
            </h4>
            <div className={css({ spaceY: "2" })}>
              {orderPreview?.order?.line_items?.map(
                (item: any, index: number) => (
                  <div
                    key={index}
                    className={css({
                      display: "flex",
                      flexDirection: "column",
                      py: "2",
                      px: "3",
                      bg: "gray.50",
                      borderRadius: "md",
                      mb: "2",
                    })}
                  >
                    <div
                      className={css({ fontWeight: "medium", fontSize: "sm" })}
                    >
                      {item.name}
                    </div>
                    <div className={css({ color: "gray.600", fontSize: "xs" })}>
                      Qty: {item.quantity} ×{" "}
                      {formatMoney(item.base_price_money?.amount)}
                    </div>
                    {/* Old value (before discounts/taxes) */}
                    <div className={css({ color: "gray.500", fontSize: "xs" })}>
                      <b>Original:</b>{" "}
                      {formatMoney(item.gross_sales_money?.amount)}
                    </div>
                    {/* Applied Discounts */}
                    {item.applied_discounts?.length > 0 && (
                      <div
                        className={css({ color: "green.600", fontSize: "xs" })}
                      >
                        <b>Discounts:</b>
                        <ul style={{ margin: 0, paddingLeft: 16 }}>
                          {item.applied_discounts.map((d: any) => (
                            <li key={d.uid}>
                              {getDiscountName(d.discount_uid)}: -
                              {formatMoney(d.applied_money?.amount)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {/* Applied Taxes */}
                    {item.applied_taxes?.length > 0 && (
                      <div
                        className={css({ color: "blue.600", fontSize: "xs" })}
                      >
                        <b>Taxes:</b>
                        <ul style={{ margin: 0, paddingLeft: 16 }}>
                          {item.applied_taxes.map((t: any) => (
                            <li key={t.uid}>
                              {getTaxName(t.tax_uid)}: +
                              {formatMoney(t.applied_money?.amount)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {/* New value (after discounts/taxes) */}
                    <div
                      className={css({
                        color: "gray.800",
                        fontSize: "sm",
                        fontWeight: "bold",
                      })}
                    >
                      <b>Final:</b> {formatMoney(item.total_money?.amount)}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Order-level summary */}
          <div
            className={css({ mt: "4", borderTop: "1px solid #eee", pt: "3" })}
          >
            <div
              className={css({ color: "green.700", fontSize: "sm", mb: "1" })}
            >
              <b>Total Discount:</b>{" "}
              {formatMoney(orderPreview?.order?.total_discount_money?.amount)}
            </div>
            <div
              className={css({ color: "blue.700", fontSize: "sm", mb: "1" })}
            >
              <b>Total Tax:</b>{" "}
              {formatMoney(orderPreview?.order?.total_tax_money?.amount)}
            </div>
            <div
              className={css({
                color: "gray.900",
                fontSize: "md",
                fontWeight: "bold",
              })}
            >
              <b>Order Total:</b>{" "}
              {formatMoney(orderPreview?.order?.total_money?.amount)}
            </div>
          </div>
        </div>

        <button
          onClick={handlePlaceOrder}
          className={css({
            px: "6",
            py: "3",
            bg: "green.600",
            color: "white",
            borderRadius: "md",
            fontWeight: "bold",
            _hover: { bg: "green.700" },
          })}
        >
          Confirm and place order
        </button>
      </div>
    )
  );
};
