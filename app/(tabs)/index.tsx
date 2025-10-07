import { useState } from "react";
import { ScrollView, View } from "react-native";
import FilterSearch from "../../components/FilterSearch";
import PlaceCard from "../../components/PlaceCard";
import SearchBar from "../../components/SearchBar";
import { places } from "../data/placesData";

import { useRouter } from "expo-router";
import { useThemeColors } from "../hooks/useThemeColors";

export default function ExploreScreen() {
  const { colors } = useThemeColors();
  const [query, setQuery] = useState("");
  const router = useRouter();

  const categorias = [...new Set(places.map((p) => p.categoria))];
  const zonas = [...new Set(places.map((p) => p.zona))];

  const [filterCategories, setFilterCategories] = useState(categorias);
  const [filterZones, setFilterZones] = useState(zonas);

  const toggleFilterZone = (zone: string) => {
    if (filterZones.includes(zone)) {
      setFilterZones((filterZones) => filterZones.filter((z) => z !== zone));
    } else {
      setFilterZones([...filterZones, zone]);
    }
  };

  const toggleFilterCategory = (category: string) => {
    if (filterCategories.includes(category)) {
      setFilterCategories((filterCategories) =>
        filterCategories.filter((c) => c !== category)
      );
    } else {
      setFilterCategories([...filterCategories, category]);
    }
  };
  const filtered = places.filter(
    (p) =>
      p.title.toLowerCase().includes(query.toLowerCase()) &&
      (filterZones.includes(p.zona) || filterCategories.includes(p.categoria))
  );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background, paddingTop: 12 }}>
      <SearchBar value={query} onChangeText={setQuery} />

      <FilterSearch
        categories={categorias}
        zones={zonas}
        toggleCategory={toggleFilterCategory}
        toggleZone={toggleFilterZone}></FilterSearch>

      <View style={{ paddingHorizontal: 16, paddingBottom: 24 }}>
        {filtered.map((place) => (
          <PlaceCard
            key={place.id}
            title={place.title}
            subtitle={place.subtitle}
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
