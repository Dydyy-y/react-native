import { Stack } from "expo-router";

export default function ComptesLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#1a3a6b" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Mes comptes" }} />
      <Stack.Screen name="[id]" options={{ title: "Détail du compte" }} />
    </Stack>
  );
}
