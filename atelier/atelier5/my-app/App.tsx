import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable, Linking, Alert, Share } from 'react-native';

export default function App() {
  const confirmAction = (message: string, onConfirm: () => void) => {
    Alert.alert(
      'Confirmation',
      message,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Continuer', onPress: onConfirm },
      ],
      { cancelable: true }
    );
  };

  const onPressFunction = () => {
    const phoneNumber = '+33635360758';
    const url = `tel:${phoneNumber}`;
    const contactName = 'Jean Dupont';
    confirmAction(
      `Voulez-vous appeler ${contactName} au ${phoneNumber} ?`,
      async () => {
        try {
          const supported = await Linking.canOpenURL(url);
          if (supported) {
            await Linking.openURL(url);
          } else {
            Alert.alert('Impossible d\'ouvrir le téléphone');
          }
        } catch (err) {
          console.error('Linking error', err);
          Alert.alert('Erreur');
        }
      }
    );
  };

  const onShareContact = () => {
    const contact = {
      name: 'Jean Dupont',
      phone: '+33635360758',
      email: 'baptiste.beauteyt@example.com',
    };

    const message = `Contact:\nNom: ${contact.name}\nTéléphone: ${contact.phone}\nEmail: ${contact.email}`;

    confirmAction(`Partager la fiche de ${contact.name} ?`, async () => {
      try {
        const result = await Share.share({ message });
        if (result.action === Share.sharedAction) {
          console.log('Partagé');
        } else if (result.action === Share.dismissedAction) {
          console.log('Partage annulé');
        }
      } catch (error) {
        Alert.alert('Erreur de partage');
      }
    });
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={onPressFunction} style={({pressed})=>({opacity: pressed?0.5:1, marginBottom:20})}>
        <Text>Appeler le contact</Text>
      </Pressable>
      <Pressable onPress={onShareContact} style={({pressed})=>({opacity: pressed?0.5:1})}>
        <Text>Partager le contact</Text>
      </Pressable>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
