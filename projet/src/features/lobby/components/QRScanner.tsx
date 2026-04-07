import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { COLORS } from '../../../shared/utils/constants';

interface QRScannerProps {
  onScanned: (code: string) => void;
}

/** Scanner QR code via la caméra (expo-camera CameraView) */
export const QRScanner = ({ onScanned }: QRScannerProps) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const processedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup du timeout au demontage
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleBarCodeScanned = (result: BarcodeScanningResult) => {
    // Empêcher les scans multiples
    if (processedRef.current) return;
    processedRef.current = true;
    setScanned(true);
    onScanned(result.data);
  };

  const handleScanAgain = () => {
    // Delai de 1.5s pour laisser le temps de retirer le QR du cadre
    timerRef.current = setTimeout(() => {
      processedRef.current = false;
      setScanned(false);
    }, 1500);
  };

  // Permission non encore demandée
  if (!permission) {
    return (
      <View style={styles.centered}>
        <Text style={styles.text}>Chargement de la camera...</Text>
      </View>
    );
  }

  // Permission refusée
  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <Text style={styles.text}>
          L'acces a la camera est necessaire pour scanner le QR code
        </Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Autoriser la camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      />

      {/* Overlay avec cadre de scan */}
      <View style={styles.overlay}>
        <View style={styles.scanFrame} />
        <Text style={styles.hint}>
          {scanned ? 'QR Code detecte !' : 'Placez le QR Code dans le cadre'}
        </Text>
      </View>

      {scanned && (
        <TouchableOpacity style={styles.retryButton} onPress={handleScanAgain}>
          <Text style={styles.buttonText}>Scanner a nouveau</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: COLORS.info,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  hint: {
    color: COLORS.white,
    fontSize: 14,
    marginTop: 20,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  text: {
    color: COLORS.text,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: COLORS.info,
    borderRadius: 8,
    padding: 14,
    paddingHorizontal: 24,
  },
  retryButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: COLORS.info,
    borderRadius: 8,
    padding: 14,
    paddingHorizontal: 24,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
