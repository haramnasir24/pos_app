/**
 * Comprehensive API Types for Square API and local API endpoints
 */

// Base API Response Types
export interface ApiResponse<T = any> {
  data: T;
  status: number;
  ok: boolean;
  message?: string;
}

export interface ApiError {
  error: string;
  details?: any;
  status: number;
}

// Square API Request Types
export interface SquareApiRequest {
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  accessToken: string;
}

// Square API Response Types
export interface SquareApiResponse<T = any> {
  data: T;
  status: number;
  ok: boolean;
}

// Catalog Types
export interface CatalogSearchRequest {
  object_types: string[];
  query?: any;
  include_related_objects?: boolean;
  cursor?: string;
  limit?: number;
}

export interface CatalogObject {
  type: string;
  id: string;
  present_at_all_locations?: boolean;
  item_data?: ItemData;
  category_data?: CategoryData;
  discount_data?: DiscountData;
  pricing_rule_data?: PricingRuleData;
  product_set_data?: ProductSetData;
  image_data?: ImageData;
}

export interface ItemData {
  name: string;
  description?: string;
  categories?: Array<{ id: string }>;
  image_ids?: string[];
  is_taxable?: boolean;
  variations?: ItemVariation[];
}

export interface ItemVariation {
  type: string;
  id: string;
  present_at_all_locations?: boolean;
  item_variation_data: {
    item_id: string;
    name: string;
    sellable?: boolean;
    stockable?: boolean;
    track_inventory?: boolean;
    pricing_type: string;
    price_money?: {
      amount: number;
      currency: string;
    };
  };
}

export interface CategoryData {
  name: string;
}

export interface DiscountData {
  name: string;
  discount_type: string;
  percentage?: string;
  amount_money?: {
    amount: number;
    currency: string;
  };
}

export interface PricingRuleData {
  name: string;
  pricing_rule_type: string;
}

export interface ProductSetData {
  name: string;
  product_ids_any?: string[];
  product_ids_all?: string[];
}

export interface ImageData {
  caption?: string;
  name?: string;
}

// Order Types
export interface OrderRequest {
  order: {
    location_id: string;
    line_items: OrderLineItem[];
    discounts?: OrderDiscount[];
    taxes?: OrderTax[];
  };
  idempotency_key?: string;
}

export interface OrderLineItem {
  name: string;
  quantity: string;
  base_price_money: {
    amount: number;
    currency: string;
  };
  catalog_object_id?: string;
  variation_name?: string;
}

export interface OrderDiscount {
  catalog_object_id?: string;
  name?: string;
  percentage?: string;
  amount_money?: {
    amount: number;
    currency: string;
  };
}

export interface OrderTax {
  catalog_object_id?: string;
  name?: string;
  percentage?: string;
  applied_money?: {
    amount: number;
    currency: string;
  };
}

export interface OrderResponse {
  order: {
    id: string;
    location_id: string;
    line_items: OrderLineItem[];
    total_money: {
      amount: number;
      currency: string;
    };
    total_tax_money: {
      amount: number;
      currency: string;
    };
    total_discount_money: {
      amount: number;
      currency: string;
    };
    created_at: string;
    updated_at: string;
  };
}

// Inventory Types
export interface InventoryCountRequest {
  catalog_object_ids: string[];
  location_ids?: string[];
}

export interface InventoryCount {
  catalog_object_id: string;
  location_id: string;
  quantity: string;
  calculated_at: string;
}

export interface InventoryCountResponse {
  counts: InventoryCount[];
  cursor?: string;
}

// Batch Upsert Types
export interface BatchUpsertRequest {
  idempotency_key: string;
  batches: Array<{
    objects: CatalogObject[];
  }>;
}

export interface BatchUpsertResponse {
  batches: Array<{
    objects: CatalogObject[];
  }>;
}

// Image Upload Types
export interface ImageUploadRequest {
  image: {
    image_data: {
      caption?: string;
      name?: string;
    };
    type: string;
    id: string;
  };
  idempotency_key: string;
  is_primary?: boolean;
}

export interface ImageUploadResponse {
  image: {
    id: string;
    type: string;
    image_data: {
      url: string;
      caption?: string;
      name?: string;
    };
  };
}

// Local API Request Types
export interface LocalApiRequest {
  accessToken: string;
  [key: string]: any;
}

export interface DiscountsRequest extends LocalApiRequest {}

export interface PricingRulesRequest extends LocalApiRequest {}

export interface ProductSetsRequest extends LocalApiRequest {}

export interface CreateOrderRequest extends LocalApiRequest {
  orderData: OrderRequest;
}

export interface CalculateOrderRequest extends LocalApiRequest {
  orderData: OrderRequest;
}

export interface InventoryCountsRequest extends LocalApiRequest {
  variationIds: string[];
  locationIds?: string[];
}

export interface SearchCatalogRequest extends LocalApiRequest {
  object_types: string[];
  query?: any;
  include_related_objects?: boolean;
}

export interface BatchUpsertRequestLocal extends LocalApiRequest {
  // Additional local-specific fields if needed
}

// Hook Types
export interface UseFetchOptions<T = any> {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: T;
  headers?: Record<string, string>;
  accessToken?: string;
  enabled?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: ApiError) => void;
}

export interface UseFetchResult<T = any> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
  refetch: () => void;
  mutate: (data: T) => void;
} 