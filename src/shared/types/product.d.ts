export interface Money {
  amount: number;
  currency: string;
}

export interface ProductVariationData {
  price_money: Money;
}

export interface ProductVariation {
  id: string;
  type: "ITEM_VARIATION";
  item_variation_data: ProductVariationData;
}

export interface ProductCategory {
  id: string;
}

export interface ProductItemData {
  name: string;
  variations: ProductVariation[];
  image_ids: string[];
  is_taxable: boolean;
  tax_ids: string[];
  categories: ProductCategory[];
}

export interface Product {
  id: string;
  type: "ITEM";
  item_data: ProductItemData;
}

export interface Image {
  id: string;
  type: "IMAGE";
  image_data: {
    url: string;
  };
}

export interface Tax {
  id: string;
  type: "TAX";
  tax_data: TaxData;
}

export interface Discount {
  id: string;
  discount_data: {
    name: string;
    discount_type: string;
    percentage?: string;
    amount_money?: {
      amount: number;
    };
  };
}

interface PricingRule {
  id: string;
  pricing_rule_data: {
    discount_id: string;
    match_products_id: string;
  };
}

export interface CatalogObject {
  id: string;
  type:
    | "ITEM"
    | "IMAGE"
    | "CATEGORY"
    | "TAX"
    | "DISCOUNT"
    | "PRICING_RULE"
    | "PRODUCT_SET";
  [key: string]: any;
}

export interface ProductCatalog {
  objects: CatalogObject[];
}

export interface Inventory {
  state: string;
  quantity: string;
}

export interface InventoryMap {
  [variationId: string]: Inventory;
}

export interface ImageMap {
  [imageId: string]: string;
}

export interface TransformedTax {
  id: string;
  name: string;
  percentage: number;
}

export interface TaxData {
  id: string;
  name: string;
  percentage: number;
  enabled: boolean;
}

export interface DiscountData {
  id: string;
  name: string;
  type: string;
  modify_tax_basis: string;
  percentage?: number;
  amount?: number;
}

interface UseDiscountsReturn {
  discounts: Discount[];
  isLoading: boolean;
  error: string | null;
}

export interface DiscountApplication {
  discount_id: string;
  discount_name: string;
  discount_value: string | number | null;
  applied_product_ids: string[];
}

export interface ProductSetData {
  id: string;
  all_products: boolean;
  product_ids_all?: string[];
  product_ids_any?: string[];
}

export interface CategoryObject {
  id: string;
  name: string;
}

interface UsePricingRulesReturn {
  pricingRules: PricingRule[];
  isLoading: boolean;
  error: string | null;
}

export interface PricingRuleData {
  id: string;
  discount_id: string;
  match_products_id: string;
}

interface ProductSet {
  id: string;
  product_set_data: {
    all_products?: boolean;
    product_ids_all?: string[];
    product_ids_any?: string[];
  };
}

interface UseProductSetsReturn {
  productSets: ProductSet[];
  isLoading: boolean;
  error: string | null;
}
