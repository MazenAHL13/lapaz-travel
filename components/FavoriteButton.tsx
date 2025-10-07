import { Text, TouchableOpacity } from "react-native";
import { useFavoritesStore } from "../app/store/useFavoritesStore";

export default function FavoriteButton({ placeId }: { placeId: string }) {
  const { favorites, toggleFavorite, isFavorite } = useFavoritesStore();

  const isFav = isFavorite(placeId);

  return (
    <TouchableOpacity
      onPress={() => toggleFavorite(placeId)}
      style={{
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        backgroundColor: isFav ? "#FFD700" : "#E0E0E0",
      }}>
      <Text>{isFav ? "⭐ Favorito" : "☆ Favorito"}</Text>
    </TouchableOpacity>
  );
}
