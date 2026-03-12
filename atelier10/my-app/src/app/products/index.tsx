import { StyleSheet, View } from "react-native";
import ProductsList from "@/components/ProductsList";

const ProductsView = () => {
  return <ProductsList />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  text: { fontSize: 24 },
});

export default ProductsView;
