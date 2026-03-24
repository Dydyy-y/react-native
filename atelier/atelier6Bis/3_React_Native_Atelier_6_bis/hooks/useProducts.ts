import { useEffect, useState } from "react";
import { Product } from "../types/products.type";

const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  const getProducts = async () => {
    setLoading(true);

    try {
      const limit = 10;
      const skip = limit * page;
      const response = await fetch(
        `https://dummyjson.com/products?limit=${limit}&skip=${skip}`,
      );

      if (response.status !== 200) throw new Error("Unexpected status code");

      const data = await response.json();
      setProducts([...products, ...data.products]);
    } catch (e) {
      const message =
        e instanceof Error
          ? e.message
          : "Une erreur s'est produite lors du chargement des produits";
      console.error(message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, [page]);

  return {
    products,
    loading,
    error,
    refresh: getProducts,
    loadNextPage: () => setPage(page + 1),
  };
};

export default useProducts;
