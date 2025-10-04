import { View, Text } from "react-native";

export default function FavoritesScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20, fontWeight: "700" }}>⭐ Favoritos</Text>
      <Text>Pronto podrás ver tus lugares guardados.</Text>
    </View>
  );
}