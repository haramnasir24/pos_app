import { promises as fs } from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Helper to map a product to Square CatalogObject format, accepts imageId
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
            item_id: `#${product.sku}`, // same as id of actual item
            name: product.title,
            sellable: true,
            stockable: true,
            track_inventory: true,
            pricing_type: "FIXED_PRICING",
            price_money: {
              amount: Math.round(product.price * 100), // Square expects cents
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

  // read data.json
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
  const imageIdsPath = path.join(process.cwd(), "src/app/constant/square_image_ids.json");
  let imageIdMap: Record<string, string> = {};
  try {
    const imageIdFile = await fs.readFile(imageIdsPath, "utf-8");
    imageIdMap = JSON.parse(imageIdFile);
  } catch (err) {
    imageIdMap = {};
  }

  // Collect unique categories
  const uniqueCategories = Array.from(new Set(products.map((p: any) => p.category)));

  // Create category catalog objects
  const categoryObjects = uniqueCategories.map(category => ({
    type: "CATEGORY",
    id: `#${category}`,
    present_at_all_locations: true,
    category_data: {
      name: category
    }
  }));

  // Add both category objects and product objects to the batch
  const objects = [
    ...categoryObjects,
    ...products.map((product: any) => {
      // Try to find a matching image ID by SKU
      // The imageIdMap keys are filenames like SKU_0.jpg
      const imageKey = Object.keys(imageIdMap).find(key => key.startsWith(product.sku));
      const imageId = imageKey ? imageIdMap[imageKey] : undefined;
      return mapProductToCatalogObject(product, imageId);
    })
  ];

  // Square allows up to 1000 objects per batch
  const batch = { objects };
  console.log(batch);

  const body = {
    idempotency_key: uuidv4(),
    batches: [batch],
  };

  const res = await fetch(
    "https://connect.squareupsandbox.com/v2/catalog/batch-upsert",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Square-Version": "2025-06-18",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  const data = await res.json();
  console.log(data);
  if (!res.ok) {
    return NextResponse.json({ error: data }, { status: res.status });
  }
  return NextResponse.json(data, { status: res.status });
}
