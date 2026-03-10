import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import mockData from "../data/mock";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");

  function handleConnexion() {
    if (
      email === mockData.credentials.email &&
      motDePasse === mockData.credentials.motDePasse
    ) {
      router.replace("/comptes" as any);
    } else {
      Alert.alert("Erreur", "Email ou mot de passe incorrect.");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titre}>La banque juive</Text>
      <Text style={styles.sousTitre}>Connexion à VOTRE espace</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        placeholderTextColor="#999"
        value={motDePasse}
        onChangeText={setMotDePasse}
        secureTextEntry
      />

      <TouchableOpacity style={styles.bouton} onPress={handleConnexion}>
        <Text style={styles.boutonTexte}>Se connecter</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f4ff",
    padding: 24,
  },
  titre: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1a3a6b",
    marginBottom: 8,
  },
  sousTitre: {
    fontSize: 16,
    color: "#555",
    marginBottom: 40,
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccd5e0",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
    color: "#1a1a1a",
  },
  bouton: {
    width: "100%",
    backgroundColor: "#1a3a6b",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  boutonTexte: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
