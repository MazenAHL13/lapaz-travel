import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useThemeColors } from "../app/hooks/useThemeColors";
import { ThemeColors } from "../app/theme/colors";
import { radius, shadow, spacing } from "../constants/tokens";

type PlaceCardProps = {
  title: string;
  subtitle?: string;
  imageUri: string;
  onPress?: () => void;
};

export default function PlaceCard({
  title,
  subtitle,
  imageUri,
  onPress,
}: PlaceCardProps) {
  const { colors } = useThemeColors();
  const styles = createStyles(colors);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
  {
    marginBottom: 16,
    borderRadius: radius.lg,
    padding: spacing.lg,
    backgroundColor: colors.card, 
    opacity: pressed ? 0.98 : 1,
  },
  shadow.ios,
  shadow.android,
]}
    >
      <Image source={{ uri: imageUri }} style={styles.image} />
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
      backgroundColor: colors.surface,
      borderRadius: 12,
      overflow: "hidden",
      marginBottom: 16,
      elevation: 2,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      padding: 16,
    },
    image: {
      width: "100%",
      height: 150,
    },
    content: {
      padding: 12,
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