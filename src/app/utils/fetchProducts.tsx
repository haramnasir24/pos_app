// this is a function that fetches products from the Square API
// it takes an access token and a params object
// the params object is an object with the query parameters
// the function returns the data from the API

export async function fetchProducts(
  accessToken: string,
  params?: Record<string, string>
) {
  if (params) {
    const body = {
      object_types: params.types.split(",").map((t) => t.trim().toUpperCase()),
      // include_related_objects: true,
    };

    const response = await fetch("/api/products/searchCatalog", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch products(1)");
    }

    const data = await response.json();
    return data;
  }
  return null;
}
