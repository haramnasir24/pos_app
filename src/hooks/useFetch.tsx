import { API_CONFIG } from "@/constants/api";
import { useState, useEffect } from "react";
import { apiFetch } from "@/utils/apiFetch";

/**
 * Custom hook for making API requests with consistent headers
 * @param url - The API endpoint URL
 * @param body - The request body (optional)
 * @param options - Additional fetch options (optional)
 * @returns Object containing data, loading state, error state, and refetch function
 */
export const useFetch = <T = any,>(
  url: string,
  body?: any,
  options?: {
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    enabled?: boolean;
    accessToken?: string;
  }
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!url) return;

    setLoading(true);
    setError(null);

    try {
      const fetchOptions: RequestInit = {
        method: options?.method || (body ? "POST" : "GET"),
      };
      if (body && fetchOptions.method !== "GET") {
        fetchOptions.body = JSON.stringify(body);
      }
      const result = await apiFetch<T>(url, fetchOptions, options?.accessToken);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (options?.enabled !== false) {
      fetchData();
    }
  }, [url, JSON.stringify(body), options?.enabled]);

  const refetch = () => {
    fetchData();
  };

  return {
    data,
    loading,
    error,
    refetch,
  };
};
