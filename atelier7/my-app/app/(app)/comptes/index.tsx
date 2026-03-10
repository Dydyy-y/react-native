import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import mockData from "../../../data/mock";

export default function ComptesScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <FlatList
        data={mockData.comptes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.liste}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.carte}
              onPress={() => router.push(`/comptes/${item.id}` as any)}
          >
            <Text style={styles.type}>{item.type}</Text>
            <Text style={styles.numero}>{item.numero}</Text>
            <Text style={styles.solde}>
              {item.solde.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f4ff" },
  liste: { padding: 16 },
  carte: {
    backgroundColor: "#1a3a6b",
    borderRadius: 14,
    padding: 20,
    marginBottom: 16,
  },
  type: { color: "#adc4e8", fontSize: 13, marginBottom: 4 },
  numero: { color: "#fff", fontSize: 15, marginBottom: 8 },
  solde: { color: "#fff", fontSize: 24, fontWeight: "bold" },
});
