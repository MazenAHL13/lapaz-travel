import FilterPanel from "@/src/components/FilterPanel";
import PlaceCard from "@/src/components/PlaceCard";
import SearchBar from "@/src/components/SearchBar";
import { usePlaces } from "@/src/hooks/usePlaces";
import { useThemeColors } from "@/src/hooks/useThemeColors";
import { useUserStore } from "@/src/store/useUserStore";
import { ThemeColors } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from "react-native";


export default function ExploreScreen() {
  const { data: places, loadingPlaces } = usePlaces();
  const { colors } = useThemeColors();
  const router = useRouter();
  const user = useUserStore((s) => s.currentUser);
  console.log(places);
  const styles = getStyles(colors);

  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const categorias = useMemo(() => [...new Set(places.map((p) => p.categoria))].filter((c): c is string => c !== undefined), []);
  const zonas = useMemo(() => [...new Set(places.map((p) => p.zone))].filter((z): z is string => z !== undefined), []);

  const [filterCategories, setFilterCategories] = useState<string[]>([]);
  const [filterZones, setFilterZones] = useState<string[]>([]);

  const toggleFilterZone = useCallback((zone: string) => {
    setFilterZones((prev) =>
      prev.includes(zone) ? prev.filter((z) => z !== zone) : [...prev, zone]
    );
  }, []);

  const toggleFilterCategory = useCallback((category: string) => {
    setFilterCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  }, []);

  const effectiveZones = filterZones.length ? filterZones : zonas;
  const effectiveCategories = filterCategories.length ? filterCategories : categorias;

  const filtered = useMemo(() => {
    return places.filter(
      (p) =>
        p.title.toLowerCase().includes(query.trim().toLowerCase()) &&
        effectiveZones.includes(p.zone) &&
        effectiveCategories.includes(p.categoria)
    );
  }, [query, effectiveZones, effectiveCategories]);
  const hasZoneFilter = filterZones.length > 0;
  const hasCategoryFilter = filterCategories.length > 0;
  const hasActiveFilters = hasZoneFilter || hasCategoryFilter;
  const resultCount = hasActiveFilters ? filtered.length : undefined;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 16, rowGap: 16, paddingBottom: 24 }}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
    >

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          marginBottom: 8,
        }}
      >
        {user?.avatar ? (
          <Image
            source={{ uri: user.avatar }}
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
            }}
          />
        ) : (
          <Ionicons name="person-circle" size={56} color={colors.text} />
        )}
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
            Bienvenido
          </Text>
          <Text
            style={{ color: colors.text, fontSize: 22, fontWeight: "700" }}
          >
            {user?.email ?? "Invitado"}
          </Text>
        </View>
      </View>

      <SearchBar
        value={query}
        onChangeText={setQuery}
        onPressFilter={() => setShowFilters((v) => !v)}
        resultCount={resultCount}
      />

      {showFilters && (
        <FilterPanel
          zones={zonas}
          categories={categorias}
          activeZones={filterZones}
          activeCategories={filterCategories}
          onToggleZone={toggleFilterZone}
          onToggleCategory={toggleFilterCategory}
        />
      )}

      <View style={{ rowGap: 16 }}>
      {loadingPlaces ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : places.length === 0 ? (
        <Text style={{ color: colors.textSecondary }}>No hay lugares disponibles.</Text>
      ) : (
        places.map((place) => (
          <PlaceCard
            key={place.id}
            title={place.title}
            subtitle={place.zone ?? ""}
            imageUri={place.imageUri ?? ""}
            onPress={() =>
              router.push({
                pathname: "/places/[id]",
                params: { id: place.id },
              })
            }
            placeId={place.id}
          />
        ))
      )}
      </View>
    </ScrollView>
  );
}


const getStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: 20,
      paddingTop: 24,
      paddingBottom: 40,
    },
    centered: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.background,
    },
    imageContainer: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    image: {
      height: 250,
      width: "100%",
      borderRadius: 16,
    },
    headerContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginTop: 20,
      gap: 12,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: colors.text,
      flex: 1,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      marginTop: 4,
      marginBottom: 16,
    },
    tagsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginBottom: 16,
    },
    tag: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.surface,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 15,
    },
    tagText: {
      color: colors.primary,
      marginLeft: 5,
      fontSize: 13,
      fontWeight: "500",
    },
    description: {
      fontSize: 16,
      lineHeight: 24,
      color: colors.text,
      marginBottom: 24,
    },
    infoCard: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
    },
    cardHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    cardTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.text,
      marginLeft: 8,
    },
    cardContent: {
      fontSize: 15,
      color: colors.textSecondary,
      lineHeight: 22,
      flex: 1,
    },
    tipItem: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginVertical: 6,
    },
    bulletPoint: {
      fontSize: 15,
      color: colors.textSecondary,
      marginRight: 8,
      lineHeight: 22,
    },
  });