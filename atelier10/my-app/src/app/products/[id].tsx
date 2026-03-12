import ProductDetails from "@/components/ProductDetails";
import { useLocalSearchParams, useRouter } from "expo-router";

const ProductView = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  console.log(id);

  return (
    <ProductDetails productId={parseInt(id)} onBack={() => router.back()} />
  );
};

export default ProductView;
