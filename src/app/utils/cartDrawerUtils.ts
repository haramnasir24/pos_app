// Utility functions for CartDrawer
import { Discount, TaxRate, OrderSummary } from "../context/CartContext";

export async function handleCheckoutUtil({
  items,
  orderSummary,
  clearCart,
  setOrderSuccess,
  setShowCheckout,
  setOrderError,
  setOpen,
  setIsProcessing,
}: {
  items: any[];
  orderSummary: OrderSummary;
  clearCart: () => void;
  setOrderSuccess: (v: boolean) => void;
  setShowCheckout: (v: boolean) => void;
  setOrderError: (v: string | null) => void;
  setOpen: (v: boolean) => void;
  setIsProcessing: (v: boolean) => void;
}) {
  setIsProcessing(true);
  setOrderError(null);
  try {
    const orderData = {
      items: items,
      orderDiscounts: orderSummary.appliedDiscounts,
      orderTaxRates: orderSummary.appliedTaxRates,
    };
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderData }),
    });
    const result = await response.json();
    if (result.success) {
      setOrderSuccess(true);
      clearCart();
      setTimeout(() => {
        setShowCheckout(false);
        setOrderSuccess(false);
        setOpen(false);
      }, 3000);
    } else {
      setOrderError(result.error || "Failed to process order");
    }
  } catch (error) {
    setOrderError("Network error occurred");
  } finally {
    setIsProcessing(false);
  }
}

export function handleDiscountToggleUtil({
  discount,
  orderSummary,
  removeOrderDiscount,
  applyOrderDiscount,
}: {
  discount: Discount;
  orderSummary: OrderSummary;
  removeOrderDiscount: (id: string) => void;
  applyOrderDiscount: (discount: Discount) => void;
}) {
  const isApplied = orderSummary.appliedDiscounts.some(
    (d) => d.id === discount.id
  );
  if (isApplied) {
    removeOrderDiscount(discount.id);
  } else {
    applyOrderDiscount(discount);
  }
}

export function handleTaxToggleUtil({
  taxRate,
  orderSummary,
  removeOrderTaxRate,
  setOrderTaxRate,
}: {
  taxRate: TaxRate;
  orderSummary: OrderSummary;
  removeOrderTaxRate: (id: string) => void;
  setOrderTaxRate: (taxRate: TaxRate) => void;
}) {
  const isApplied = orderSummary.appliedTaxRates.some(
    (t) => t.id === taxRate.id
  );
  if (isApplied) {
    removeOrderTaxRate(taxRate.id);
  } else {
    setOrderTaxRate(taxRate);
  }
}

export function handleItemTaxToggleUtil({
  itemId,
  is_taxable,
  toggleItemTax,
}: {
  itemId: string;
  is_taxable: boolean;
  toggleItemTax: (itemId: string, enabled: boolean) => void;
}) {
  // toggle the taxable status of the item
  toggleItemTax(itemId, is_taxable);
}
