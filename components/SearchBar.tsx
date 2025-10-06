import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TextInput, View } from "react-native";
import { useThemeColors } from "../app/hooks/useThemeColors";
import { ThemeColors } from "../app/theme/colors";

type SearchBarProps = {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
};

export default function SearchBar({
  placeholder = "Buscar...",
  value,
  onChangeText,
}: SearchBarProps) {
  const { colors } = useThemeColors();
  const styles = createStyles(colors);
  return (
    <View style={styles.container}>
      <Ionicons
        name="search"
        size={20}
        color={colors.muted}
        style={styles.icon}
      />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.surface,
      borderRadius: 12,
      paddingHorizontal: 10,
      paddingVertical: 8,
      marginHorizontal: 16,
      marginBottom: 8,
    },
    icon: {
      marginRight: 6,
    },
    input: {
      flex: 1,
      fontSize: 16,
    },
  });
