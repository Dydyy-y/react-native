import { useEffect, useState } from "react";
import { Product } from "../types/products.type";

const useProduct = (id: number) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProduct = async () => {
    setLoading(true);

    try {
      if (!id) throw new Error("Product ID is required");

      const response = await fetch(`https://dummyjson.com/products/${id}`);

      if (response.status !== 200) throw new Error("Unexpected status code");

      const data = await response.json();
      setProduct(data);
    } catch (e) {
      const message =
        e instanceof Error
          ? e.message
          : "Une erreur s'est produite lors du chargement du produit";
      console.error(message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProduct();
  }, [id]);

  return {
    product,
    loading,
    error,
    refresh: getProduct,
  };
};

export default useProduct;
