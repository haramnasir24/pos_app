import { promises as fs } from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { apiFetch } from "@/shared/utils/apiFetch";
import { API_CONFIG } from "@/constants/api";

// * helper to map a product to Square CatalogObject format, accepts imageId
function mapProductToCatalogObject(product: any, imageId?: string) {
  return {
    type: "ITEM",
    id: `#${product.sku}`,
    present_at_all_locations: true,
    item_data: {
      name: product.title,
      description: product.description,
      categories: [
        {
          id: `#${product.category}`,
        },
      ],
      image_ids: imageId ? [imageId] : [],
      is_taxable: true,
      variations: [
        {
          type: "ITEM_VARIATION",
          id: `#${product.sku}_variation`,
          present_at_all_locations: true,
          item_variation_data: {
            item_id: `#${product.sku}`,
            name: product.title,
            sellable: true,
            stockable: true,
            track_inventory: true,
            pricing_type: "FIXED_PRICING",
            price_money: {
              amount: Math.round(product.price * 100),
              currency: "USD",
            },
          },
        },
      ],
    },
  };
}

export async function POST(req: NextRequest) {
  const accessToken = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!accessToken) {
    return NextResponse.json(
      { error: "Missing Authorization header" },
      { status: 401 }
    );
  }

  const filePath = path.join(process.cwd(), "src/app/constant/data.json");
  let products: any[];
  try {
    const file = await fs.readFile(filePath, "utf-8");
    const json = JSON.parse(file);
    products = json.products;
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to read data.json" },
      { status: 500 }
    );
  }

  // read square_image_ids.json to add image_ids to items
  const imageIdsPath = path.join(
    process.cwd(),
    "src/app/constant/square_image_ids.json"
  );
  let imageIdMap: Record<string, string> = {};
  try {
    const imageIdFile = await fs.readFile(imageIdsPath, "utf-8");
    imageIdMap = JSON.parse(imageIdFile);
  } catch (err) {
    imageIdMap = {};
  }

  // collect unique categories
  const uniqueCategories = Array.from(
    new Set(products.map((p: any) => p.category))
  );

  // create category catalog objects
  const categoryObjects = uniqueCategories.map((category) => ({
    type: "CATEGORY",
    id: `#${category}`,
    present_at_all_locations: true,
    category_data: {
      name: category,
    },
  }));

  // Add both category objects and product objects to the batch
  const objects = [
    ...categoryObjects,
    ...products.map((product: any) => {
      // Try to find a matching image ID by SKU
      const imageKey = Object.keys(imageIdMap).find((key) =>
        key.startsWith(product.sku)
      );
      const imageId = imageKey ? imageIdMap[imageKey] : undefined;
      return mapProductToCatalogObject(product, imageId);
    }),
  ];

  const batch = { objects };

  const body = {
    idempotency_key: uuidv4(),
    batches: [batch],
  };

  const url = `${API_CONFIG.SQUARE_BASE_URL}/v2/catalog/batch-upsert`;

  try {
    const data = await apiFetch(url, {
      method: "POST",
      body: JSON.stringify(body),
    }, accessToken);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to batch upsert products" },
      { status: 500 }
    );
  }
}
