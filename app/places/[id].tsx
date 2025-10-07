import { Ionicons } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import FavoriteButton from "../../components/FavoriteButton";
import data from "../data/placesData.json";
import { useThemeColors } from "../hooks/useThemeColors";
import { ThemeColors } from "../theme/colors";

const places = data.places;

export default function PlaceDetail() {
  const { id } = useLocalSearchParams();
  const { colors } = useThemeColors();

  const styles = getStyles(colors);

  const placeId = Array.isArray(id) ? id[0] : id;
  const place = places.find((p) => p.id === placeId);

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
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={20} color={colors.primary} />
            <Text style={styles.backButtonText}>Volver</Text>
          </Pressable>

          <View style={styles.imageContainer}>
            <Image source={{ uri: place.imageUri }} style={styles.image} />
          </View>

          <View style={styles.headerContainer}>
            <Text style={styles.title}>{place.title}</Text>
            <FavoriteButton placeId={place.id} />
          </View>

          <Text style={styles.subtitle}>{place.subtitle}</Text>

          {(place.zona || place.categoria) && (
            <View style={styles.tagsContainer}>
              {place.zona && (
                <View style={styles.tag}>
                  <Ionicons name="location-outline" size={14} color={colors.primary} />
                  <Text style={styles.tagText}>{place.zona}</Text>
                </View>
              )}
              {place.categoria && (
                <View style={styles.tag}>
                  <Ionicons name="pricetag-outline" size={14} color={colors.primary} />
                  <Text style={styles.tagText}>{place.categoria}</Text>
                </View>
              )}
            </View>
          )}

          <Text style={styles.description}>{place.description}</Text>

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
            {place.tips.map((tip, i) => (
              <View key={i} style={styles.tipItem}>
                <Text style={styles.bulletPoint}>•</Text>
                <Text style={styles.cardContent}>{tip}</Text>
              </View>
            ))}
          </View>
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
    backButton: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-start",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      backgroundColor: colors.surface,
      marginBottom: 16,
    },
    backButtonText: {
      fontSize: 16,
      color: colors.primary,
      marginLeft: 6,
      fontWeight: "500",
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