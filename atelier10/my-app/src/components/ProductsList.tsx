import { FlatList } from "react-native";
import useProducts from "@/hooks/useProducts";
import ProductListItem from "./ProductListItem";
import { useRouter } from "expo-router";

const ProductsList = () => {
  const { products, loading, error, refresh, loadNextPage } = useProducts();
  const router = useRouter();

  return (
    <FlatList
      data={products}
      renderItem={({ item }) => (
        <ProductListItem
          product={item}
          onPress={() => router.push(`products/${item.id}`)}
        />
      )}
      keyExtractor={({ id }) => id.toString()}
      onRefresh={refresh}
      refreshing={loading}
      showsVerticalScrollIndicator={false}
      onEndReached={loadNextPage}
      onEndReachedThreshold={0.5}
    />
  );
};

export default ProductsList;
