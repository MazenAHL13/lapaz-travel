import { useThemeColors } from "@/src/hooks/useThemeColors";
import { db } from "@/src/services/firebase/config";
import { useUserStore } from "@/src/store/useUserStore";
import { ThemeColors } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import {
    Alert,
    Image,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

export default function PlaceForm() {
  const { colors } = useThemeColors();
  const styles = createStyles(colors);
  const router = useRouter();
  const user = useUserStore((s) => s.currentUser);

  const [title, setTitle] = useState("");
  const [zone, setZone] = useState("");
  const [categoria, setCategoria] = useState("");
  const [description, setDescription] = useState("");
  const [schedule, setSchedule] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (user?.role !== "admin") {
    return (
      <View style={styles.centered}>
        <Text style={{ color: colors.text }}>
          No tienes permisos para crear lugares.
        </Text>
      </View>
    );
  }

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !zone.trim() || !categoria.trim()) {
      Alert.alert("Campos obligatorios", "Completa título, zona y categoría.");
      return;
    }

    try {
      setLoading(true);
      await addDoc(collection(db, "places"), {
        title: title.trim(),
        zone: zone.trim(),
        categoria: categoria.trim(),
        description: description.trim(),
        schedule: schedule.trim(),
        imageUri: imageUri ?? "",
        createdBy: user.uid,
        createdAt: new Date().toISOString(),
      });

      Alert.alert("Éxito", "Lugar creado correctamente.");
      router.back();
    } catch (err) {
      console.error("Error al guardar:", err);
      Alert.alert("Error", "No se pudo guardar el lugar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text style={styles.title}>Crear lugar</Text>

        <TextInput
          placeholder="Título"
          placeholderTextColor={colors.textSecondary}
          style={[styles.input, { color: colors.text }]}
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          placeholder="Zona"
          placeholderTextColor={colors.textSecondary}
          style={[styles.input, { color: colors.text }]}
          value={zone}
          onChangeText={setZone}
        />

        <TextInput
          placeholder="Categoría"
          placeholderTextColor={colors.textSecondary}
          style={[styles.input, { color: colors.text }]}
          value={categoria}
          onChangeText={setCategoria}
        />

        <TextInput
          placeholder="Horario (opcional)"
          placeholderTextColor={colors.textSecondary}
          style={[styles.input, { color: colors.text }]}
          value={schedule}
          onChangeText={setSchedule}
        />

        <TextInput
          placeholder="Descripción (opcional)"
          placeholderTextColor={colors.textSecondary}
          style={[styles.textArea, { color: colors.text }]}
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <Pressable onPress={pickImage} style={styles.imageButton}>
          <Text style={{ color: colors.primary }}>
            {imageUri ? "Cambiar imagen" : "Seleccionar imagen"}
          </Text>
        </Pressable>

        {imageUri && (
          <Image
            source={{ uri: imageUri }}
            style={{ width: "100%", height: 180, borderRadius: 10 }}
          />
        )}

        <Pressable
          onPress={handleSave}
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: colors.primary,
              opacity: pressed || loading ? 0.9 : 1,
            },
          ]}
        >
          <Text style={[styles.buttonText, { color: colors.background }]}>
            {loading ? "Guardando..." : "Guardar lugar"}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scroll: {
      padding: 20,
      gap: 12,
    },
    backButton: {
      marginBottom: 12,
      padding: 8,
      alignSelf: "flex-start",
    },
    title: {
      fontSize: 22,
      fontWeight: "700",
      color: colors.text,
      textAlign: "center",
      marginBottom: 12,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      borderRadius: 10,
      paddingHorizontal: 14,
      paddingVertical: 12,
    },
    textArea: {
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      borderRadius: 10,
      paddingHorizontal: 14,
      paddingVertical: 12,
      minHeight: 80,
      textAlignVertical: "top",
    },
    imageButton: {
      alignItems: "center",
      paddingVertical: 10,
      borderWidth: 1,
      borderColor: colors.primary,
      borderRadius: 10,
    },
    button: {
      height: 52,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOpacity: 0.12,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 6 },
      elevation: 3,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: "700",
      textAlign: "center",
    },
    centered: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
});