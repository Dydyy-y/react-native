import { StyleSheet, View } from "react-native";
import ProductsList from "./components/ProductsList";
import { useState } from "react";
import ProductDetails from "./components/ProductDetails";
import { CartProvider } from "./contexts/cart/CartContext";
import { ThemeProvider } from "./contexts/theme/ThemeContext";
import { NotificationProvider } from "./contexts/notification/NotificationContext";

const App = () => {
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null,
  );

  return (
    <NotificationProvider>
      <ThemeProvider>
        <CartProvider>
          <View style={styles.container}>
            {selectedProductId ? (
              <ProductDetails
                productId={selectedProductId}
                onBack={() => setSelectedProductId(null)}
              />
            ) : (
              <ProductsList
                onSelectProduct={(id: number) => setSelectedProductId(id)}
              />
            )}
          </View>
        </CartProvider>
      </ThemeProvider>
    </NotificationProvider>
  );
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

export default App;
