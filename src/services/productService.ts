// this is a function that fetches products from the Square API
// it takes an access token and a params object
// the params object is an object with the query parameters
// the function returns the data from the API

export async function fetchProducts(
  accessToken: string,
  params?: Record<string, any>
) {
  if (!accessToken) {
    return null;
  }

  if (params) {
    const setQuery = params.query?.set_query; // * for filter by category
    const textQuery = params.query?.text_query; // * for search by keyword

    let query = undefined;

    if (setQuery && textQuery) {
      // * combine both queries
      query = {
        set_query: setQuery,
        text_query: textQuery,
      };
    } else if (setQuery) {
      query = { set_query: setQuery };
    } else if (textQuery) {
      query = { text_query: textQuery };
    }

    const body = {
      object_types: params.types
        .split(",")
        .map((t: string) => t.trim().toUpperCase()),
      query: query,
      include_related_objects: true,
    };

    const response = await fetch("/api/products/searchCatalog", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
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
