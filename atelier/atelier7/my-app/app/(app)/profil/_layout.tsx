import { Stack } from "expo-router";

export default function ProfilLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#1a3a6b" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Mon profil" }} />
      <Stack.Screen name="parametres" options={{ title: "Paramètres" }} />
    </Stack>
  );
}
