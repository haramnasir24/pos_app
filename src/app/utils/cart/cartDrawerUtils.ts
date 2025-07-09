// ? Utility functions for CartDrawer

// ? creates the order
export function createOrderData({ items }: { items: any[] }) {
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

  return {
    idempotency_key,
    order: {
      pricing_options: {
        auto_apply_discounts: true,
        auto_apply_taxes: true,
      },
      line_items,
      location_id: "LQT0VHHSADY7Z", // * default test account location id, add to env file
    },
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
