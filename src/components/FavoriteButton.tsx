import React from "react";
import { Pressable, Text, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { radius, spacing, typography } from "../constants/tokens";
import { useThemeColors } from "../hooks/useThemeColors";
import { useFavoritesStore } from "../store/useFavoritesStore";
import { useBounceAnimation } from "@/src/hooks/useBounceAnimation";

export default function FavoriteButton({ placeId }: { placeId: string }) {
  const { colors } = useThemeColors();
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const isFav = isFavorite(placeId);

  const { scale, bounce } = useBounceAnimation({ toValue: 1.2 });

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPress={() => {
          bounce();
          toggleFavorite(placeId);
        }}
        style={({ pressed }) => [
          {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: spacing.xs,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.xs,
            borderRadius: radius.lg,
            backgroundColor: isFav ? `${colors.primary}20` : colors.card,
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
    </Animated.View>
  );
}