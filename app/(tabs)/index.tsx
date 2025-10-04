import { ScrollView, View } from "react-native";
import { useState } from "react";
import Header from "../../components/Header";
import SearchBar from "../../components/SearchBar";
import PlaceCard from "../../components/PlaceCard";


export default function ExploreScreen() {
  const [query, setQuery] = useState("");

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
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