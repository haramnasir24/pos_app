"use client";
import { useContext } from "react";

import Image from "next/image";
import { CartContext } from "../../../../shared/context/CartContext";
import { css } from "~/styled-system/css";

/**
 * Props for the ProductCard component.
 */
interface ProductCardProps {
  id: string;
  name: string;
  price: number | null;
  imageUrl: string;
  state?: string;
  quantity?: string | number;
  is_taxable?: boolean | undefined;
  itemTaxRate?: number;
  variantId?: string;
  discounts?: Array<{
    discount_name: string;
    discount_value: string | number | null;
  }>;
  taxes?: Array<{ name: string; percentage: string | number | null }>;
}

/**
 * Card component for displaying product information and cart controls.
 * Handles inventory, pricing, and add/remove/update cart actions.
 */
export default function ProductCard({
  id,
  name,
  price,
  imageUrl,
  state,
  quantity,
  variantId,
  discounts,
  taxes,
}: ProductCardProps) {
  const { cart, addToCart, removeFromCart, updateQuantity } =
    useContext(CartContext);
  // * retrieves the cart item from the cart object using the id
  const cartItem = cart[id];

  /**
   * The available inventory quantity for the product.
   */
  const inventoryQty =
    typeof quantity === "string" ? parseInt(quantity, 10) : quantity ?? 0;
  /**
   * Whether the product is out of stock.
   */
  const isOutOfStock = !inventoryQty || inventoryQty <= 0;
  /**
   * Whether the cart already has the maximum allowed quantity for this product.
   */
  const atMaxQty = cartItem && cartItem.quantity >= inventoryQty;

  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        borderColor: "gray.200",
        borderRadius: "lg",
        padding: "4",
        background: "white",
        height: "100%",
      })}
    >
      <div
        className={css({
          width: "full",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: "3",
        })}
      >
        <Image
          src={imageUrl}
          alt={name}
          width={180}
          height={180}
          // style={{ objectFit: "contain", maxHeight: "100%" }}
          className={css({ borderRadius: "md" })}
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
          mt: "2",
          display: "flex",
          alignItems: "center",
          gap: "2",
        })}
      >
        <span
          className={css({
            px: "2",
            py: "1",
            borderRadius: "full",
            fontSize: "xs",
            fontWeight: "bold",
            bg: state === "IN_STOCK" ? "green.100" : "red.100",
            color: state === "IN_STOCK" ? "green.700" : "red.700",
          })}
        >
          {state ?? "Unknown"}
        </span>
        <span
          className={css({
            fontSize: "sm",
            color: "gray.700",
            ml: "2",
          })}
        >
          Qty: {quantity ?? "-"}
        </span>
      </div>
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
                bg: atMaxQty ? "gray.100" : "gray.200",
                borderRadius: "md",
                color: atMaxQty ? "gray.400" : undefined,
                cursor: atMaxQty ? "not-allowed" : undefined,
              })}
              onClick={() => updateQuantity(id, cartItem.quantity + 1)}
              disabled={atMaxQty}
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
              mt: "1",
              px: "4",
              py: "2",
              bg: isOutOfStock ? "gray.200" : "gray.800",
              color: isOutOfStock ? "gray.500" : "white",
              borderRadius: "md",
              fontWeight: "medium",
              fontSize: "md",
              transition: "all 0.2s",
              width: "100%",
              _hover: isOutOfStock ? undefined : { bg: "gray.700" },
              cursor: isOutOfStock ? "not-allowed" : undefined,
            })}
            onClick={() =>
              addToCart({
                id,
                name,
                price,
                imageUrl,
                is_taxable: false,
                variantId,
                discounts,
                taxes,
              })
            }
            disabled={isOutOfStock}
          >
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </button>
        )}
      </div>
    </div>
  );
}
