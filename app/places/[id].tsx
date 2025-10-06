import React from "react";
import { Image, ScrollView, Text, View, SafeAreaView } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import FavoriteButton from "../../components/FavoriteButton";
import { places } from "../data/placesData";
import { useThemeColors } from "../hooks/useThemeColors";

export default function PlaceDetail() {
  const { id } = useLocalSearchParams();
  const { colors } = useThemeColors();

  const placeId = Array.isArray(id) ? id[0] : id; 
  const place = places.find((p) => p.id === placeId);

  if (!place) return <Text style={{ color: colors.text }}>Lugar no encontrado</Text>;

  return (
    <>
      {/* Usa el header nativo con back automático */}
      <Stack.Screen options={{ title: place.title }} />

      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
          contentInsetAdjustmentBehavior="automatic"
        >
          <Image
            source={{ uri: place.imageUri }}
            style={{ height: 220, borderRadius: 12 }}
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              marginTop: 12,
              gap: 8,
            }}
          >
            <Text
              style={{ fontSize: 22, fontWeight: "bold", flex: 1, color: colors.text }}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {place.title}
            </Text>
            <FavoriteButton placeId={place.id} />
          </View>

          <Text style={{ marginVertical: 8, color: colors.textSecondary }}>
            {place.subtitle}
          </Text>

          {(place.zona || place.categoria) && (
            <View style={{ marginBottom: 8 }}>
              {place.zona && (
                <Text style={{ color: colors.textSecondary }}>Zona: {place.zona}</Text>
              )}
              {place.categoria && (
                <Text style={{ color: colors.textSecondary }}>
                  Categoría: {place.categoria}
                </Text>
              )}
            </View>
          )}

          <Text style={{ fontSize: 16, color: colors.text }}>
            {place.description}
          </Text>

          <View style={{ marginTop: 16 }}>
            <Text style={{ fontWeight: "bold", fontSize: 18, color: colors.text }}>
              🕐 Horario
            </Text>
            <Text style={{ color: colors.textSecondary }}>{place.schedule}</Text>
          </View>

          <View style={{ marginTop: 16 }}>
            <Text style={{ fontWeight: "bold", fontSize: 18, color: colors.text }}>
              💡 Tips
            </Text>
            {place.tips.map((tip, i) => (
              <Text key={i} style={{ color: colors.textSecondary }}>
                • {tip}
              </Text>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}