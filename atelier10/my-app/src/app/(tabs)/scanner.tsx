import { CameraView, useCameraPermissions } from "expo-camera";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const ScannerView = () => {
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>
          L'accès à la caméra est nécessaire pour scanner un QR code.
        </Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Autoriser la caméra</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing="back" />
      <View style={styles.resultContainer}>
        <Text style={styles.resultLabel}>Résultat du scan</Text>
        <Text style={styles.resultText}>Aucun QR code détecté</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },
  resultContainer: {
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
  },
  resultLabel: {
    fontSize: 12,
    color: "#888",
    marginBottom: 4,
  },
  resultText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  permissionText: {
    color: "#fff",
    textAlign: "center",
    marginHorizontal: 32,
    marginBottom: 24,
    fontSize: 15,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
});

export default ScannerView;
