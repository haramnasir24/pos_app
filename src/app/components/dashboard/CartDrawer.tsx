"use client";

import { MdOutlineAddShoppingCart } from "react-icons/md";
import { useContext, useState } from "react";
import { CartContext } from "../../context/CartContext";
import { css, cx } from "../../../../styled-system/css";
import Image from "next/image";

export default function CartDrawer() {
  const { cart, updateQuantity, removeFromCart } = useContext(CartContext);
  const [open, setOpen] = useState(false);
  // returns an array of all items in cart at the moment
  const items = Object.values(cart);
  const total = items.reduce(
    (sum, item) => sum + (item.price ?? 0) * item.quantity,
    0
  );

  return (
    <>
      <button
        className={css({
          position: "fixed",
          top: "3",
          right: "6",
          zIndex: 50,
          bg: "blue.600",
          color: "white",
          px: "4",
          py: "2",
          borderRadius: "md",
          fontWeight: "bold",
          _hover: { bg: "blue.700" },
        })}
        onClick={() => setOpen(true)}
      >
        Cart ({items.length}){/* <MdOutlineAddShoppingCart /> */}
      </button>
      <div
        className={cx(
          css({
            position: "fixed",
            top: 0,
            right: 0,
            height: "100vh",
            width: "96",
            bg: "white",
            boxShadow: "lg",
            zIndex: 100,
            transform: open ? "translateX(0)" : "translateX(100%)",
            transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            display: "flex",
            flexDirection: "column",
            p: "6",
          })
        )}
        style={{ transform: open ? "translateX(0)" : "translateX(100%)" }}
      >
        <button
          className={css({
            alignSelf: "flex-end",
            mb: "4",
            color: "gray.600",
            fontSize: "xl",
          })}
          onClick={() => setOpen(false)}
        >
          ×
        </button>
        <h2 className={css({ fontSize: "2xl", fontWeight: "bold", mb: "4" })}>
          Shopping Cart
        </h2>
        {items.length === 0 ? (
          <p className={css({ color: "gray.500" })}>Your cart is empty.</p>
        ) : (
          <div className={css({ flex: 1, overflowY: "auto" })}>
            {items.map((item) => (
              <div
                key={item.id}
                className={css({
                  display: "flex",
                  alignItems: "center",
                  mb: "4",
                })}
              >
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  width={48}
                  height={48}
                  className={css({ borderRadius: "md", mr: "3" })}
                />
                <div className={css({ flex: 1 })}>
                  <div
                    className={css({ fontSize: "sm", fontWeight: "medium" })}
                  >
                    {item.name}
                  </div>
                  <div className={css({ color: "gray.600", fontSize: "xs" })}>
                    ${item.price ? (item.price / 100).toFixed(2) : "N/A"}
                  </div>
                </div>
                <div
                  className={css({
                    display: "flex",
                    alignItems: "center",
                    gap: "1",
                  })}
                >
                  <button
                    className={css({
                      px: "2",
                      py: "1",
                      bg: "gray.200",
                      borderRadius: "md",
                    })}
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span className={css({ px: "2" })}>{item.quantity}</span>
                  <button
                    className={css({
                      px: "2",
                      py: "1",
                      bg: "gray.200",
                      borderRadius: "md",
                    })}
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                  <button
                    className={css({
                      ml: "2",
                      color: "red.500",
                      fontSize: "sm",
                    })}
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <div
          className={css({
            mt: "auto",
            pt: "4",
            borderTop: "1px solid",
            borderColor: "gray.200",
          })}
        >
          <div className={css({ fontWeight: "bold", fontSize: "lg", mb: "2" })}>
            Total: ${(total / 100).toFixed(2)}
          </div>
          <button
            className={css({
              w: "full",
              bg: "green.600",
              color: "white",
              py: "3",
              borderRadius: "md",
              fontWeight: "bold",
              fontSize: "md",
              _hover: { bg: "green.700" },
            })}
            disabled={items.length === 0}
          >
            Checkout
          </button>
        </div>
      </div>
      {open && (
        <div
          className={css({
            position: "fixed",
            inset: 0,
            bg: "blackAlpha.400",
            zIndex: 90,
          })}
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
