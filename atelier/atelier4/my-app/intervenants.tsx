
import React from 'react';
import { FlatList, View, Image, Text, StyleSheet } from 'react-native';

export type Intervenant = {
  id: string;
  photo: any;
  name: string;
  role: string;
};

export const intervenantsData: Intervenant[] = [
  {
    id: '1',
    photo: require('./assets/julien.png'),
    name: "débloque moi juju je t'aime",
    role: 'pied',
  },
];

type IntervenantsProps = {
  data: Intervenant[];
};

export const Intervenants = ({ data }: IntervenantsProps) => (
  <FlatList
    data={data}
    keyExtractor={(item) => item.id}
    horizontal
    contentContainerStyle={styles.listContainer}
    renderItem={({ item }) => (
      <View style={styles.item}>
        <Image source={item.photo} style={styles.photo} />
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.role}>{item.role}</Text>
      </View>
    )}
  />
);

const styles = StyleSheet.create({
  listContainer: {
    paddingLeft: 16,
  },
  item: {
    alignItems: 'center',
    marginRight: 16,
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  role: {
    fontSize: 14,
    color: '#555',
  },
});
