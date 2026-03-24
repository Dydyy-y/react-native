import { Stack } from "expo-router";

export default function VirementsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#1a3a6b" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Virements" }} />
      <Stack.Screen name="nouveau" options={{ title: "Nouveau virement" }} />
      <Stack.Screen name="historique" options={{ title: "Historique" }} />
      <Stack.Screen name="beneficiaires" options={{ title: "Bénéficiaires" }} />
    </Stack>
  );
}
