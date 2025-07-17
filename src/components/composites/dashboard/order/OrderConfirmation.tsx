import { OrderDiscount, OrderTax } from "@/shared/types/order";
import { createOrderData } from "@/shared/utils/cart/cartDrawerUtils";
import { useEffect, useState } from "react";
import { css } from "~/styled-system/css/css.mjs";

/**
 * Props for the OrderConfirmation component.
 * @property items - Array of cart items to confirm
 * @property accessToken - Auth token for API requests
 * @property orderDiscounts - Optional array of order-level discounts
 * @property orderTaxes - Optional array of order-level taxes
 * @property onClose - Callback to close the confirmation dialog
 */
type OrderConfirmationProps = {
  items: any[];
  accessToken: string;
  orderDiscounts?: OrderDiscount[];
  orderTaxes?: OrderTax[];
  onClose: () => void;
};

/**
 * Handles order creation and displays the result (success or error) with a summary.
 * Shows loading, error, and success states for order processing.
 */
export const OrderConfirmation = ({
  items,
  accessToken,
  orderDiscounts,
  orderTaxes,
  onClose,
}: OrderConfirmationProps) => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [orderResult, setOrderResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    /**
     * Creates the order by calling the backend API.
     * Handles loading and error states.
     */
    const createOrder = async () => {
      try {
        setIsProcessing(true);
        setError(null);

        // * create order data
        const orderData = createOrderData({
          items,
          orderDiscounts,
          orderTaxes,
        });

        // * make API call to square orders to create order
        const response = await fetch("/api/orders/create-order", {
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
        setOrderResult(result); // * contains the order object that is created
      } catch (err) {
        console.error("Error creating order:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsProcessing(false);
      }
    };

    createOrder();
  }, [items, accessToken]);

  // * retrieving order data from the orders api response
  // console.log(orderResult);

  /**
   * Formats a cent value as a dollar string.
   * @param amount - Amount in cents
   * @returns Formatted string in dollars
   */
  const formatMoney = (amount: number | undefined) =>
    typeof amount === "number" ? `$${(amount / 100).toFixed(2)}` : "N/A";

  /**
   * Gets the tax name by UID from the order result.
   * @param uid - Tax UID
   * @returns Tax name or fallback
   */
  const getTaxName = (uid: string) =>
    orderResult?.order?.taxes?.find((t: any) => t.uid === uid)?.name || "Tax";
  /**
   * Gets the discount name by UID from the order result.
   * @param uid - Discount UID
   * @returns Discount name or fallback
   */
  const getDiscountName = (uid: string) =>
    orderResult?.order?.discounts?.find((d: any) => d.uid === uid)?.name ||
    "Discount";

  if (isProcessing) {
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
          Processing Order...
        </h2>
        <p className={css({ color: "gray.600" })}>
          Please wait while we create your order.
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
        <button
          onClick={onClose}
          className={css({
            px: "4",
            py: "2",
            bg: "gray.600",
            color: "white",
            borderRadius: "md",
            _hover: { bg: "gray.700" },
          })}
        >
          Close
        </button>
      </div>
    );
  }

  return (
    !isProcessing && (
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
        })}
      >
        <div className={css({ color: "green.600", fontSize: "2xl", mb: "4" })}>
          ✓
        </div>
        <h2 className={css({ fontSize: "xl", fontWeight: "bold", mb: "4" })}>
          Order Successful!
        </h2>

        {/* Order Summary */}
        <div className={css({ textAlign: "left", mb: "6" })}>
          <h3
            className={css({
              fontSize: "lg",
              fontWeight: "bold",
              mb: "3",
              color: "gray.800",
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
              Items ({orderResult?.order?.line_items?.length || 0})
            </h4>
            <div className={css({ spaceY: "2" })}>
              {orderResult?.order?.line_items?.map(
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
              {formatMoney(orderResult?.order?.total_discount_money?.amount)}
            </div>
            <div
              className={css({ color: "blue.700", fontSize: "sm", mb: "1" })}
            >
              <b>Total Tax:</b>{" "}
              {formatMoney(orderResult?.order?.total_tax_money?.amount)}
            </div>
            <div
              className={css({
                color: "gray.900",
                fontSize: "md",
                fontWeight: "bold",
              })}
            >
              <b>Order Total:</b>{" "}
              {formatMoney(orderResult?.order?.total_money?.amount)}
            </div>
          </div>
        </div>

        {orderResult?.order?.id && (
          <p className={css({ color: "gray.500", fontSize: "sm", mb: "4" })}>
            Order ID: {orderResult.order.id}
          </p>
        )}

        <button
          onClick={onClose}
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
          Continue Shopping
        </button>
      </div>
    )
  );
};
