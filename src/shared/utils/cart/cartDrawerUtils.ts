// * Utility functions for CartDrawer

import { OrderDiscount, OrderTax } from "@/shared/types/order";

/**
 * Creates the order data object for submission to the backend API.
 * @param items - Array of cart items (must include variantId, quantity, id)
 * @param orderDiscounts - Optional array of order-level discounts
 * @param orderTaxes - Optional array of order-level taxes
 * @returns Object containing idempotency_key and order payload
 */
export function createOrderData({
  items,
  orderDiscounts,
  orderTaxes,
}: {
  items: any[];
  orderDiscounts?: OrderDiscount[];
  orderTaxes?: OrderTax[];
}) {
  // * create line items for the order using variantId from cart items
  const line_items = items
    .map((item) => {
      const variationId = item.variantId;
      if (!variationId) {
        console.warn(`No variation ID found for item ${item.id}`);
        return null;
      }

      return {
        quantity: item.quantity.toString(),
        catalog_object_id: variationId,
      };
    })
    .filter(Boolean);

  // * generate a unique idempotency key
  const idempotency_key = crypto.randomUUID();

  // * build order object
  const order: any = {
    pricing_options: {
      auto_apply_discounts: true,
      auto_apply_taxes: true,
    },
    line_items,
    location_id: "LQT0VHHSADY7Z",
  };

  const discounts = orderDiscounts ?? [];
  const taxes = orderTaxes ?? [];

  if (discounts.length > 0) {
    order.discounts = discounts;
  }

  if (taxes.length > 0) {
    order.taxes = taxes;
  }

  console.log(order);

  return {
    idempotency_key,
    order,
  };
}

/**
 * Calculates the order data for previewing totals, discounts, and taxes.
 * @param items - Array of cart items (must include variantId, quantity, id)
 * @param orderDiscounts - Optional array of order-level discounts
 * @param orderTaxes - Optional array of order-level taxes
 * @returns Object containing idempotency_key and order payload
 */
export function calculateOrderData({
  items,
  orderDiscounts,
  orderTaxes,
}: {
  items: any[];
  orderDiscounts?: OrderDiscount[];
  orderTaxes?: OrderTax[];
}) {
  // * create line items for the order using variantId from cart items
  const line_items = items
    .map((item) => {
      const variationId = item.variantId;
      if (!variationId) {
        console.warn(`No variation ID found for item ${item.id}`);
        return null;
      }

      return {
        quantity: item.quantity.toString(),
        catalog_object_id: variationId,
      };
    })
    .filter(Boolean); // * removes null values from the filtered array

  // * generate a unique idempotency key
  const idempotency_key = crypto.randomUUID();

  // * build order object
  const order: any = {
    pricing_options: {
      auto_apply_discounts: true,
      auto_apply_taxes: true,
    },
    line_items,
    location_id: "LQT0VHHSADY7Z",
  };

  const discounts = orderDiscounts ?? [];
  const taxes = orderTaxes ?? [];

  if (discounts.length > 0) {
    order.discounts = discounts;
  }

  if (taxes.length > 0) {
    order.taxes = taxes;
  }

  return {
    idempotency_key,
    order,
  };
}

/**
 * Toggles the taxable status of a cart item.
 * @param itemId - The ID of the item to toggle
 * @param is_taxable - Whether the item should be taxable
 * @param toggleItemTax - Callback to update the item's tax status
 */
export function handleItemTaxToggleUtil({
  itemId,
  is_taxable,
  toggleItemTax,
}: {
  itemId: string;
  is_taxable: boolean;
  toggleItemTax: (itemId: string, enabled: boolean) => void;
}) {
  // * toggle the taxable status of the item
  toggleItemTax(itemId, is_taxable);
}

