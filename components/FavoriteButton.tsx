import React, { useState } from "react";
import { Text, TouchableOpacity } from "react-native";

export default function FavoriteButton({ placeId }: { placeId: string }) {
  const [favorites, setFavorites] = useState<string[]>([]);

  const isFav = favorites.includes(placeId);

  const toggleFavorite = () => {
    setFavorites((prev) =>
      prev.includes(placeId)
        ? prev.filter((id) => id !== placeId)
        : [...prev, placeId]
    );
  };

  return (
    <TouchableOpacity
      onPress={toggleFavorite}
      style={{
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        backgroundColor: isFav ? "#FFD700" : "#E0E0E0",
      }}
    >
      <Text>{isFav ? "⭐ Favorito" : "☆ Favorito"}</Text>
    </TouchableOpacity>
  );
}