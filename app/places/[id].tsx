import BackButton from "@/src/components/Backbutton";
import FavoriteButton from "@/src/components/FavoriteButton";
import RelatedPlacesRow, { Place as RelatedPlace } from "@/src/components/RelatedPlacesRow";
import { useThemeColors } from "@/src/hooks/useThemeColors";
import { usePlaces } from "@/src/hooks/usePlaces";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Pressable
} from "react-native";
import { ThemeColors } from "../../src/theme/colors";
import MapView, { Marker, Polyline } from "react-native-maps"; 
import * as Location from "expo-location";                     
import { getRoute } from "@/src/services/getRoute";    

export default function PlaceDetail() {
  const { id } = useLocalSearchParams();
  const { colors } = useThemeColors();
  const styles = getStyles(colors);

  const { data: places, loadingPlaces } = usePlaces();
  const [showMap, setShowMap] = useState(false);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [routeCoords, setRouteCoords] = useState<{ latitude: number; longitude: number }[]>([]);
  const [userLoc, setUserLoc] = useState<{ latitude: number; longitude: number } | null>(null);

  if (loadingPlaces) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.textSecondary }}>Cargando lugar...</Text>
      </View>
    );
  }

  const placeId = Array.isArray(id) ? id[0] : id;
  const place = places.find((p) => p.id === placeId);
  const hasCoords =
  typeof place?.latitude === "number" && typeof place?.longitude === "number";

const handleHowToGetThere = async () => {
  if (!hasCoords) {
    alert("Este lugar aún no tiene coordenadas cargadas.");
    return;
  }

  try {
    setLoadingRoute(true);
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permiso de ubicación denegado");
      return;
    }

    const loc = await Location.getCurrentPositionAsync({});
    const origin = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
    const destination = { latitude: place.latitude as number, longitude: place.longitude as number };

    setUserLoc(origin);
    setShowMap(true);

    const coords = await getRoute(origin, destination);
    setRouteCoords(coords);
  } catch (e) {
    console.error("Cómo llegar error:", e);
    alert("No se pudo calcular la ruta.");
  } finally {
    setLoadingRoute(false);
  }
};

  if (!place) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: colors.text }}>Lugar no encontrado</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: place.title, headerTitleAlign: "center" }} />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <BackButton />

          <View style={styles.imageContainer}>
            <Image
              source={{ uri: place.coverUri || place.imageUri }}
              style={styles.image}
            />
          </View>

          <View style={styles.headerContainer}>
            <Text style={styles.title}>{place.title}</Text>
            <FavoriteButton placeId={place.id} />
          </View>

          <Text style={styles.subtitle}>{place.subtitle}</Text>

          {(place.zone || place.categoria) && (
            <View style={styles.tagsContainer}>
              {place.zone && (
                <View style={styles.tag}>
                  <Ionicons
                    name="location-outline"
                    size={14}
                    color={colors.primary}
                  />
                  <Text style={styles.tagText}>{place.zone}</Text>
                </View>
              )}
              {place.categoria && (
                <View style={styles.tag}>
                  <Ionicons
                    name="pricetag-outline"
                    size={14}
                    color={colors.primary}
                  />
                  <Text style={styles.tagText}>{place.categoria}</Text>
                </View>
              )}
            </View>
          )}

          <Text style={styles.description}>{place.description}</Text>
          {/* --- Botón Cómo llegar --- */}
          <Pressable
            onPress={handleHowToGetThere}
            disabled={!hasCoords || loadingRoute}
            style={{
              backgroundColor: hasCoords ? colors.primary : colors.surface,
              opacity: loadingRoute ? 0.7 : 1,
              borderRadius: 12,
              padding: 14,
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <Text
              style={{
                color: hasCoords ? "white" : colors.textSecondary,
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              {loadingRoute ? "Calculando ruta..." : hasCoords ? "Cómo llegar" : "Coordenadas no disponibles"}
            </Text>
          </Pressable>
   {/* --- Mapa con ruta (bonus in-app) --- */}
          {showMap && hasCoords && (
            <View
              style={{
                height: 300,
                borderRadius: 12,
                overflow: "hidden",
                marginBottom: 20,
              }}
            >
              <MapView
                style={{ flex: 1 }}
                initialRegion={{
                  latitude: place.latitude as number,
                  longitude: place.longitude as number,
                  latitudeDelta: 0.03,
                  longitudeDelta: 0.03,
                }}
              >
                {userLoc && (
                  <Marker coordinate={userLoc} title="Tú" description="Ubicación actual" />
                )}
                <Marker
                  coordinate={{ latitude: place.latitude as number, longitude: place.longitude as number }}
                  title={place.title}
                />
                {routeCoords.length > 0 && (
                  <Polyline coordinates={routeCoords} strokeColor={colors.primary} strokeWidth={4} />
                )}
              </MapView>
            </View>
          )}
          <View style={styles.infoCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="time-outline" size={22} color={colors.text} />
              <Text style={styles.cardTitle}>Horario</Text>
            </View>
            <Text style={styles.cardContent}>{place.schedule}</Text>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="bulb-outline" size={22} color={colors.text} />
              <Text style={styles.cardTitle}>Tips</Text>
            </View>
            {place.tips?.map((tip: string, i) => (
              <View key={i} style={styles.tipItem}>
                <Text style={styles.bulletPoint}>•</Text>
                <Text style={styles.cardContent}>{tip}</Text>
              </View>
            ))}
          </View>

       

          <RelatedPlacesRow current={place as RelatedPlace} all={places as RelatedPlace[]} />
        </ScrollView>
      </SafeAreaView>
    </>
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