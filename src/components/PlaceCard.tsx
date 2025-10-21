import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { radius, shadow, spacing } from "../constants/tokens";
import { useThemeColors } from "../hooks/useThemeColors";
import { useFavoritesStore } from "../store/useFavoritesStore";
import { ThemeColors } from "../theme/colors";

type PlaceCardProps = {
  title: string;
  subtitle?: string;
  imageUri: string;
  onPress?: () => void;
  placeId: string;
};

export default function PlaceCard({
  title,
  subtitle,
  imageUri,
  onPress,
  placeId,
}: PlaceCardProps) {
  const { colors } = useThemeColors();
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const isFav = placeId ? isFavorite(placeId) : false;


  const styles = createStyles(colors);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { opacity: pressed ? 0.96 : 1 },
        shadow.ios,
        shadow.android,
      ]}
    >
      <View style={styles.imageWrapper}>
        <Image source={{ uri: imageUri }} style={styles.image} />
        {placeId && (
          <Pressable
            onPress={() => toggleFavorite(placeId)}
            hitSlop={10}
            style={({ pressed }) => [
              styles.favoriteIcon,
              {
                backgroundColor: isFav
                  ? `${colors.primary}20`
                  : `${colors.card}CC`,
                transform: [{ scale: pressed ? 0.9 : 1 }],
              },
            ]}
          >
            <Ionicons
              name={isFav ? "heart" : "heart-outline"}
              size={20}
              color={isFav ? colors.primary : colors.textSecondary}
            />
          </Pressable>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </Pressable>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    card: {
      marginBottom: spacing.lg,
      borderRadius: radius.lg,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
      shadowColor: colors.shadow,
      shadowOpacity: 0.15,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 4,
    },
    imageWrapper: {
      position: "relative",
    },
    image: {
      width: "100%",
      height: 160,
    },
    favoriteIcon: {
      position: "absolute",
      top: spacing.sm,
      right: spacing.sm,
      height: 32,
      width: 32,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: colors.border,
    },
    content: {
      padding: spacing.md,
    },
    title: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
    },
    subtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 2,
    },
  });