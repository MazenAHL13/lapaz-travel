import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useThemeColors } from "../app/hooks/useThemeColors";
import { ThemeColors } from "../app/theme/colors";

type FilterSearchProps = {
  zones: string[];
  categories: string[];
  toggleZone: (zone: string) => void;
  toggleCategory: (category: string) => void;
};

export default function FilterSearch({
  zones,
  categories,
  toggleZone,
  toggleCategory,
}: FilterSearchProps) {
  const [activeZones, setActiveZones] = useState(zones);
  const [activeCategories, setActiveCategories] = useState(categories);

  const toggleZoneFilter = (zone: string) => {
    setActiveZones((prev) =>
      prev.includes(zone) ? prev.filter((z) => z !== zone) : [...prev, zone]
    );
    toggleZone(zone);
  };
  const toggleCategoryFilter = (category: string) => {
    setActiveCategories((prev) =>
      prev.includes(category)
        ? prev.filter((z) => z !== category)
        : [...prev, category]
    );
    toggleCategory(category);
  };

  const { colors } = useThemeColors();
  const styles = createStyles(colors);

  const [deployed, setDeployed] = useState(false);

  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          setDeployed(!deployed);
        }}
        style={deployed ? styles.activeButton : styles.button}>
        <Text style={styles.title}>Filtrar:</Text>
      </TouchableOpacity>
      <View style={!deployed ? { display: "none" } : styles.container}>
        <Text style={styles.title}>Zonas</Text>
        <View style={styles.filtersContainer}>
          {zones.map((zone) => {
            const [active, setActive] = useState(false);
            return (
              <TouchableOpacity
                key={zone}
                onPress={() => toggleZoneFilter(zone)}
                style={[
                  styles.button,
                  activeZones.includes(zone) && styles.activeButton,
                ]}>
                <Text>{zone}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <Text style={styles.title}>Categorias</Text>
        <View style={styles.filtersContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => toggleCategoryFilter(category)}
              style={[
                styles.button,
                activeCategories.includes(category) && styles.activeButton,
              ]}>
              <Text>{category}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "center",
      borderRadius: 12,
      paddingHorizontal: 10,
      paddingVertical: 8,
      marginHorizontal: 16,
      marginBottom: 8,
    },
    filtersContainer: {
      display: "flex",
      flexWrap: "wrap",
      flexDirection: "row",
    },
    title: {
      color: colors.textSecondary,
      fontSize: 16,
      alignSelf: "center",
    },
    button: {
      borderRadius: 8,
      padding: 5,
      marginHorizontal: 5,
      marginBottom: 8,
      backgroundColor: colors.surface,
    },
    activeButton: {
      borderRadius: 8,
      padding: 5,
      marginHorizontal: 5,
      marginBottom: 8,
      backgroundColor: "#3399ff",
    },
  });
