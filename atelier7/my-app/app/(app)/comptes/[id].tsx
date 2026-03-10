import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import mockData from "../../../data/mock";

export default function CompteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const compte = mockData.comptes.find((c: any) => c.id === id);

  if (!compte) {
    return (
      <View style={styles.container}>
        <Text>Compte introuvable.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.carte}>
        <Text style={styles.type}>{compte.type}</Text>
        <Text style={styles.solde}>
          {compte.solde.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
        </Text>
      </View>
      <View style={styles.infos}>
        <View style={styles.ligne}>
          <Text style={styles.label}>Numéro de compte</Text>
          <Text style={styles.valeur}>{compte.numero}</Text>
        </View>
        <View style={styles.ligne}>
          <Text style={styles.label}>IBAN</Text>
          <Text style={styles.valeur}>{compte.iban}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f4ff", padding: 16 },
  carte: {
    backgroundColor: "#1a3a6b",
    borderRadius: 14,
    padding: 24,
    marginBottom: 16,
    alignItems: "center",
  },
  type: { color: "#adc4e8", fontSize: 14, marginBottom: 8 },
  solde: { color: "#fff", fontSize: 32, fontWeight: "bold" },
  infos: { backgroundColor: "#fff", borderRadius: 12, padding: 16 },
  ligne: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#eee" },
  label: { fontSize: 12, color: "#999", marginBottom: 2 },
  valeur: { fontSize: 15, color: "#1a1a1a" },
});
