import { useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, TextInput, View, Text } from "react-native";
import { useThemeColors } from "../app/hooks/useThemeColors";
import { ThemeColors } from "../app/theme/colors";
import { radius, spacing, typography, shadow } from "../constants/tokens";

type SearchBarProps = {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onPressFilter?: () => void;
  resultCount?: number;
};

export default function SearchBar({
  placeholder = "Buscar...",
  value,
  onChangeText,
  onPressFilter,
  resultCount,
}: SearchBarProps) {
  const { colors } = useThemeColors();
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const styles = createStyles(colors, focused);
  const handleFocusRequest = () => {
    inputRef.current?.focus();
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && !focused ? styles.containerPressed : null,
      ]}
      onPress={handleFocusRequest}
      onPressIn={handleFocusRequest}
      accessibilityRole="search"
      accessibilityLabel={placeholder}
      hitSlop={4}
    >
      <Ionicons
        name="search"
        size={18}
        color={focused ? colors.primary : colors.muted}
        style={styles.icon}
      />

      <TextInput
        ref={inputRef}
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
        showSoftInputOnFocus
        blurOnSubmit={false}
      />

      {!!onPressFilter && (
        <Pressable
          onPress={onPressFilter}
          hitSlop={10}
          style={({ pressed }) => [
            styles.filterButton,
            { opacity: pressed ? 0.6 : 1 },
          ]}
          accessibilityRole="button"
          accessibilityLabel={
            typeof resultCount === "number"
              ? `Mostrar filtros, ${resultCount} resultados`
              : "Mostrar filtros"
          }
        >
          <Ionicons
            name="funnel"
            size={18}
            color={colors.textSecondary}
          />
          {typeof resultCount === "number" && (
            <View style={styles.badge}>
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: "700",
                  color: "#fff",
                  textAlign: "center",
                }}
              >
                {resultCount}
              </Text>
            </View>
          )}
        </Pressable>
      )}
    </Pressable>
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
    containerPressed: { opacity: 0.92 },
    icon: { opacity: 0.9 },
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
    badge: {
      position: "absolute",
      top: -6,
      right: -6,
      backgroundColor: colors.primary,
      borderRadius: 8,
      minWidth: 16,
      height: 16,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 3,
    },
  });
