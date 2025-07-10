export type OrderDiscount = {
  name: string;
  percentage?: string;
  amount?: number;
  scope: "ORDER" | "LINE_ITEM";
  type: "FIXED_PERCENTAGE" | "FIXED_AMOUNT";
};

export type OrderTax = {
  name: string;
  percentage: string;
  scope: "ORDER" | "LINE_ITEM";
  type: "ADDITIVE" | "INCLUSIVE";
};
