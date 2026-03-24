import { StyleSheet, Text, View } from 'react-native';
import { useSession } from '../contexts/SessionContext/useSession';

export function ProfileScreen() {
  const { session } = useSession();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil</Text>
      <Text style={styles.name}>{session?.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 18,
    color: '#666',
  },
});
