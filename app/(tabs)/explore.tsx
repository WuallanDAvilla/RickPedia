// app/(tabs)/explore.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
// CORREÇÃO 1: Importar o 'router' para navegação programática.
import { router } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import api from '../../services/api';
import * as favoritesService from '../../services/favoritesService';

type Character = {
  id: number;
  name: string;
  image: string;
};

export default function FavoritesScreen() {
  const [favoriteCharacters, setFavoriteCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isFocused = useIsFocused();

  const loadFavorites = useCallback(async () => {
    try {
      setLoading(true);
      const favoriteIds = await favoritesService.getFavorites();

      if (favoriteIds.length === 0) {
        setFavoriteCharacters([]);
        return;
      }

      const response = await api.get(`/character/${favoriteIds.join(',')}`);
      const charactersData = Array.isArray(response.data) ? response.data : [response.data];
      setFavoriteCharacters(charactersData);
      setError(null);

    } catch (err) {
      setError('Falha ao carregar os favoritos.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isFocused) {
      loadFavorites();
    }
  }, [isFocused, loadFavorites]);

  const renderCharacter = ({ item }: { item: Character }) => (
    // CORREÇÃO FINAL E DEFINITIVA: Usando `as any` para contornar
    // o erro de tipagem persistente do Expo Router.
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => router.push(`/character/${item.id}` as any)}
    >
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <Text style={styles.itemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00ff00" />
        <Text>Carregando favoritos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>{error}</Text>
      </View>
    );
  }

  if (favoriteCharacters.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>Você ainda não tem favoritos! 💔</Text>
        <Text style={styles.subEmptyText}>Adicione personagens na tela principal para vê-los aqui.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favoriteCharacters}
        renderItem={renderCharacter}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'column',
    margin: 8,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
    elevation: 3,
  },
  itemImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
  },
  itemText: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#333'
  },
  subEmptyText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666'
  }
});