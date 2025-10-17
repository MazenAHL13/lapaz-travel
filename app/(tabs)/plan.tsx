import { SafeAreaView, View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { router } from "expo-router";
import { useThemeColors } from "../hooks/useThemeColors";
import { ThemeColors } from "../theme/colors";
import { Ionicons } from "@expo/vector-icons";
import NearPlacesMap from "@/components/NearPlacesMap";
import PlacesNearYouRow from "@/components/PlacesNearYouRow";

export default function PlanScreen() {
  const { colors } = useThemeColors();
  const styles = getStyles(colors);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView>
      <View style={styles.container}>
        <View style={{ flexDirection: "row"}}>
        <Text style={styles.title}>Planifica tu Recorrido </Text>
          <Ionicons name="trail-sign" size={28} color={colors.primary} />
        </View>
        <PlacesNearYouRow />
        <View style={{ height: 300, marginTop: 12 }}>
          <Text style={styles.subtitle}>
            Descubre atracciones cercanas y planifica tu día con nuestro mapa interactivo.
          </Text>
          <NearPlacesMap />
        </View>

        <Pressable
          onPress={() => router.push({ pathname: "/(modals)/chat" })}
          style={styles.chatButton}
        >
          <Ionicons name="chatbubble-ellipses-outline" size={18} color="#fff" />
          <Text style={styles.chatButtonText}>Abrir chat IA</Text>
        </Pressable>
      </View>
      </ScrollView>
    </SafeAreaView>

  );
}

const getStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    container: { 
      flex: 1, 
      padding: 16, 
      gap: 12 
    },
    title: { 
      fontSize: 24, 
      fontWeight: "700", 
      color: colors.text 
    },
    subtitle: { 
      fontSize: 16, 
      color: colors.textSecondary,
      marginBottom: 16
    },
    chatButton: {
      alignSelf: "flex-start",
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      backgroundColor: colors.primary,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 12,
      marginTop: 8,
    },
    chatButtonText: { color: "#fff", fontWeight: "600" },
  });