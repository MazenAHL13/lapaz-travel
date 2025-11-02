import PlaceCard from "@/src/components/PlaceCard";
import { usePlaces } from "@/src/hooks/usePlaces";
import { useSlideAndFade } from "@/src/hooks/useSlideAndFade";
import { useThemeColors } from "@/src/hooks/useThemeColors";
import { useFavoritesStore } from "@/src/store/useFavoritesStore";
import { router } from "expo-router";
import { Animated, SafeAreaView, ScrollView, Text, View } from "react-native";

const AnimatedPlaceCard = ({ place, index, onPress }) => {
  const animStyle = useSlideAndFade({
    initialTranslateY: 12,
    duration: 280,
    delay: index * 60,
  });

  return (
    <Animated.View style={animStyle}>
      <PlaceCard
        title={place.title}
        subtitle={place.subtitle}
        imageUri={place.imageUri ?? ""}
        onPress={onPress}
        placeId={place.id}
      />
    </Animated.View>
  );
};

export default function FavoritesScreen() {
  const { data: places, loadingPlaces } = usePlaces();
  const { colors } = useThemeColors();
  const { getFavorites } = useFavoritesStore();
  const favoriteIds = getFavorites();
  const favoritePlaces = places.filter((p) => favoriteIds.includes(p.id));

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
          favoritePlaces.map((place, index) => (
            <AnimatedPlaceCard
              key={place.id}
              place={place}
              index={index}
              onPress={() => router.push({
                pathname: "/places/[id]",
                params: { id: place.id },
              })} />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
