import { useThemeColors } from "@/src/hooks/useThemeColors";
import { useThemeStore } from "@/src/store/useThemeStore";
import { ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { radius, shadow, spacing, typography } from "../../src/constants/tokens";
import type { ThemeColors } from "../../src/theme/colors";

export default function SettingsScreen() {
  const { theme, colors } = useThemeColors();
  const toggleTheme = useThemeStore((s) => s.toggleTheme);


  const styles = createStyles(colors);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: spacing.lg, rowGap: spacing.lg, paddingBottom: spacing.xl }}
    >
      <View>
        <Text style={styles.sectionLabel}>Apariencia</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>Tema oscuro</Text>
              <Text style={styles.rowSubtitle}>Activa la apariencia oscura de la app.</Text>
            </View>
            <Switch
              value={theme === "dark"}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.switchTrackOff, true: colors.switchTrackOn }}
              thumbColor={theme === "dark" ? colors.switchThumb : "#f4f4f5"}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    sectionLabel: {
      color: colors.textSecondary,
      fontSize: typography.sm,
      marginBottom: spacing.sm,
      fontWeight: "600",
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.md,
      ...shadow.ios,
      ...shadow.android,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
    },
    rowTitle: {
      fontSize: typography.base,
      fontWeight: "700",
      color: colors.text,
    },
    rowSubtitle: {
      marginTop: 2,
      fontSize: typography.sm,
      color: colors.textSecondary,
    },
  });