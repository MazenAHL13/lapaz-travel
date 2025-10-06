import { useState } from "react";
import { ScrollView, View } from "react-native";
import Header from "../../components/Header";
import PlaceCard from "../../components/PlaceCard";
import SearchBar from "../../components/SearchBar";
import { places } from "../data/placesData";

import { useRouter } from "expo-router";
import { useThemeColors } from "../hooks/useThemeColors";

export default function ExploreScreen() {
  const { colors } = useThemeColors();
  const [query, setQuery] = useState("");
  const router = useRouter();

  const filtered = places.filter((p) =>
    p.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Header title="Explorar" subtitle="Descubre lugares de La Paz" />
      <SearchBar value={query} onChangeText={setQuery} />

      <View style={{ paddingHorizontal: 16, paddingBottom: 24 }}>
        {filtered.map((place) => (
          <PlaceCard
            key={place.id}
            title={place.title}
            subtitle={place.subtitle}
            imageUri={place.imageUri}
            onPress={() => router.push(`/places/${place.id}`)}
          />
        ))}
      </View>
    </ScrollView>
  );
}
