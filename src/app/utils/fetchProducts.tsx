// this is a function that fetches products from the Square API
// it takes an access token and a params object
// the params object is an object with the query parameters
// the function returns the data from the API


export async function fetchProducts(
  accessToken: string,
  params?: Record<string, string>
) {
  if (params) {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`/api/products?${query}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await response.json();
    return data;
  }
  return null;
}
