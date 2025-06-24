// app/character/[id].tsx
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import api from '../services/api';
import * as favoritesService from '../services/favoritesService'; // Importe o serviço

// Tipo para os detalhes do personagem
type CharacterDetails = {
    id: number;
    name: string;
    status: string;
    species: string;
    gender: string;
    origin: { name: string };
    location: { name: string };
    image: string;
};

export default function CharacterDetailScreen() {
    const { id } = useLocalSearchParams();
    const characterId = Number(id); // Garante que o ID seja um número

    const [character, setCharacter] = useState<CharacterDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFavorite, setIsFavorite] = useState(false);

    // Efeito para buscar os detalhes do personagem na API
    useEffect(() => {
        if (!characterId) return;

        const fetchCharacterDetails = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/character/${characterId}`);
                setCharacter(response.data);
                setError(null);
            } catch (err) {
                setError('Falha ao carregar detalhes do personagem.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCharacterDetails();
    }, [characterId]);

    // Efeito para checar o status de favorito no AsyncStorage
    useEffect(() => {
        if (!characterId) return;

        const checkFavoriteStatus = async () => {
            const status = await favoritesService.isFavorite(characterId);
            setIsFavorite(status);
        };

        checkFavoriteStatus();
    }, [characterId]);


    const handleToggleFavorite = async () => {
        if (!characterId) return;

        if (isFavorite) {
            await favoritesService.removeFavorite(characterId);
        } else {
            await favoritesService.addFavorite(characterId);
        }
        // Atualiza o estado visual imediatamente
        setIsFavorite((prev) => !prev);
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#00ff00" />
            </View>
        );
    }

    if (error || !character) {
        return (
            <View style={styles.centered}>
                <Text>{error}</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Stack.Screen options={{ title: character.name }} />
            <Image source={{ uri: character.image }} style={styles.image} />

            <TouchableOpacity onPress={handleToggleFavorite} style={styles.favoriteButton}>
                <Text style={styles.favoriteButtonText}>
                    {isFavorite ? 'Remover dos Favoritos ❤️' : 'Adicionar aos Favoritos 🤍'}
                </Text>
            </TouchableOpacity>

            <View style={styles.infoContainer}>
                <Text style={styles.infoRow}><Text style={styles.label}>Status:</Text> {character.status}</Text>
                <Text style={styles.infoRow}><Text style={styles.label}>Espécie:</Text> {character.species}</Text>
                <Text style={styles.infoRow}><Text style={styles.label}>Gênero:</Text> {character.gender}</Text>
                <Text style={styles.infoRow}><Text style={styles.label}>Origem:</Text> {character.origin.name}</Text>
                <Text style={styles.infoRow}><Text style={styles.label}>Localização:</Text> {character.location.name}</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    image: {
        width: '100%',
        height: 300,
    },
    favoriteButton: {
        margin: 16,
        padding: 12,
        backgroundColor: '#007BFF',
        borderRadius: 8,
        alignItems: 'center',
    },
    favoriteButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    infoContainer: {
        padding: 16,
    },
    infoRow: {
        fontSize: 18,
        marginBottom: 8,
    },
    label: {
        fontWeight: 'bold',
    },
});