import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";
import { radius, spacing, typography } from "../constants/tokens";
import { useThemeColors } from "../hooks/useThemeColors";
import { ThemeColors } from "../theme/colors";

type Props = {
  placeId: string;
};

export default function EditButton({ placeId }: Props) {
  const { colors } = useThemeColors();
  const styles = createStyles(colors);

  return (
    <Pressable
      onPress={() => router.push(`/admin/edit/${placeId}`)}
      style={({ pressed }) => [styles.editButton, { opacity: pressed ? 0.8 : 1 }]}
    >
      <Ionicons name="create-outline" size={24} color={colors.primary} />
      <Text style={styles.editText}>Edit</Text>
    </Pressable>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    editButton: {
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "auto",
        flexDirection: "row",
        gap: spacing.xs,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.primary,
        backgroundColor: colors.card,
        height: 40,
    },
    editText: {
        fontSize: typography.sm,
        fontWeight: "500",
        color: colors.primary
    },
  });