import { CameraView, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const ScannerView = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedId, setScannedId] = useState<string | null>(null);
  const [torchEnabled, setTorchEnabled] = useState(false);
  const [zoom, setZoom] = useState(0);
  const router = useRouter();

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    setScannedId(data);
  };

  const handleReset = () => {
    setScannedId(null);
  };

  const handleNavigate = () => {
    router.push(`/products/${scannedId}`);
  };

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
        enableTorch={torchEnabled}
        zoom={zoom}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={scannedId ? undefined : handleBarcodeScanned}
      />

      <TouchableOpacity
        style={styles.torchButton}
        onPress={() => setTorchEnabled(!torchEnabled)}
      >
        <Ionicons
          name={torchEnabled ? "flash" : "flash-off"}
          size={28}
          color="#fff"
        />
      </TouchableOpacity>

      <View style={styles.zoomControls}>
        <TouchableOpacity
          style={styles.zoomButton}
          onPress={() => setZoom((z) => Math.max(0, z - 0.1))}
        >
          <Ionicons name="remove" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.zoomLabel}>{Math.round(zoom * 100)}%</Text>
        <TouchableOpacity
          style={styles.zoomButton}
          onPress={() => setZoom((z) => Math.min(1, z + 0.1))}
        >
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.resultContainer}>
        {scannedId ? (
          <>
            <Text style={styles.resultLabel}>Produit détecté — ID : {scannedId}</Text>
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={handleReset}
              >
                <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                  Scanner à nouveau
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleNavigate}>
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
  torchButton: {
    position: "absolute",
    top: 56,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 30,
  },
  zoomControls: {
    position: "absolute",
    bottom: 140,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  zoomButton: {
    padding: 4,
  },
  zoomLabel: {
    color: "#fff",
    fontSize: 14,
    minWidth: 36,
    textAlign: "center",
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
