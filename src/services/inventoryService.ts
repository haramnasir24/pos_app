export async function fetchInventory(
  accessToken: string,
  variationIds: string[]
) {
  if (!accessToken) {
    return null;
  }
  if (!variationIds || variationIds.length === 0) return;

  try {
    const response = await fetch("/api/inventory_counts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ variationIds }),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Failed to fetch inventory counts: ", err);
  }
}
