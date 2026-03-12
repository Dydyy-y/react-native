import { Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ProductsLayout = () => {
  const insets = useSafeAreaInsets();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          paddingTop: insets.top,
          paddingHorizontal: 20,
          backgroundColor: "#fff",
        },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="[id]" />
    </Stack>
  );
};

export default ProductsLayout;
