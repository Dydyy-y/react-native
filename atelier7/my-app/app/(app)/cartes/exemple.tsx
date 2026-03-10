import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { CounterProvider, useCounter } from '../../../context/CounterContext';

export default function Exemple() {
  return (
    <CounterProvider>
      <ExempleContent />
    </CounterProvider>
  );
}

function ExempleContent() {
  const { count, increment, decrement } = useCounter();

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title}>Juju de niveau 1 (Parent via Context pour notre juju)</Text>
        <Text style={styles.count}>Nombre de juju: {count}</Text>
        <Button title="+1 juju" onPress={increment} />
        <Button title="-1 juju" onPress={decrement} />
      </View>

      <Level2 />
    </View>
  );
}

function Level2() {
  return (
    <View style={styles.box}>
      <Text style={styles.title}>Juju de niveau 2 (enfant)</Text>
      <Level3 />
    </View>
  );
}

function Level3() {
  const { count, increment } = useCounter();
  return (
    <View style={styles.box}>
      <Text style={styles.title}>Juju de niveau 3 (grandchild)</Text>
      <Text style={styles.count}>Nombre de juju: {count}</Text>
      <Button title="+1 juju" onPress={increment} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f7fafc' },
  box: { marginBottom: 16, padding: 12, backgroundColor: '#fff', borderRadius: 8, elevation: 2 },
  title: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#1a3a6b' },
  count: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
});
