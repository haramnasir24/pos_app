"use client";

import { useEffect, useState } from "react";

interface Discount {
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

interface UseDiscountsReturn {
  discounts: Discount[];
  isLoading: boolean;
  error: string | null;
}

export function useDiscounts(accessToken: string): UseDiscountsReturn {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) {
      setDiscounts([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    async function fetchDiscounts() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/discounts", {
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
        setDiscounts(data.objects || []);
      } catch (err: any) {
        console.error("Failed to fetch discounts:", err);
        setError(err.message || "Failed to fetch discounts");
      } finally {
        setIsLoading(false);
      }
    }

    fetchDiscounts();
  }, [accessToken]);

  return {
    discounts,
    isLoading,
    error,
  };
}
