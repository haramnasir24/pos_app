import { OrderDiscount, OrderTax } from "../shared/types/order";

export const ORDER_LEVEL_DISCOUNTS: OrderDiscount[] = [
  {
    type: "FIXED_PERCENTAGE",
    name: "10% Off On Entire Order",
    percentage: "10",
    scope: "ORDER",
  },
];

export const ORDER_LEVEL_TAXES: OrderTax[] = [
  {
    type: "ADDITIVE",
    name: "Trade Tax On Entire Order",
    percentage: "11",
    scope: "ORDER",
  },
];
