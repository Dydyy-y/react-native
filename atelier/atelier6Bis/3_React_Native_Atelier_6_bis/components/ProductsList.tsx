import { FlatList } from "react-native";
import useProducts from "../hooks/useProducts";
import ProductListItem from "./ProductListItem";

export interface ProductsListProps {
  onSelectProduct?: (id: number) => void;
}

const ProductsList = ({ onSelectProduct }: ProductsListProps) => {
  const { products, loading, error, refresh, loadNextPage } = useProducts();

  return (
    <FlatList
      data={products}
      renderItem={({ item }) => (
        <ProductListItem product={item} onPress={onSelectProduct} />
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
