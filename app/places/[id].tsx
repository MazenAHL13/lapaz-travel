import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, View } from "react-native";
import FavoriteButton from "../../components/FavoriteButton";
import { places } from "../data/placesData";

export default function PlaceDetail() {
  const { id } = useLocalSearchParams();
  const place = places.find((p) => p.id === id);

  if (!place) return <Text>Lugar no encontrado</Text>;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff", padding: 16 }}>
      <Image source={{ uri: place.imageUri }} style={{ height: 220, borderRadius: 12 }} />
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 12 }}>
        <Text style={{ fontSize: 22, fontWeight: "bold" }}>{place.title}</Text>
        <FavoriteButton placeId={place.id} />
      </View>
      <Text style={{ marginVertical: 8, color: "gray" }}>{place.subtitle}</Text>
      <Text style={{ fontSize: 16 }}>{place.description}</Text>

      <View style={{ marginTop: 16 }}>
        <Text style={{ fontWeight: "bold", fontSize: 18 }}>🕐 Horario</Text>
        <Text>{place.schedule}</Text>
      </View>

      <View style={{ marginTop: 16 }}>
        <Text style={{ fontWeight: "bold", fontSize: 18 }}>💡 Tips</Text>
        {place.tips.map((tip, i) => (
          <Text key={i}>• {tip}</Text>
        ))}
      </View>
    </ScrollView>
  );
}