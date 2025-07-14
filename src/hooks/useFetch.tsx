import { useState, useEffect } from "react";

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

  // Default headers - you can customize these based on your needs
  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    "Square-Version": "2024-01-17", // Update this to your Square API version
  };

  // Add authorization header if accessToken is provided
  if (options?.accessToken) {
    defaultHeaders.Authorization = `Bearer ${options.accessToken}`;
  }

  const fetchData = async () => {
    if (!url) return;

    setLoading(true);
    setError(null);

    try {
      const fetchOptions: RequestInit = {
        method: options?.method || (body ? "POST" : "GET"),
        headers: defaultHeaders,
        ...options,
      };

      if (body && fetchOptions.method !== "GET") {
        fetchOptions.body = JSON.stringify(body);
      }

      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
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
