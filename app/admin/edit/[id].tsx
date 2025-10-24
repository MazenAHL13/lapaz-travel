import PlaceForm from "@/src/components/forms/PlaceForm";
import { useThemeColors } from "@/src/hooks/useThemeColors";
import { db } from "@/src/services/firebase/config";
import { Place } from "@/src/types";
import { useLocalSearchParams } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function EditPlaceScreen() {
  const { id } = useLocalSearchParams();
  const { colors } = useThemeColors();
  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const docRef = doc(db, "places", String(id));
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setPlace({ id: snap.id, ...snap.data() } as Place);
        }
      } catch (e) {
        console.error("Error al cargar lugar:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchPlace();
  }, [id]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.textSecondary, marginTop: 10 }}>
          Cargando lugar...
        </Text>
      </View>
    );
  }

  if (!place) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}>
        <Text style={{ color: colors.text }}>Lugar no encontrado.</Text>
      </View>
    );
  }

  return <PlaceForm existingPlace={place} />;
}
