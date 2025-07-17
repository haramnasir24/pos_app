"use client";
import { createContext, useState, useCallback } from "react";

const BOGO_DISCOUNT = 100
/**
 * Represents an item in the cart.
 * @property {string} id - Unique identifier for the item.
 * @property {string} name - Name of the item.
 * @property {number|null} price - Price of the item in cents (or null if unavailable).
 * @property {string} imageUrl - URL of the item's image.
 * @property {number} quantity - Quantity of the item in the cart.
 * @property {boolean|undefined} is_taxable - Whether the item is taxable.
 * @property {number} [itemTaxRate] - Selected tax rate (percentage).
 * @property {string} [category] - Category of the item.
 * @property {Discount} [itemDiscount] - Applied discount object.
 * @property {string} [variantId] - Variant ID of the item.
 * @property {Array<{discount_name: string, discount_value: string|number|null}>} [discounts] - Discounts available for the item.
 * @property {Array<{name: string, percentage: string|number|null}>} [taxes] - Taxes available for the item.
 */
export type CartItem = {
  id: string;
  name: string;
  price: number | null;
  imageUrl: string;
  quantity: number;
  is_taxable: boolean | undefined;
  itemTaxRate?: number; // * selected tax rate (percentage)
  category?: string;
  itemDiscount?: Discount; // * applied discount object
  variantId?: string;
  discounts?: Array<{
    discount_name: string;
    discount_value: string | number | null;
  }>;
  taxes?: Array<{ name: string; percentage: string | number | null }>;
};

/**
 * Represents a discount applied to an item or order.
 * @property {string} discount_name - Name of the discount.
 * @property {string|number|null} discount_value - Value of the discount (percentage or fixed amount).
 */
export type Discount = {
  discount_name: string;
  discount_value: string | number | null;
};

/**
 * Represents a tax rate.
 * @property {string} name - Name of the tax.
 * @property {number} percentage - Tax percentage.
 */
export type TaxRate = {
  name: string;
  percentage: number;
};

/**
 * Represents a summary of the order, including subtotal, discounts, taxes, and total.
 * @property {number} subtotal - Subtotal before discounts and taxes.
 * @property {number} discountAmount - Total discount amount applied.
 * @property {number} taxAmount - Total tax amount applied.
 * @property {number} total - Final total after discounts and taxes.
 * @property {Discount[]} appliedDiscounts - List of applied discounts.
 * @property {TaxRate[]} appliedTaxRates - List of applied tax rates.
 */
export type OrderSummary = {
  subtotal: number; // * sub-total before discounts and taxes
  discountAmount: number;
  taxAmount: number;
  total: number;
  appliedDiscounts: Discount[];
  appliedTaxRates: TaxRate[];
};

/**
 * Represents the cart as an object with item IDs as keys and CartItem as values.
 * Used to look up cart items using their ids
 */
export type Cart = {
  [id: string]: CartItem;
};

/**
 * Defines the shape of the CartContext object and its methods.
 * @interface CartContextType
 * @property {Cart} cart - Current cart state.
 * @property {(item: Omit<CartItem, 'quantity'>) => void} addToCart - Add an item to the cart.
 * @property {(id: string) => void} removeFromCart - Remove an item from the cart by ID.
 * @property {(id: string, quantity: number) => void} updateQuantity - Update the quantity of an item.
 * @property {(itemId: string, discount: Discount) => void} applyItemDiscount - Apply a discount to an item.
 * @property {(itemId: string) => void} removeItemDiscount - Remove a discount from an item.
 * @property {(itemId: string, enabled: boolean) => void} toggleItemTax - Toggle tax on or off for an item.
 * @property {(itemId: string, taxRate: number) => void} setItemTaxRate - Set the tax rate for an item.
 * @property {() => OrderSummary} getOrderSummary - Get the current order summary.
 * @property {() => void} clearCart - Clear all items from the cart.
 */
interface CartContextType {
  cart: Cart;
  addToCart: (item: Omit<CartItem, "quantity">) => void; // * addToCart function to add an item (without specifying quantity, which defaults to 1)
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  // * discount and tax methods
  applyItemDiscount: (itemId: string, discount: Discount) => void;
  removeItemDiscount: (itemId: string) => void;
  toggleItemTax: (itemId: string, enabled: boolean) => void;
  setItemTaxRate: (itemId: string, taxRate: number) => void;
  getOrderSummary: () => OrderSummary;
  clearCart: () => void;
}

/**
 * React context for managing the cart state and actions.
 */
export const CartContext = createContext<CartContextType>({
  // * cart context is initialised here
  cart: {},
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  applyItemDiscount: () => {},
  removeItemDiscount: () => {},
  toggleItemTax: () => {},
  setItemTaxRate: () => {},
  getOrderSummary: () => ({
    subtotal: 0,
    discountAmount: 0,
    taxAmount: 0,
    total: 0,
    appliedDiscounts: [],
    appliedTaxRates: [],
  }),
  clearCart: () => {},
});

/**
 * Provides the CartContext to its children and manages cart state and logic.
 */
