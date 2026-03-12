import { CameraView, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

const ScannerView = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedId, setScannedId] = useState<string | null>(null);
  const router = useRouter();

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
      <CameraView
        style={styles.camera}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={scannedId ? undefined : ({ data }) => setScannedId(data)}
      />

      <View style={styles.resultContainer}>
        {scannedId ? (
          <>
            <Text style={styles.resultLabel}>Produit détecté — ID : {scannedId}</Text>
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={() => setScannedId(null)}
              >
                <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                  Scanner à nouveau
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => router.push(`/products/${scannedId}`)}
              >
                <Text style={styles.buttonText}>Voir le produit</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <Text style={styles.resultLabel}>Pointez la caméra vers un QR code…</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  resultContainer: {
    backgroundColor: "#fff",
    width: "100%",
    padding: 20,
    alignItems: "center",
    minHeight: 100,
    justifyContent: "center",
  },
  resultLabel: {
    fontSize: 13,
    color: "#888",
    marginBottom: 12,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  secondaryButtonText: {
    color: "#007AFF",
  },
  permissionText: {
    color: "#fff",
    textAlign: "center",
    marginHorizontal: 32,
    marginBottom: 24,
    fontSize: 15,
  },
});

export default ScannerView;
