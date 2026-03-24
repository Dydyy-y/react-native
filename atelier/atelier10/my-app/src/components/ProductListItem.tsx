import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Product } from "../types/products.type";
import { formatPrice } from "../utils/price.utils";

export interface ProductListItemProps {
  product: Product;
  onPress?: (id: number) => void;
}

const ProductListItem = ({
  product: { id, title, price, thumbnail, discountPercentage, brand },
  onPress,
}: ProductListItemProps) => {
  return (
    <Pressable style={styles.container} onPress={() => onPress?.(id)}>
      <View style={styles.topContainer}>
        <View style={styles.thumbnailContainer}>
          <Image source={{ uri: thumbnail }} style={styles.thumbnail} />
          {discountPercentage && (
            <View style={styles.discountTag}>
              <Text style={styles.discountTagText}>-{discountPercentage}%</Text>
            </View>
          )}
        </View>
        <View style={styles.infoContainer}>
          <Text
            style={[
              styles.price,
              !!discountPercentage && { textDecorationLine: "line-through" },
            ]}
          >
            {formatPrice(price)}
          </Text>
          {discountPercentage && (
            <Text style={styles.discountPrice}>
              {formatPrice(price - price * (discountPercentage / 100))}
            </Text>
          )}
          <Text style={styles.brand}>{brand}</Text>
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </Pressable>
  );
};

export default ProductListItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5F6FA",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
    height: 140,
    padding: 10,
    marginVertical: 4,
    gap: 4,
  },
  topContainer: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  thumbnailContainer: {
    position: "relative",
    width: 90,
    height: 90,
    justifyContent: "center",
    alignItems: "center",
  },
  thumbnail: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: "#E1E3E6",
    resizeMode: "cover",
  },
  discountTag: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "#2E9B7A",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    zIndex: 2,
    minWidth: 40,
    alignItems: "center",
  },
  discountTagText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  infoContainer: {
    flex: 1,
    gap: 4,
    justifyContent: "center",
  },
  price: {
    textAlign: "right",
    fontSize: 16,
    fontWeight: "600",
    color: "#22223B",
  },
  discountPrice: {
    textAlign: "right",
    color: "#2E9B7A",
    fontSize: 14,
    fontWeight: "500",
  },
  bottomContainer: {
    marginTop: 6,
  },
  brand: {
    textAlign: "right",
    color: "#6C6C6C",
    fontSize: 11,
    fontWeight: "400",
    marginTop: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#22223B",
    letterSpacing: 0.5,
    textAlign: "left",
  },
});
