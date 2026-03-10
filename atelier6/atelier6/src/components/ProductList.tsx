import React from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useProducts } from '../hooks/useProducts';
import ProductCard from './ProductCard';

interface Props {
  onSelectProduct: (id: number) => void;
}

export default function ProductList({ onSelectProduct }: Props) {
  const { products, isLoading, hasMore, error, loadMore } = useProducts();

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (products.length === 0 && isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Chargement des produits…</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <ProductCard product={item} onPress={onSelectProduct} />
      )}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isLoading ? (
          <ActivityIndicator style={styles.footer} color="#2563eb" />
        ) : !hasMore ? (
          <Text style={styles.endText}>— Fin de la liste —</Text>
        ) : null
      }
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  list: {
    paddingVertical: 8,
  },
  loadingText: {
    color: '#555',
    fontSize: 14,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 15,
    textAlign: 'center',
    marginHorizontal: 24,
  },
  footer: {
    marginVertical: 16,
  },
  endText: {
    textAlign: 'center',
    color: '#aaa',
    fontSize: 13,
    marginVertical: 16,
  },
});
