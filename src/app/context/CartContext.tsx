"use client";
import { createContext, useState, useCallback } from "react";

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

export type Discount = {
  discount_name: string;
  discount_value: string | number | null;
};

export type TaxRate = {
  name: string;
  percentage: number;
};

export type OrderSummary = {
  subtotal: number; // * sub-total before discounts and taxes
  discountAmount: number;
  taxAmount: number;
  total: number;
  appliedDiscounts: Discount[];
  appliedTaxRates: TaxRate[];
};

export type Cart = {
  // * this is an object of key of string type and value of cartItem type
  // * used to look up cart items using their ids
  [id: string]: CartItem;
};

// * this defines the shape of the cartContext object
interface CartContextType {
  cart: Cart; // * cart is the current cart state
  // * cart methods
  addToCart: (item: Omit<CartItem, "quantity">) => void; // * addToCart function to add an item (without specifying quantity, which defaults to 1)
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  // * discount and tax methods
  applyItemDiscount: (itemId: string, discount: Discount) => void;
  removeItemDiscount: (itemId: string) => void;
  toggleItemTax: (itemId: string, enabled: boolean) => void;
  setItemTaxRate: (itemId: string, taxRate: number) => void;
  // * Order summary
  getOrderSummary: () => OrderSummary;
  // * Clear cart
  clearCart: () => void;
}

// * cart context is initialised here
export const CartContext = createContext<CartContextType>({
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

export function CartContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cart, setCart] = useState<Cart>({});

  // * Add item to cart
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
    let discountAmount = 0;
    let taxAmount = 0;
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
        const value = item.itemDiscount.discount_value;
        // BOGO: 100% off for every second item
        if (value === "100%" || value === 100) {
          if (item.quantity >= 2) {
            // * Number of free items = floor(quantity / 2)
            const freeItems = Math.floor(item.quantity / 2);
            itemDiscountValue = freeItems * itemPrice;
          } else {
            // Less than 2 items, no BOGO discount
            itemDiscountValue = 0;
          }
        } else if (typeof value === "string" && value.includes("%")) {
          // Percentage discount
          const percent = parseFloat(value);
          if (!isNaN(percent)) {
            itemDiscountValue = (itemSubtotal * percent) / 100;
          }
        } else if (typeof value === "number") {
          // Fixed amount discount
          itemDiscountValue = value * item.quantity;
        } else if (typeof value === "string") {
          // Try to parse as number
          const num = parseFloat(value);
          if (!isNaN(num)) {
            itemDiscountValue = num * item.quantity;
          }
        }
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
      subtotal += discountedSubtotal;
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
