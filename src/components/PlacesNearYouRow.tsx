import * as Location from "expo-location";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { usePlaces } from "../hooks/usePlaces";
import { useThemeColors } from "../hooks/useThemeColors";
import { ThemeColors } from "../theme/colors";
import { Place } from "../types";


const FALLBACK = { latitude: -16.4897, longitude: -68.1193 };

const isNear = (a: { latitude: number; longitude: number }, b: { latitude: number; longitude: number }) => {
  const delta = 0.02;
  return (
    Math.abs(a.latitude - b.latitude) <= delta &&
    Math.abs(a.longitude - b.longitude) <= delta
  );
};

export default function PlacesNearYouRow({
  limit = 10,
  title = "Lugares cerca de ti",
}: {
  limit?: number;
  title?: string;
}) {
  const { data: places, loadingPlaces } = usePlaces();
  const { colors } = useThemeColors();
  const [here, setHere] = useState<{ latitude: number; longitude: number }>(FALLBACK);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        const pos = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        setHere({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      }
    })();
  }, []);

    const allPlaces: Place[] = places;

    const nearbyPlaces = allPlaces.filter((place) =>
    isNear(
        { latitude: place.latitude ?? 0, longitude: place.longitude ?? 0 },
    here
  )
);
  if (nearbyPlaces.length === 0) {
    return null;
  }

  return (
    <View style={{ marginTop: 24 }}>
      <Text style={styles(colors).sectionTitle}>{title}</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12 }}> 
        {nearbyPlaces.slice(0, limit).map((place) => (
          <Pressable
            key={place.id}
            style={{ marginRight: 12 }}
            onPress={() => router.push(`/places/${place.id}`)}
          >
            <View style={styles(colors).card}>
              <Image source={{ uri: place.imageUri }} style={styles(colors).image} />
              <Text style={styles(colors).cardTitle} numberOfLines={1}>
                {place.title}
              </Text>

              {place.subtitle && (
                <Text style={styles(colors).cardSubtitle} numberOfLines={1}>
                  {place.subtitle}
                </Text>
              )}

              <View style={styles(colors).pills}>
                {place.zona && <Text style={styles(colors).pill}>{place.zona}</Text>}
                {place.categoria && <Text style={styles(colors).pill}>{place.categoria}</Text>}
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = (colors: ThemeColors) =>
  StyleSheet.create({
    sectionTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 6,
    },
    card: {
      width: 180,
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 10,
    },
    image: {
      width: "100%",
      height: 110,
      borderRadius: 10,
      marginBottom: 8,
    },
    cardTitle: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.text,
    },
    cardSubtitle: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
    },
    pills: {
      flexDirection: "row",
      gap: 6,
      marginTop: 8,
      flexWrap: "wrap",
    },
    pill: {
      fontSize: 11,
      color: colors.primary,
      backgroundColor: colors.background,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
  });