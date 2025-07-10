// ? Utility functions for CartDrawer

import { OrderDiscount, OrderTax } from "@/app/types/order";

// ? creates the order
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

  console.log(orderDiscounts)
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
    location_id: "LQT0VHHSADY7Z", // * default test account location id, add to env file
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

// ? calculates the order
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
    location_id: "LQT0VHHSADY7Z", // * default test account location id, add to env file
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

// ? toggles the item tax on or off
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
