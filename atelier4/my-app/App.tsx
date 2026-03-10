import { StatusBar } from 'expo-status-bar';
import React, { useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Animated, Dimensions } from 'react-native';
import { Header } from './header';
import { Intervenants, intervenantsData } from './intervenants';
import { TouchableOpacity } from 'react-native';

const onPress = () => {
  alert('Réservation effectuée !');
};

const FastCarousel = () => {
  const translate = useRef(new Animated.Value(0)).current;
  const { width } = Dimensions.get('window');

  useEffect(() => {
    Animated.loop(
      Animated.timing(translate, {
        toValue: -width,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();
  }, [translate, width]);

  return (
    <View style={styles.fastWrapper}>
      <Animated.Image
        source={require('./assets/julien.png')}
        style={[StyleSheet.absoluteFillObject, styles.fastImage, { transform: [{ translateX: translate }] }]}
        resizeMode="cover"
      />
    </View>
  );
};

export default function App() {
  return (
    <View style={styles.container}>
      <Header title="Le meurtre d'un épicier, symbole de la domination des orly à Plopsheim" />
      <View style={[styles.section, styles.intervenantsSection]}>
        <Text style={styles.sectionTitle}>Intervenants</Text>
        <Intervenants data={intervenantsData} />
      </View>
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.eventLabel}>Date :</Text>
          <Text style={styles.eventValue}>20 rue des noyers</Text>
          <Text style={styles.eventLabel}>Lieu :</Text>
          <Text style={styles.eventValue}>Plopsheim</Text>
          <Text style={styles.eventLabel}>Prix :</Text>
          <Text style={styles.eventValue}>15 €</Text>
        </View>
        <FastCarousel />
      </View>      
      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={onPress}>
          <Text style={styles.buttonText}>Réserver mon juju</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f7',
  },
  content: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
    padding: 16,
  },
  eventLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginTop: 6,
  },
  eventValue: {
    fontSize: 15,
    color: '#555',
    marginBottom: 6,
  },
  section: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  intervenantsSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    color: '#222',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 16,
  },
  fastWrapper: {
    height: 400,
    overflow: 'hidden',
    marginTop: 16,
  },
  fastImage: {
    width: '200%',
    height: '100%',
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#6200ee',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

});
