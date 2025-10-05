import { Text, View } from "react-native";
import { useThemeColors } from "../hooks/useThemeColors";

export default function FavoritesScreen() {
  const { colors } = useThemeColors();
  return (
    <View
      style={{
        backgroundColor: colors.background,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}>
      <Text style={{ fontSize: 20, fontWeight: "700", color: colors.text }}>
        ⭐ Favoritos
      </Text>
      <Text style={{ color: colors.textSecondary }}>
        Pronto podrás ver tus lugares guardados.
      </Text>
    </View>
  );
}
