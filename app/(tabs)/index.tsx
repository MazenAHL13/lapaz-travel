import { useMemo, useState, useCallback } from "react";
import { ScrollView, View, Image, Text } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import SearchBar from "../../components/SearchBar";
import FilterPanel from "../../components/FilterPanel";
import PlaceCard from "../../components/PlaceCard";
import data from "../data/placesData.json";
import { useThemeColors } from "../hooks/useThemeColors";
import { useUserStore } from "../store/useUserStore";



const places = data.places;

export default function ExploreScreen() {
  const { colors } = useThemeColors();
  const router = useRouter();
  const user = useUserStore((s) => s.currentUser);

  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const categorias = useMemo(() => [...new Set(places.map((p) => p.categoria))], []);
  const zonas = useMemo(() => [...new Set(places.map((p) => p.zona))], []);

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
        effectiveZones.includes(p.zona) &&
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
            {user?.name ?? "Invitado"}
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
        {filtered.map((place) => (
          <PlaceCard
            key={place.id}
            placeId={place.id}
            title={place.title}
            subtitle={`${place.zona} • ${place.categoria}`}
            imageUri={place.imageUri}
            onPress={() =>
              router.push({
                pathname: "/places/[id]",
                params: { id: place.id },
              })
            }
          />
        ))}
      </View>
    </ScrollView>
  );
}
