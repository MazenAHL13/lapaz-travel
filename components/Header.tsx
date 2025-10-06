import { StyleSheet, Text, View } from "react-native";
import { useThemeColors } from "../app/hooks/useThemeColors";
import { ThemeColors } from "../app/theme/colors";

type HeaderProps = {
  title: string;
  subtitle?: string;
  useSurfaceBackground?: boolean; // opcional para elegir fondo
};

export default function Header({ title, subtitle, useSurfaceBackground = false }: HeaderProps) {
  const { colors } = useThemeColors();
  const styles = createStyles(colors, useSurfaceBackground);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const createStyles = (colors: ThemeColors, useSurfaceBackground: boolean) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: useSurfaceBackground ? colors.surface : colors.background, // ✅ fondo dinámico
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border, // da un pequeño contraste
    },
    title: {
      fontSize: 22,
      fontWeight: "700",
      color: colors.text,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      marginTop: 4,
    },
  });