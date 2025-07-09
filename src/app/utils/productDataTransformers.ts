// Types for data transformation
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

export interface PricingRuleData {
  id: string;
  discount_id: string;
  match_products_id: string;
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

export interface DiscountApplication {
  discount_id: string;
  discount_name: string;
  discount_value: string | number | null;
  applied_product_ids: string[];
}

/**
 * Transforms raw tax objects into structured tax data
 */
export function transformTaxes(taxes: any[]): TaxData[] {
  return taxes.map((tax: any) => ({
    id: tax.id,
    name: tax.tax_data.name,
    percentage: parseFloat(tax.tax_data.percentage),
    enabled: tax.tax_data.enabled,
  }));
}

/**
 * Transforms raw discount objects into structured discount data
 */
export function transformDiscounts(discounts: any[]): DiscountData[] {
  return discounts.map((discount: any) => {
    const { id, discount_data } = discount;
    const base = {
      id,
      name: discount_data.name,
      type: discount_data.discount_type,
      modify_tax_basis: "MODIFY_TAX_BASIS",
    };

    if (discount_data.percentage !== undefined) {
      return {
        ...base,
        percentage: parseFloat(discount_data.percentage),
      };
    } else if (discount_data.amount_money?.amount !== undefined) {
      return {
        ...base,
        amount: discount_data.amount_money.amount,
      };
    } else {
      return base;
    }
  });
}

/**
 * Transforms raw pricing rule objects into structured pricing rule data
 */
export function transformPricingRules(pricingRules: any[]): PricingRuleData[] {
  return pricingRules.map((pricing_rule: any) => ({
    id: pricing_rule.id,
    discount_id: pricing_rule.pricing_rule_data.discount_id,
    match_products_id: pricing_rule.pricing_rule_data.match_products_id,
  }));
}

/**
 * Transforms raw product set objects into structured product set data
 */
export function transformProductSets(productSets: any[]): ProductSetData[] {
  return productSets.map((product_set: any) => ({
    id: product_set.id,
    all_products: product_set.product_set_data.all_products || false,
    product_ids_all: product_set.product_set_data.product_ids_all || undefined,
    product_ids_any: product_set.product_set_data.product_ids_any || undefined,
  }));
}

/**
 * Transforms raw category objects into structured category data
 */
export function transformCategories(categories: any[]): CategoryObject[] {
  return categories.map((category: any) => ({
    id: category.id,
    name: category.category_data?.name,
  }));
}

/**
 * Creates a map from discount IDs to product set IDs
 */
export function createDiscountToProductSetMap(pricingRules: PricingRuleData[]) {
  return pricingRules.map((rule) => ({
    discount_id: rule.discount_id,
    product_set_id: rule.match_products_id,
  }));
}


