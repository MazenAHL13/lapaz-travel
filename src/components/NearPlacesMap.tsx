import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { ActivityIndicator, Platform, StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { usePlaces } from "../hooks/usePlaces";
import { useThemeColors } from "../hooks/useThemeColors";
import { ThemeColors } from "../theme/colors";

interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}
export default function NearPlacesMap() {
  const {data: places, loadingPlaces } = usePlaces();
  const [region, setRegion] = useState<Region | null>(null);
  const [loading, setLoading] = useState(true);
  const { colors } = useThemeColors();
  const styles = getStyles(colors);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setRegion({
          latitude: -16.4897,
          longitude: -68.1193,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
      setLoading(false);
    })();
  }, []);

  if (loading || !region) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFill}
        initialRegion={region}
        showsUserLocation
        showsMyLocationButton={Platform.OS === "android"}
      >
        {loadingPlaces ? (
                <ActivityIndicator size="large" color={colors.primary} />
              ) : places.length === 0 ? (
                <Text style={{ color: colors.textSecondary }}>No hay lugares disponibles.</Text>
              ) : (
              places.filter((p) => typeof p.latitude === "number" && typeof p.longitude === "number").map((p) => (
                <Marker
                  key={p.id}
                  coordinate={{ latitude: p.latitude?? 0, longitude: p.longitude?? 0}}
                  title={p.title}
                  description={p.zona || p.categoria}
                  pinColor={selectedId === p.id ? colors.primary : colors.muted}
                  zIndex={selectedId === p.id ? 999 : 1}
                  onPress={() => {
                    setSelectedId(p.id!);}
                  }
          />
        ))
      )}
      </MapView>
    </View>
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
    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
    }
});