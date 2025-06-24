// services/favoritesService.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVORITES_KEY = "@RickAndMortyApp:favorites";

// Pega a lista de IDs de favoritos
export const getFavorites = async (): Promise<number[]> => {
  try {
    const favoritesJson = await AsyncStorage.getItem(FAVORITES_KEY);
    return favoritesJson ? JSON.parse(favoritesJson) : [];
  } catch (e) {
    console.error("Falha ao carregar favoritos.", e);
    return [];
  }
};

// Verifica se um ID específico é favorito
export const isFavorite = async (id: number): Promise<boolean> => {
  const favorites = await getFavorites();
  return favorites.includes(id);
};

// Adiciona um ID à lista de favoritos
export const addFavorite = async (id: number): Promise<void> => {
  try {
    const favorites = await getFavorites();
    if (!favorites.includes(id)) {
      const newFavorites = [...favorites, id];
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    }
  } catch (e) {
    console.error("Falha ao salvar favorito.", e);
  }
};

// Remove um ID da lista de favoritos
export const removeFavorite = async (id: number): Promise<void> => {
  try {
    const favorites = await getFavorites();
    const newFavorites = favorites.filter((favId) => favId !== id);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
  } catch (e) {
    console.error("Falha ao remover favorito.", e);
  }
};
