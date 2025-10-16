import { ThemeColors } from "@/app/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";
import { useThemeColors } from "../app/hooks/useThemeColors";
import { radius, spacing, typography } from "../constants/tokens";

 export default function BackButton() {
    const { colors } = useThemeColors();
    const styles = createStyles(colors);

    return (
 
        <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.backButton, { opacity: pressed ? 0.8 : 1 }]}>
            <Ionicons name="arrow-back" size={20} color={colors.primary} />
            <Text style={styles.backButtonText}>Volver</Text>
          </Pressable>
    );
}
const createStyles = (colors: ThemeColors) => StyleSheet.create({
    backButton: {
          flexDirection: "row",
          alignItems: "center",
          alignSelf: "flex-start",
          gap: spacing.xs,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.xs,
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: colors.primary,
          backgroundColor: colors.card,
          marginBottom: 16,
        },
    backButtonText: {
            fontSize: typography.sm,
            fontWeight: "500",
            color: colors.primary
        },

    }); 
