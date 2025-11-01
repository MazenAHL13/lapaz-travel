import BackButton from "@/src/components/Backbutton";
import EditButton from "@/src/components/editButton";
import FavoriteButton from "@/src/components/FavoriteButton";
import RelatedPlacesRow from "@/src/components/RelatedPlacesRow";
import { usePlaces } from "@/src/hooks/usePlaces";
import { useThemeColors } from "@/src/hooks/useThemeColors";
import { getRoute } from "@/src/services/getRoute";
import { useUserStore } from "@/src/store/useUserStore";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import OpenInMapsButton from "@/src/components/OpenInMapsButton";
import { useDistanceEta } from "@/src/hooks/useDistanceEta";
import { formatDistance } from "@/src/utils/distance";

import {
  ActivityIndicator,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";

import MapView, { Marker, Polyline } from "react-native-maps";
import { ThemeColors } from "../../src/theme/colors";

export default function PlaceDetail() {
  const { id } = useLocalSearchParams();
  const { colors } = useThemeColors();
  const styles = getStyles(colors);

  const user = useUserStore((s) => s.currentUser);
  const router = useRouter();

  const { data: places, loadingPlaces } = usePlaces();
  const [showMap, setShowMap] = useState(false);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [routeCoords, setRouteCoords] = useState<{ latitude: number; longitude: number }[]>([]);
  const [userLoc, setUserLoc] = useState<{ latitude: number; longitude: number } | null>(null);

  const placeId = Array.isArray(id) ? id[0] : id;
  const place = places.find((p) => p.id === placeId);

  const hasCoords =
    typeof place?.latitude === "number" && typeof place?.longitude === "number";

  const distanceTarget = hasCoords
    ? {
        latitude: place?.latitude as number,
        longitude: place?.longitude as number,
        zona: place?.zona ?? undefined,
      }
    : null;

  const { loading: etaLoading, error: etaError, distanceMeters, eta } = useDistanceEta(distanceTarget);
  const drivingMinutes = eta ? Math.max(1, Math.round(eta.drivingSeconds / 60)) : null;
  const walkingMinutes = eta ? Math.max(1, Math.round(eta.walkingSeconds / 60)) : null;
  const formatMinutesLabel = (minutes: number | null) => {
    if (minutes == null) return "-";
    return `${minutes} min`;
  };

  if (loadingPlaces) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.textSecondary }}>Cargando lugar...</Text>
      </View>
    );
  }

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
      <SafeAreaView style={styles.safeArea}>
        
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <BackButton />
            {user?.role === "admin" && place.id && <EditButton placeId={place.id} />}
          </View>

          <View style={styles.imageContainer}>
            <Image
              source={{ uri: place.coverUri || place.imageUri }}
              style={styles.image}
            />
          </View>

          <View style={styles.headerContainer}>
            <Text style={styles.title}>{place.title}</Text>
            {place.id && <FavoriteButton placeId={place.id} />}
          </View>

          <Text style={styles.subtitle}>{place.subtitle}</Text>

          {(place.zona || place.categoria) && (
            <View style={styles.tagsContainer}>
              {place.zona && (
                <View style={styles.tag}>
                  <Ionicons
                    name="location-outline"
                    size={14}
                    color={colors.primary}
                  />
                  <Text style={styles.tagText}>{place.zona}</Text>
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
          {hasCoords && (
            <View style={styles.cardHeader}>
              <Ionicons name="location-outline" size={22} color={colors.text} />
              <Text style={styles.cardTitle}>Distancia estimada</Text>
            </View>
          )}
          {etaLoading ? (
            
            <Text style={{ color: colors.textSecondary, marginTop: 6, marginBottom: 12 }}>
              Calculando distancia…
            </Text>
          ) : etaError ? (
            <Text style={{ color: colors.textSecondary, marginTop: 6, marginBottom: 12 }}>
              {etaError}
            </Text>
          ) : eta && distanceMeters != null ? (
            
            
            <Text style={{ color: colors.textSecondary, marginTop: 6, marginBottom: 12 }}>
              {formatDistance(distanceMeters)} • {formatMinutesLabel(drivingMinutes)}{" "}
              <Ionicons name="car-outline" size={14} color={colors.textSecondary} /> |{" "}
              {formatMinutesLabel(walkingMinutes)}{" "}
              <Ionicons name="walk-outline" size={14} color={colors.textSecondary} />
            </Text>
          ) : (
            hasCoords && (
              <Text style={{ color: colors.textSecondary, marginTop: 6, marginBottom: 12 }}>
                Activa ubicación para ver distancia y tiempo
              </Text>
            )
          )}
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
          <OpenInMapsButton
            latitude={place.latitude as number}
            longitude={place.longitude as number}
            title={place.title}
          />
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

       

          <RelatedPlacesRow current={place} all={places} />
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
    editButton: {
      position: "absolute",
      top: 16,
      right: 16,
      zIndex: 10,
      backgroundColor: colors.background,
      padding: 8,
      borderRadius: 30,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 5,
    }
  });
