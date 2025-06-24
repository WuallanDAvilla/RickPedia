// app/(tabs)/index.tsx
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
// Importar o 'router' para navegação programática.
import { router } from 'expo-router';
import api from '../../services/api';

type Character = {
  id: number;
  name: string;
  image: string;
};

export default function HomeScreen() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        setLoading(true);
        const response = await api.get('/character');
        setCharacters(response.data.results);
        setError(null);
      } catch (err) {
        setError('Falha ao carregar os personagens.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, []);

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
        <Text>Carregando Personagens...</Text>
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

  return (
    <View style={styles.container}>
      <FlatList
        data={characters}
        renderItem={renderCharacter}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
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
  },
  container: {
    flex: 1,
    paddingTop: 10,
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
});