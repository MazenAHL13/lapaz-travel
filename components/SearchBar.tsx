import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { useThemeColors } from "../app/hooks/useThemeColors";
import { ThemeColors } from "../app/theme/colors";
import { radius, spacing, typography, shadow } from "../constants/tokens";

type SearchBarProps = {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onPressFilter?: () => void;
  activeFilterCount?: number;
};

export default function SearchBar({
  placeholder = "Buscar...",
  value,
  onChangeText,
  onPressFilter,
  activeFilterCount = 0,
}: SearchBarProps) {
  const { colors } = useThemeColors();
  const [focused, setFocused] = useState(false);
  const styles = createStyles(colors, focused);

  return (
    <View style={styles.container}>
      <Ionicons
        name="search"
        size={18}
        color={focused ? colors.primary : colors.muted}
        style={styles.icon}
      />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize="none"
        clearButtonMode="while-editing"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
  
      {!!onPressFilter && (
        <Pressable
          onPress={onPressFilter}
          hitSlop={10}
          style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          accessibilityRole="button"
          accessibilityLabel="Mostrar filtros"
        >
          <View style={styles.filterButton}>
            <Ionicons
              name="funnel"
              size={18}
              color={colors.textSecondary}
            />
          </View>
        </Pressable>
      )}
    </View>
  );
}

const createStyles = (colors: ThemeColors, focused: boolean) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      height: 44,
      borderRadius: radius.lg,
      paddingHorizontal: spacing.md,
      backgroundColor: colors.card, 
      borderWidth: 1,
      borderColor: focused ? colors.primary : colors.border,
      ...(focused ? { ...shadow.ios, ...shadow.android } : null),
    },
    icon: {
      opacity: 0.9,
    },
    input: {
      flex: 1,
      paddingVertical: 0,
      marginLeft: spacing.sm,
      fontSize: typography.base,
      color: colors.text,
    },
     filterButton: {
      marginLeft: spacing.sm,
      alignItems: "center",
      justifyContent: "center",
    },
  });