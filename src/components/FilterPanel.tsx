import { Pressable, StyleSheet, View } from "react-native";
import { radius, spacing, typography } from "../constants/tokens";
import { useThemeColors } from "../hooks/useThemeColors";
import { ThemeColors } from "../theme/colors";
import Text from "./Text";

type Props = {
  zones: string[];
  categories: string[];
  activeZones: string[];
  activeCategories: string[];
  onToggleZone: (z: string) => void;
  onToggleCategory: (c: string) => void;
  sortBy: "none" | "distance"| "alpha";
  onChangeSortBy: (v: "none" | "distance" | "alpha") => void;
};

export default function FilterPanel({
  zones,
  categories,
  activeZones,
  activeCategories,
  onToggleZone,
  onToggleCategory,
  sortBy,
  onChangeSortBy,

}: Props) {
  const { colors } = useThemeColors();
  const s = styles(colors);

  return (
    <View style={s.wrapper}>
      <View style={s.divider} />

      <Text style={s.sectionTitle}>Ordenar</Text>
      <View style={s.row}>
        <Chip
          label="Sin orden"
          active={sortBy === "none"}
          onPress={() => onChangeSortBy("none")}
          colors={colors}
        />
        <Chip
          label="Cercanos Primero"
          active={sortBy === "distance"}
          onPress={() => onChangeSortBy("distance")}
          colors={colors}
        />
        <Chip
          label="Alfabético"
          active={sortBy === "alpha"}
          onPress={() => onChangeSortBy("alpha")}
          colors={colors}
        />
      </View>
      <Text style={s.sectionTitle}>Zonas</Text>
      <View style={s.row}>
        {zones.map((z) => (
          <Chip
            key={z}
            label={z}
            active={activeZones.includes(z)}
            onPress={() => onToggleZone(z)}
            colors={colors}
          />
        ))}
      </View>

      <View style={s.divider} />

      <Text style={s.sectionTitle}>Categorías</Text>
      <View style={s.row}>
        {categories.map((c) => (
          <Chip
            key={c}
            label={c}
            active={activeCategories.includes(c)}
            onPress={() => onToggleCategory(c)}
            colors={colors}
          />
        ))}
      </View>
    </View>
  );
}

function Chip({
  label,
  active,
  onPress,
  colors,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  colors: ThemeColors;
}) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [
        {
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.xs,
          borderRadius: radius.xl,
          borderWidth: 1,
          borderColor: active ? colors.primary : colors.border,
          backgroundColor: active ? `${colors.primary}25` : colors.card,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Filtrar por ${label}`}
    >
      <Text
        style={{
          fontSize: typography.sm,
          color: active ? colors.primary : colors.text,
          fontWeight: active ? "600" : "500",
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = (colors: ThemeColors) =>
  StyleSheet.create({
    wrapper: {
      marginTop: spacing.sm,
      marginHorizontal: spacing.lg,
      backgroundColor: colors.card,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.md,
      rowGap: spacing.sm,
    },
    sectionTitle: {
      fontSize: typography.base,
      fontWeight: "600",
      color: colors.textSecondary,
      marginBottom: 4,
    },
    row: {
      flexDirection: "row",
      flexWrap: "wrap",
      columnGap: spacing.sm,
      rowGap: spacing.sm,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: spacing.sm,
      opacity: 0.6,
      borderRadius: 1,
    },
  });