export function CartContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cart, setCart] = useState<Cart>({});

  // * Add item to cart
  // function definition always stays the same
  const addToCart = useCallback((item: Omit<CartItem, "quantity">) => {
    setCart((prev) => {
      if (prev[item.id]) {
        return {
          ...prev,
          [item.id]: {
            ...prev[item.id],
            quantity: prev[item.id].quantity + 1,
          },
        };
      }
      return {
        ...prev,
        [item.id]: { ...item, quantity: 1 },
      };
    });
  }, []);

  // * remove item from cart
  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => {
      const newCart = { ...prev };
      delete newCart[id];
      return newCart;
    });
  }, []);

  // * updated the quantity of cart item
  const updateQuantity = useCallback((id: string, quantity: number) => {
    setCart((prev) => {
      if (!prev[id]) return prev;
      if (quantity <= 0) {
        const newCart = { ...prev };
        delete newCart[id];
        return newCart;
      }
      return {
        ...prev,
        [id]: { ...prev[id], quantity },
      };
    });
  }, []);

  // * Apply discount to item
  const applyItemDiscount = useCallback(
    (itemId: string, discount: Discount) => {
      setCart((prev) => {
        if (!prev[itemId]) return prev;
        return {
          ...prev,
          [itemId]: {
            ...prev[itemId],
            itemDiscount: discount,
          },
        };
      });
    },
    []
  );

  // * Remove discount from item
  const removeItemDiscount = useCallback((itemId: string) => {
    setCart((prev) => {
      if (!prev[itemId]) return prev;
      const { itemDiscount, ...rest } = prev[itemId];
      return {
        ...prev,
        [itemId]: rest,
      };
    });
  }, []);

  // * Toggle tax on/off for item
  const toggleItemTax = useCallback((itemId: string, enabled: boolean) => {
    setCart((prev) => {
      if (!prev[itemId]) return prev;
      return {
        ...prev,
        [itemId]: {
          ...prev[itemId],
          is_taxable: enabled,
        },
      };
    });
  }, []);

  // * Set tax rate for item
  const setItemTaxRate = useCallback((itemId: string, taxRate: number) => {
    setCart((prev) => {
      if (!prev[itemId]) return prev;
      return {
        ...prev,
        [itemId]: {
          ...prev[itemId],
          itemTaxRate: taxRate,
        },
      };
    });
  }, []);

  // * Calculate order summary
  const getOrderSummary = useCallback((): OrderSummary => {
    const items = Object.values(cart);
    let subtotal = 0;
    let discountAmount = 0; // * accumulates discounts for all items
    let taxAmount = 0; // * accumulates taxes for all items
    const appliedDiscounts: Discount[] = [];
    const appliedTaxRates: TaxRate[] = [];

    for (const item of items) {
      let itemPrice = item.price ?? 0;
      let itemSubtotal = itemPrice * item.quantity;
      let itemDiscountValue = 0;
      let itemTaxValue = 0;

      // * Apply discount if present
      if (item.itemDiscount) {
        appliedDiscounts.push(item.itemDiscount);
        itemDiscountValue = calculateItemDiscountValue(item, itemSubtotal);
      }
      const discountedSubtotal = itemSubtotal - itemDiscountValue;
      discountAmount += itemDiscountValue;

      // * Apply tax if present and enabled
      if (item.is_taxable && item.itemTaxRate !== undefined) {
        appliedTaxRates.push({
          name:
            item.taxes?.find((t) => Number(t.percentage) === item.itemTaxRate)
              ?.name || "Tax",
          percentage: item.itemTaxRate,
        });
        itemTaxValue = (discountedSubtotal * item.itemTaxRate) / 100;
      }
      taxAmount += itemTaxValue;
      subtotal += discountedSubtotal; // * subtotal is discounted
    }
    const total = subtotal + taxAmount;
    return {
      subtotal,
      discountAmount,
      taxAmount,
      total,
      appliedDiscounts,
      appliedTaxRates,
    };
  }, [cart]);

  // * clear cart items
  const clearCart = useCallback(() => {
    setCart({});
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        applyItemDiscount,
        removeItemDiscount,
        toggleItemTax,
        setItemTaxRate,
        getOrderSummary,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// * calculates the discounted amount for each item
function calculateItemDiscountValue(item: CartItem, itemSubtotal: number): number {
  if (!item.itemDiscount) return 0;
  const value = item.itemDiscount.discount_value;

  // BOGO: 100% off for every second item
  if (value === `${BOGO_DISCOUNT}%` || value === BOGO_DISCOUNT) {
    if (item.quantity >= 2) {
      const freeItems = Math.floor(item.quantity / 2);
      return freeItems * (item.price ?? 0);
    }
    return 0;
  }

  // Percentage discount
  if (typeof value === "string" && value.includes("%")) {
    const percent = parseFloat(value);
    return !isNaN(percent) ? (itemSubtotal * percent) / 100 : 0;
  }

  // Fixed amount discount (number)
  if (typeof value === "number") {
    return value * item.quantity;
  }

  // Fixed amount discount (string that parses to number)
  if (typeof value === "string") {
    const num = parseFloat(value);
    return !isNaN(num) ? num * item.quantity : 0;
  }

  // Default: no discount
  return 0;
}
