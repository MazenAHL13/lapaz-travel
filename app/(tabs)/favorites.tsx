import { useRouter } from "expo-router";
import { SafeAreaView, ScrollView, Text, View } from "react-native";
import PlaceCard from "../../components/PlaceCard";
import data from "../data/placesData.json";
import { useThemeColors } from "../hooks/useThemeColors";
import { useFavoritesStore } from "../store/useFavoritesStore";
const places = data.places;

export default function FavoritesScreen() {
  const { colors } = useThemeColors();
  const { favorites } = useFavoritesStore();
  const router = useRouter();

  const favoritePlaces = places.filter((p) => favorites.includes(p.id));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          alignItems: favoritePlaces.length === 0 ? "center" : "stretch",
          justifyContent: favoritePlaces.length === 0 ? "center" : "flex-start",
          flexGrow: 1,
        }}>
        {favoritePlaces.length === 0 ? (
          <View style={{ alignItems: "center" }}>
            <Text
              style={{ fontSize: 20, fontWeight: "700", color: colors.text }}>
              Favoritos
            </Text>
            <Text style={{ color: colors.textSecondary, marginTop: 8 }}>
              Aún no tienes lugares guardados.
            </Text>
          </View>
        ) : (
          favoritePlaces.map((place) => (
            <PlaceCard
              key={place.id}
              title={place.title}
              subtitle={place.subtitle}
              imageUri={place.imageUri}
              onPress={() =>
                router.push({
                  pathname: "/places/[id]",
                  params: { id: place.id },
                })
              }
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
