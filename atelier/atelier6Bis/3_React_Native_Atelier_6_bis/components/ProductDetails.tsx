import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import useProduct from "../hooks/useProduct";
import { Ionicons } from "@expo/vector-icons";
import BackButton from "./BackButton";

export interface ProductDetailsProps {
  productId: number;
  onBack: () => void;
}

const ProductDetails = ({ productId, onBack }: ProductDetailsProps) => {
  const { product, loading, error } = useProduct(productId);

  if (loading || !product) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#575757" />
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error ?? "Aucun produit à afficher"}</Text>
        <BackButton onPress={onBack} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton onPress={onBack} />
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          {/* Main product info */}
          <Image
            source={{ uri: product.thumbnail }}
            style={{ width: "100%", height: 200, borderRadius: 8 }}
            resizeMode="cover"
          />
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.brand}>{product.brand}</Text>
          <Text style={styles.category}>{product.category}</Text>
          <Text style={styles.price}>{product.price.toFixed(2)} €</Text>
          <Text style={styles.rating}>
            {Array.from({ length: product.rating }, (_, i) => "★").join("")}
            {Array.from({ length: 5 - product.rating }, (_, i) => "☆").join("")}
            ({product.rating})
          </Text>
          <Text style={styles.stock}>Stock : {product.stock}</Text>
          <Text style={styles.description}>{product.description}</Text>

          {/* Images */}
          {product.images?.length > 0 && (
            <>
              {product.images.map((img) => (
                <View key={img} style={styles.imageWrapper}>
                  <Image
                    source={{ uri: img }}
                    style={{ width: "100%", height: "100%", borderRadius: 8 }}
                    resizeMode="cover"
                  />
                </View>
              ))}
            </>
          )}
        </View>

        {/* Technical details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Détails techniques</Text>
          <Text>
            Dimensions : {product.dimensions.width} x{" "}
            {product.dimensions.height} x {product.dimensions.depth} cm
          </Text>
          <Text>Poids : {product.weight} kg</Text>
          <Text>Garantie : {product.warrantyInformation}</Text>
          <Text>Livraison : {product.shippingInformation}</Text>
          <Text>Statut : {product.availabilityStatus}</Text>
          <Text>SKU : {product.sku}</Text>
          <Text>Code-barres : {product.meta.barcode}</Text>

          {/* Tags */}
          <View style={styles.tagsContainer}>
            {product.tags.map((tag) => (
              <Text key={tag} style={styles.tag}>
                {tag}
              </Text>
            ))}
          </View>
        </View>

        {/* Reviews */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Avis</Text>
          <View style={styles.reviewsContainer}>
            {product.reviews.length === 0 ? (
              <Text>Aucun avis pour ce produit.</Text>
            ) : (
              product.reviews.map((review) => (
                <View
                  key={`${review.date}-${review.reviewerEmail}`}
                  style={styles.review}
                >
                  <Text style={styles.reviewRating}>
                    Note : {review.rating} / 5
                  </Text>
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                  <Text style={styles.reviewMeta}>
                    Par {review.reviewerName} le {review.date}
                  </Text>
                </View>
              ))
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Politique de retour</Text>
          <Text>{product.returnPolicy}</Text>
          <Text style={styles.sectionTitle}>Quantité minimale de commande</Text>
          <Text>{product.minimumOrderQuantity}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProductDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingBottom: 10,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: 40,
  },
  section: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  error: {
    color: "red",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
    marginTop: 10,
  },
  brand: {
    fontSize: 16,
    color: "#888",
    marginBottom: 2,
  },
  category: {
    fontSize: 14,
    color: "#aaa",
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    color: "#2a9d8f",
    fontWeight: "bold",
    marginBottom: 4,
  },
  rating: {
    fontSize: 16,
    color: "#f4a261",
    marginBottom: 2,
  },
  stock: {
    fontSize: 14,
    color: "#264653",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  imagesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  imageWrapper: {
    width: 60,
    height: 60,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 8,
  },
  imagePlaceholder: {
    color: "#bbb",
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 4,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  tag: {
    backgroundColor: "#e9c46a",
    color: "#fff",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 6,
    marginBottom: 4,
    fontSize: 12,
  },
  reviewsContainer: {
    marginBottom: 10,
  },
  review: {
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
    padding: 8,
    marginBottom: 6,
  },
  reviewRating: {
    fontWeight: "bold",
    color: "#f4a261",
  },
  reviewComment: {
    fontStyle: "italic",
    marginBottom: 2,
  },
  reviewMeta: {
    fontSize: 12,
    color: "#888",
  },
});
