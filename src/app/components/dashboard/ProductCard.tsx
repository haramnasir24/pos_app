"use client";
import { useContext } from "react";
import { css } from "../../../../styled-system/css";
import Image from "next/image";
import { CartContext } from "../../context/CartContext";

interface ProductCardProps {
  id: string;
  name: string;
  price: number | null;
  imageUrl: string;
}

export default function ProductCard({
  id,
  name,
  price,
  imageUrl,
}: ProductCardProps) {
  const { cart, addToCart, removeFromCart, updateQuantity } =
    useContext(CartContext);
  const cartItem = cart[id];

  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        border: "1px solid",
        borderColor: "gray.200",
        borderRadius: "lg",
        padding: "4",
        background: "white",
        boxShadow: "sm",
        height: "100%",
      })}
    >
      <div
        className={css({
          width: "full",
          height: "220px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: "2",
        })}
      >
        <Image
          src={imageUrl}
          alt={name}
          width={180}
          height={180}
          style={{ objectFit: "contain", maxHeight: "100%" }}
          className={css({ borderRadius: "md" })}
          onError={(e) => (e.currentTarget.src = "/placeholder.jpg")}
        />
      </div>

      <h3 className={css({ fontSize: "sm", fontWeight: "semibold" })}>
        {name}
      </h3>
      <p className={css({ fontSize: "sm", color: "gray.600" })}>
        {price !== null
          ? `$${(price / 100).toFixed(2)}`
          : "Price not available"}
      </p>
      <div
        className={css({
          display: "flex",
          alignItems: "center",
          gap: "2",
          mt: "4",
        })}
      >
        {cartItem ? (
          <div
            className={css({
              display: "flex",
              alignItems: "center",
              gap: "2",
            })}
          >
            <button
              className={css({
                px: "2",
                py: "1",
                bg: "gray.200",
                borderRadius: "md",
              })}
              onClick={() => updateQuantity(id, cartItem.quantity - 1)}
              disabled={cartItem.quantity <= 1}
            >
              -
            </button>
            <span className={css({ px: "2" })}>{cartItem.quantity}</span>
            <button
              className={css({
                px: "2",
                py: "1",
                bg: "gray.200",
                borderRadius: "md",
              })}
              onClick={() => updateQuantity(id, cartItem.quantity + 1)}
            >
              +
            </button>
            <button
              className={css({ ml: "2", color: "red.500", fontSize: "sm" })}
              onClick={() => removeFromCart(id)}
            >
              Remove
            </button>
          </div>
        ) : (
          <button
            className={css({
              mt: "2",
              px: "4",
              py: "2",
              bg: "gray.800",
              color: "white",
              borderRadius: "md",
              fontWeight: "medium",
              fontSize: "md",
              _hover: { bg: "gray.700" },
              // _active: { bg: "blue.800" },
              transition: "all 0.2s",
              width: "100%",
            })}
            onClick={() => addToCart({ id, name, price, imageUrl })}
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}
