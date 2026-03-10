import { useState, useEffect, useCallback } from 'react';
import { Product, ApiResponse } from '../types/product';

const BASE_URL = 'https://dummyjson.com';
const PAGE_SIZE = 20;

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [skip, setSkip] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async (currentSkip: number, replace = false) => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      const url = `${BASE_URL}/products?limit=${PAGE_SIZE}&skip=${currentSkip}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }
      const data: ApiResponse = await response.json();
      setProducts(prev => replace ? data.products : [...prev, ...data.products]);
      setHasMore(currentSkip + data.products.length < data.total);
      setSkip(currentSkip + data.products.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  useEffect(() => {
    fetchProducts(0, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      fetchProducts(skip);
    }
  }, [isLoading, hasMore, skip, fetchProducts]);

  return { products, isLoading, hasMore, error, loadMore };
}
