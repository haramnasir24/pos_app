import { ProductSet, UseProductSetsReturn } from "@/shared/types/product";
import { useEffect, useState } from "react";

export function useProductSets(accessToken: string): UseProductSetsReturn {
  const [productSets, setProductSets] = useState<ProductSet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) {
      setProductSets([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    async function fetchProductSets() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/product-sets", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            accessToken,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setProductSets(data.objects || []);
      } catch (err: any) {
        console.error("Failed to fetch product sets:", err);
        setError(err.message || "Failed to fetch product sets");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProductSets();
  }, [accessToken]);

  return {
    productSets,
    isLoading,
    error,
  };
}
