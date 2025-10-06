import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import FavoriteButton from "../../components/FavoriteButton";
import { places } from "../data/placesData";

export default function PlaceDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const place = places.find((p) => p.id === id);

  if (!place) return <Text>Lugar no encontrado</Text>;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff", padding: 16, marginTop: 50 }}>
      <Pressable onPress={() => router.back()} style={{ marginBottom: 12 }}>
        <Text style={{ fontSize: 18 }}>←</Text>
      </Pressable>
      <Image source={{ uri: place.imageUri }} style={{ height: 220, borderRadius: 12 }} />
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", marginTop: 12 }}>
        <Text style={{ fontSize: 22, fontWeight: "bold", flex: 1 }} numberOfLines={2} ellipsizeMode="tail">{place.title}</Text>
        <FavoriteButton placeId={place.id} />
      </View>
      <Text style={{ marginVertical: 8, color: "gray" }}>{place.subtitle}</Text>
      {(place.zona || place.categoria) && (
        <View style={{ marginBottom: 8 }}>
          {place.categoria && <Text style={{ color: "gray" }}>Zona: {place.zona}</Text>}
          {place.categoria && <Text style={{ color: "gray" }}>Categoría: {place.categoria}</Text>}
        </View>
      )}
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