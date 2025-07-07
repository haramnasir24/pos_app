"use client";
import { createContext, useState, useCallback } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number | null;
  imageUrl: string;
  quantity: number;
  is_taxable: boolean | undefined;
  itemTaxRate?: number;
  category?: string;
  itemDiscount?: number;
  variantId?: string;
  itemDiscountId?: string;
};

// ? check this
export type Discount = {
  id: string;
  name: string;
  percentage?: number;
  amount?: number;
  modify_tax_basis: "MODIFY_TAX_BASIS";
  type: "FIXED_PERCENTAGE" | "FIXED_AMOUNT";
  description?: string;
  minimumOrderAmount?: number;
};

export type TaxRate = {
  id: string;
  name: string;
  percentage: number;
  enabled: boolean;
};

export type OrderSummary = {
  subtotal: number; // total before discounts and taxes
  discountAmount: number;
  taxAmount: number;
  total: number;
  appliedDiscounts: Discount[];
  appliedTaxRates: TaxRate[];
};

export type Cart = {
  // * this is used to look up cart items using their ids
  // * an object of key of string type and value of cartItem type
  [id: string]: CartItem;
};

// * this defines the shape of the cartContext object
// * cart is the current cart state
// * addToCart function to add an item (without specifying quantity, which defaults to 1)
// * using typescript utiliy type Omit
interface CartContextType {
  cart: Cart;
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  // discount and tax methods
  applyItemDiscount: (itemId: string, discount: Discount) => void;
  removeItemDiscount: (itemId: string) => void;
  applyOrderDiscount: (discount: Discount) => void;
  removeOrderDiscount: (discountId: string) => void;
  toggleItemTax: (itemId: string, enabled: boolean) => void;
  setItemTaxRate: (itemId: string, taxRate: number) => void;
  setOrderTaxRate: (taxRate: TaxRate) => void;
  removeOrderTaxRate: (taxRateId: string) => void;
  // Order summary
  getOrderSummary: () => OrderSummary;
  // Clear cart
  clearCart: () => void;
}

// * context is initialised here
export const CartContext = createContext<CartContextType>({
  cart: {},
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  applyItemDiscount: () => {},
  removeItemDiscount: () => {},
  applyOrderDiscount: () => {},
  removeOrderDiscount: () => {},
  toggleItemTax: () => {},
  setItemTaxRate: () => {},
  setOrderTaxRate: () => {},
  removeOrderTaxRate: () => {},
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
  const [orderDiscounts, setOrderDiscounts] = useState<Discount[]>([]);
  const [orderTaxRates, setOrderTaxRates] = useState<TaxRate[]>([]);

  // * memoizing these functions ensures that their references dont change on every render
  const addToCart = useCallback((item: Omit<CartItem, "quantity">) => {
    // * prev is the previous state of the cart
    setCart((prev) => {
      // * if the item already pressent in the cart (edge case: not being used in my app)
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
        ...prev, // * copies previous cart items
        [item.id]: { ...item, quantity: 1 },
      };
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => {
      const newCart = { ...prev };
      delete newCart[id];
      return newCart;
    });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setCart((prev) => {
      if (!prev[id]) return prev; // * if item is not in cart already (edge case)
      if (quantity <= 0) {
        // * edge case (not applicable in my app as of now)
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

  // * discount methods
  const applyItemDiscount = useCallback(
    (itemId: string, discount: Discount) => {
      setCart((prev) => {
        if (!prev[itemId]) return prev;
        return {
          ...prev,
          [itemId]: {
            ...prev[itemId],
            itemDiscount:
              discount.type === "FIXED_PERCENTAGE"
                ? (prev[itemId].price ?? 0) * (discount.percentage ?? 0 / 100)
                : discount.percentage,
            itemDiscountId: discount.id,
          },
        };
      });
    },
    []
  );

  const removeItemDiscount = useCallback((itemId: string) => {
    setCart((prev) => {
      if (!prev[itemId]) return prev;
      const { itemDiscount, itemDiscountId, ...rest } = prev[itemId];
      return {
        ...prev,
        [itemId]: rest,
      };
    });
  }, []);

  const applyOrderDiscount = useCallback((discount: Discount) => {
    setOrderDiscounts((prev) => {
      // Check if discount already exists
      if (prev.some((d) => d.id === discount.id)) return prev;
      return [...prev, discount];
    });
  }, []);

  const removeOrderDiscount = useCallback((discountId: string) => {
    setOrderDiscounts((prev) => prev.filter((d) => d.id !== discountId));
  }, []);

  // * enables or disables the taxable property of an item
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

  // * used to set the selected tax rate on the item
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

  const setOrderTaxRate = useCallback((taxRate: TaxRate) => {
    setOrderTaxRates((prev) => {
      // Check if tax rate already exists
      if (prev.some((t) => t.id === taxRate.id)) return prev;
      return [...prev, taxRate];
    });
  }, []);

  const removeOrderTaxRate = useCallback((taxRateId: string) => {
    setOrderTaxRates((prev) => prev.filter((t) => t.id !== taxRateId));
  }, []);

  // * ORDER SUMMARY
  const getOrderSummary = useCallback((): OrderSummary => {
    const items = Object.values(cart);

    // Calculate subtotal
    const subtotal = items.reduce(
      (sum, item) => sum + (item.price ?? 0) * item.quantity,
      0
    );

    // Calculate item-level discounts
    const itemDiscounts = items.reduce(
      (sum, item) => sum + (item.itemDiscount ?? 0) * item.quantity,
      0
    );

    // Calculate order-level discounts
    const orderDiscountAmount = orderDiscounts.reduce((sum, discount) => {
      if (
        discount.minimumOrderAmount &&
        subtotal < discount.minimumOrderAmount
      ) {
        return sum;
      }
      if (discount.type === "FIXED_PERCENTAGE") {
        return sum + subtotal * (discount.percentage ?? 0 / 100);
      } else {
        return sum + (discount.percentage ?? 0);
      }
    }, 0);

    const totalDiscountAmount = itemDiscounts + orderDiscountAmount;
    const amountAfterDiscounts = subtotal - totalDiscountAmount;

    // Calculate taxes
    const taxAmount = items.reduce((sum, item) => {
      if (!item.is_taxable) return sum;
      const itemSubtotal = (item.price ?? 0) * item.quantity;
      const itemDiscount = (item.itemDiscount ?? 0) * item.quantity;
      const itemAmountAfterDiscount = itemSubtotal - itemDiscount;
      const itemTaxRate = item.itemTaxRate ?? 0;

      // Add order-level tax rates
      const orderTaxAmount = orderTaxRates.reduce((taxSum, taxRate) => {
        return taxSum + itemAmountAfterDiscount * (taxRate.percentage / 100);
      }, 0);

      return sum + itemAmountAfterDiscount * itemTaxRate + orderTaxAmount;
    }, 0);

    const total = amountAfterDiscounts + taxAmount;

    return {
      subtotal,
      discountAmount: totalDiscountAmount,
      taxAmount,
      total,
      appliedDiscounts: orderDiscounts,
      appliedTaxRates: orderTaxRates,
    };
  }, [cart, orderDiscounts, orderTaxRates]);

  const clearCart = useCallback(() => {
    setCart({});
    setOrderDiscounts([]);
    setOrderTaxRates([]);
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
        applyOrderDiscount,
        removeOrderDiscount,
        toggleItemTax,
        setItemTaxRate,
        setOrderTaxRate,
        removeOrderTaxRate,
        getOrderSummary,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
