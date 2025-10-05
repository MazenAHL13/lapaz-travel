import { useState } from "react";
import { ScrollView, View } from "react-native";
import Header from "../../components/Header";
import PlaceCard from "../../components/PlaceCard";
import SearchBar from "../../components/SearchBar";

import { useThemeColors } from "../hooks/useThemeColors";

export default function ExploreScreen() {
  const { colors } = useThemeColors();
  const [query, setQuery] = useState("");

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="Explorar" subtitle="Descubre lugares de La Paz" />
      <SearchBar value={query} onChangeText={setQuery} />

      <View style={{ paddingHorizontal: 16, paddingBottom: 24 }}>
        <PlaceCard
          title="Mirador Killi Killi"
          subtitle="Vista panorámica de La Paz"
          imageUri="https://picsum.photos/800/600"
          onPress={() => console.log("Ir al detalle")}
        />
        <PlaceCard
          title="El Montículo"
          subtitle="Mirador en Sopocachi"
          imageUri="https://picsum.photos/801/600"
          onPress={() => console.log("Ir al detalle")}
        />
      </View>
    </ScrollView>
  );
}
