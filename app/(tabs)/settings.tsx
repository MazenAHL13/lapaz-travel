import { StyleSheet, Switch, Text, View } from "react-native";

import { useThemeColors } from "../hooks/useThemeColors";
import { useThemeStore } from "../store/useThemeStore";
import type { ThemeColors } from "../theme/colors";

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    settingsBody: {
      flexWrap: "wrap",
      flexDirection: "row",
      backgroundColor: colors.background,
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
      paddingTop: 20,
    },
    themeSection: {
      width: "40%",
      height: "20%",
      backgroundColor: colors.surface,
      padding: 10,
      margin: 10,
      borderRadius: 5,
      alignItems: "center",
      justifyContent: "center",
    },
    settingTry: {
      alignItems: "center",
      justifyContent: "center",
      height: "20%",
      width: "40%",
      backgroundColor: colors.surface,
      padding: 10,
      margin: 10,
      borderRadius: 5,
    },
    title: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
    },
    subTitle: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: "500",
      textAlign: "center",
    },
  });

export default function SettingsScreen() {
  const { theme, colors } = useThemeColors();
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const styles = createStyles(colors);

  return (
    <View style={styles.settingsBody}>
      <View style={styles.themeSection}>
        <Text style={styles.title}>⚙️ Tema</Text>
        <Switch
          value={theme === "dark"}
          onValueChange={toggleTheme}
          trackColor={{
            false: colors.switchTrackOff,
            true: colors.switchTrackOn,
          }}
          thumbColor={theme === "dark" ? colors.switchThumb : "#f4f4f5"}
        />
      </View>
      <View style={styles.settingTry}>
        <Text style={styles.title}>⚙️ Ajustes</Text>
        <Text style={styles.subTitle}>
          Cambia los ajustes segun tus preferencias
        </Text>
      </View>
    </View>
  );
}
