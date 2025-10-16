import { Pressable, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFavoritesStore } from "../app/store/useFavoritesStore";
import { useThemeColors } from "../app/hooks/useThemeColors";
import { radius, spacing, typography } from  "../constants/tokens";

export default function FavoriteButton({ placeId }: { placeId: string }) {
  const { colors } = useThemeColors();
  const { toggleFavorite, isFavorite } = useFavoritesStore();

  const isFav = isFavorite(placeId);

  return (
    <Pressable
      onPress={() => toggleFavorite(placeId)}
      style={({ pressed }) => [
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: spacing.xs,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.xs,
          borderRadius: radius.lg,
          backgroundColor: isFav
            ? `${colors.primary}20`
            : colors.card,
          borderWidth: 1,
          borderColor: isFav ? colors.primary : colors.border,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <Ionicons
        name={isFav ? "heart" : "heart-outline"}
        size={18}
        color={isFav ? colors.primary : colors.textSecondary}
      />
      <Text
        style={{
          fontSize: typography.sm,
          fontWeight: isFav ? "700" : "500",
          color: isFav ? colors.primary : colors.textSecondary,
        }}
      >
        Favorito
      </Text>
    </Pressable>
  );
}