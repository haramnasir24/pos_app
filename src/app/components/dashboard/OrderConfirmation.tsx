import { css, cx } from "../../../../styled-system/css";

export const OrderConfirmation = () => {
  return (
    <div
      className={css({
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        bg: "white",
        p: "8",
        borderRadius: "lg",
        boxShadow: "xl",
        zIndex: 200,
        textAlign: "center",
      })}
    >
      <div className={css({ color: "green.600", fontSize: "2xl", mb: "4" })}>
        ✓
      </div>
      <h2 className={css({ fontSize: "xl", fontWeight: "bold", mb: "2" })}>
        Order Successful!
      </h2>
      <p className={css({ color: "gray.600" })}>
        Your order has been placed successfully.
      </p>
    </div>
  );
};
