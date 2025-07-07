// "use client";

// import { css } from "../../../../styled-system/css";
// import { Discount, TaxRate, OrderSummary } from "../../context/CartContext";


// type CheckoutViewProps = {
//   items: any[];
//   orderSummary: OrderSummary;
//   availableDiscounts: Discount[];
//   availableTaxRates: TaxRate[];
//   onDiscountToggle: (discount: Discount) => void;
//   onTaxToggle: (taxRate: TaxRate) => void;
//   onCheckout: () => void;
//   isProcessing: boolean;
//   orderError: string | null;
//   onBack: () => void;
// };

// export default function CheckoutView({
//   items,
//   orderSummary,
//   availableDiscounts,
//   availableTaxRates,
//   onDiscountToggle,
//   onTaxToggle,
//   onCheckout,
//   isProcessing,
//   orderError,
//   onBack,
// }: CheckoutViewProps) {
//   return (
//     <div className={css({ flex: 1, display: "flex", flexDirection: "column" })}>
//       <h2 className={css({ fontSize: "2xl", fontWeight: "bold", mb: "4" })}>
//         Checkout
//       </h2>

//       <div className={css({ flex: 1, overflowY: "auto" })}>
//         {/* Order Summary */}
//         <div className={css({ mb: "6" })}>
//           <h3 className={css({ fontSize: "lg", fontWeight: "bold", mb: "3" })}>
//             Order Summary
//           </h3>
//           <div className={css({ spaceY: "2" })}>
//             <div
//               className={css({
//                 display: "flex",
//                 justifyContent: "space-between",
//               })}
//             >
//               <span>Subtotal:</span>
//               <span>${(orderSummary.subtotal / 100).toFixed(2)}</span>
//             </div>
//             {orderSummary.discountAmount > 0 && (
//               <div
//                 className={css({
//                   display: "flex",
//                   justifyContent: "space-between",
//                   color: "green.600",
//                 })}
//               >
//                 <span>Discounts:</span>
//                 <span>-${(orderSummary.discountAmount / 100).toFixed(2)}</span>
//               </div>
//             )}
//             {orderSummary.taxAmount > 0 && (
//               <div
//                 className={css({
//                   display: "flex",
//                   justifyContent: "space-between",
//                 })}
//               >
//                 <span>Tax:</span>
//                 <span>${(orderSummary.taxAmount / 100).toFixed(2)}</span>
//               </div>
//             )}
//             {/* Order-level Tax Breakdown */}
//             {orderSummary.appliedTaxRates.length > 0 && (
//               <div className={css({ mb: "2" })}>
//                 {orderSummary.appliedTaxRates.map((tax) => {
//                   // Calculate order-level tax amount for this tax
//                   const taxAmount = items
//                     .filter((item) => item.is_taxable)
//                     .reduce((sum, item) => {
//                       const itemSubtotal = (item.price ?? 0) * item.quantity;
//                       const itemDiscount = (item.itemDiscount ?? 0) * item.quantity;
//                       const itemAmountAfterDiscount = itemSubtotal - itemDiscount;
//                       return sum + itemAmountAfterDiscount * (tax.percentage / 100);
//                     }, 0);
//                   return (
//                     <div key={tax.id} className={css({ display: "flex", justifyContent: "space-between", fontSize: "sm" })}>
//                       <span>{tax.name} ({tax.percentage}%):</span>
//                       <span>${(taxAmount / 100).toFixed(2)}</span>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//             <div
//               className={css({
//                 display: "flex",
//                 justifyContent: "space-between",
//                 fontWeight: "bold",
//                 fontSize: "lg",
//                 borderTop: "1px solid",
//                 borderColor: "gray.200",
//                 pt: "2",
//               })}
//             >
//               <span>Total:</span>
//               <span>${(orderSummary.total / 100).toFixed(2)}</span>
//             </div>
//           </div>
//         </div>

//         {/* Available Discounts */}
//         <OrderDiscounts
//           availableDiscounts={availableDiscounts}
//           orderSummary={orderSummary}
//           onDiscountToggle={onDiscountToggle}
//           title="Available Discounts"
//         />

//         {/* Available Tax Rates */}
//         <OrderTaxes
//           availableTaxRates={availableTaxRates}
//           orderSummary={orderSummary}
//           onTaxToggle={onTaxToggle}
//           title="Tax Options"
//         />

//         {/* Error Message */}
//         {orderError && (
//           <div
//             className={css({
//               bg: "red.50",
//               border: "1px solid",
//               borderColor: "red.200",
//               color: "red.700",
//               p: "3",
//               borderRadius: "md",
//               mb: "4",
//             })}
//           >
//             {orderError}
//           </div>
//         )}
//       </div>

//       {/* Action Buttons */}
//       <div
//         className={css({
//           mt: "auto",
//           pt: "4",
//           borderTop: "1px solid",
//           borderColor: "gray.200",
//         })}
//       >
//         <div className={css({ display: "flex", gap: "3" })}>
//           <button
//             onClick={onBack}
//             className={css({
//               flex: 1,
//               bg: "gray.200",
//               color: "gray.700",
//               py: "3",
//               borderRadius: "md",
//               fontWeight: "bold",
//               fontSize: "md",
//               _hover: { bg: "gray.300" },
//             })}
//           >
//             Back to Cart
//           </button>
//           <button
//             onClick={onCheckout}
//             disabled={isProcessing || items.length === 0}
//             className={css({
//               flex: 1,
//               bg: isProcessing ? "gray.400" : "green.600",
//               color: "white",
//               py: "3",
//               borderRadius: "md",
//               fontWeight: "bold",
//               fontSize: "md",
//               _hover: isProcessing ? undefined : { bg: "green.700" },
//               cursor: isProcessing ? "not-allowed" : "pointer",
//             })}
//           >
//             {isProcessing ? "Processing..." : "Place Order"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// } 