"use client";
import { createContext, useState, useCallback } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number | null;
  imageUrl: string;
  quantity: number;
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
}

// * context is initialised here
export const CartContext = createContext<CartContextType>({
  cart: {},
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
});

export function CartContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cart, setCart] = useState<Cart>({});

  // * memoizing these functions ensures that their references dont change on every render
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

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => {
      const newCart = { ...prev };
      delete newCart[id];
      return newCart;
    });
  }, []);

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

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
}
