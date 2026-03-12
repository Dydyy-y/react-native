import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function App() {
  const [cameraActive, setCameraActive] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const handlePress = async () => {
    if (!permission?.granted) {
      await requestPermission();
    } else {
      setCameraActive(!cameraActive);
    }
  };

  return (
    <View style={styles.container}>
      {cameraActive && permission?.granted ? (
        <CameraView style={styles.camera} facing="back" />
      ) : null}

      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>
          {!permission?.granted
            ? 'Autoriser la caméra'
            : cameraActive
            ? 'Désactiver la caméra'
            : 'Activer la caméra'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
  button: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
    zIndex: 1,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
});
