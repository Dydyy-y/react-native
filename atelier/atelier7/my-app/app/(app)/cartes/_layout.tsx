import { Stack } from "expo-router";

export default function CartesLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#1a3a6b" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Mes cartes" }} />
      <Stack.Screen name="[id]" options={{ title: "Détail de la carte" }} />
      <Stack.Screen name="opposition" options={{ title: "Faire opposition" }} />
      <Stack.Screen name="demande" options={{ title: "Demander une carte" }} />
      <Stack.Screen name="exemple" options={{ title: "Exemple 3 niveaux" }} />
    </Stack>
  );
}
