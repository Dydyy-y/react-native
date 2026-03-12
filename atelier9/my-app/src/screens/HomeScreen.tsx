import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSession } from '../contexts/SessionContext/useSession';

export function HomeScreen() {
  const [count, setCount] = useState(0);
  const { session, logout } = useSession();

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Bonjour {session?.name}</Text>
      <Text style={styles.title}>Compteur</Text>
      <Text style={styles.count}>{count}</Text>
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.button} onPress={() => setCount(count - 1)}>
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setCount(count + 1)}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => setCount(0)}>
        <Text style={styles.reset}>Reset</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={logout}>
        <Text style={styles.logout}>Se déconnecter</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  welcome: {
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  count: {
    fontSize: 80,
    fontWeight: 'bold',
  },
  buttons: {
    flexDirection: 'row',
    gap: 24,
  },
  button: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  reset: {
    color: '#999',
    fontSize: 16,
  },
  logout: {
    color: '#e00',
    fontSize: 16,
  },
});
