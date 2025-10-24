import { useThemeColors } from "@/src/hooks/useThemeColors";
import { db } from "@/src/services/firebase/config";
import { useUserStore } from "@/src/store/useUserStore";
import { ThemeColors } from "@/src/theme/colors";
import { Place } from "@/src/types";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { uploadToCloudinary } from "@/src/services/cloudinary/cloudinary";
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

type Props = {
  existingPlace?: Place;
};

export default function PlaceForm({ existingPlace }: Props) {
  const { colors } = useThemeColors();
  const styles = createStyles(colors);
  const router = useRouter();
  const user = useUserStore((s) => s.currentUser);

  const [title, setTitle] = useState(existingPlace?.title ?? "");
  const [subtitle, setSubtitle] = useState(existingPlace?.subtitle ?? "");
  const [zona, setZona] = useState(existingPlace?.zona ?? "");
  const [categoria, setCategoria] = useState(existingPlace?.categoria ?? "");
  const [description, setDescription] = useState(existingPlace?.description ?? "");
  const [schedule, setSchedule] = useState(existingPlace?.schedule ?? "");
  const [latitude, setLatitude] = useState(existingPlace?.latitude?.toString() ?? "");
  const [longitude, setLongitude] = useState(existingPlace?.longitude?.toString() ?? "");
  const [tips, setTips] = useState(existingPlace?.tips?.join(", ") ?? "");
  const isHttpUrl = (u?: string | null) => !!u && /^https?:\/\//i.test(u);

  const [imageUri, setImageUri] = useState<string | null>(existingPlace?.imageUri ?? null);
  const [coverUri, setCoverUri] = useState<string | null>(existingPlace?.coverUri ?? null);
  const [loading, setLoading] = useState(false);

  if (user?.role !== "admin") {
    return (
      <View style={styles.centered}>
        <Text style={{ color: colors.text }}>You don't have permission to be here.</Text>
      </View>
    );
  }

  const pickImage = async (type: "image" | "cover") => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      if (type === "image") setImageUri(result.assets[0].uri);
      else setCoverUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !zona.trim() || !categoria.trim()) {
      Alert.alert("Required fields", "Please complete title, zone, and category.");
      return;
    }

    try {
      setLoading(true);
      let finalCoverUrl = coverUri ?? "";   
      let finalImageUrl = imageUri ?? "";


      if (coverUri === null) {
        finalCoverUrl = "";
      } else if (isHttpUrl(coverUri)) {
        finalCoverUrl = coverUri!;
      } else if (coverUri) {
        const up = await uploadToCloudinary(coverUri, {
          fileName: `place-cover-${existingPlace?.id ?? Date.now()}.jpg`,
          mimeType: "image/jpeg",
        });
        if (!up?.secure_url && !up?.url) throw new Error("No secure_url from Cloudinary (cover).");
        finalCoverUrl = up.secure_url ?? up.url ?? "";
      }

    
      if (imageUri === null) {
        finalImageUrl = "";
      } else if (isHttpUrl(imageUri)) {
        finalImageUrl = imageUri!;
      } else if (imageUri) {
        const up = await uploadToCloudinary(imageUri, {
          fileName: `place-image-${existingPlace?.id ?? Date.now()}.jpg`,
          mimeType: "image/jpeg",
        });
        if (!up?.secure_url && !up?.url) throw new Error("No secure_url from Cloudinary (image).");
        finalImageUrl = up.secure_url ?? up.url ?? "";
      }


      const payload = {
        title: title.trim(),
        subtitle: subtitle.trim(),
        zona: zona.trim(),
        categoria: categoria.trim(),
        description: description.trim(),
        schedule: schedule.trim(),
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        tips: tips ? tips.split(",").map((t) => t.trim()) : [],
        imageUri: finalImageUrl?? "",
        coverUri: finalCoverUrl?? "",
        createdBy: user.uid,
        updatedAt: new Date().toISOString(),
      };

      if (existingPlace?.id) {
        await updateDoc(doc(db, "places", existingPlace.id), payload);
        Alert.alert("Success", "Place updated successfully.");
      } else {
        await addDoc(collection(db, "places"), {
          ...payload,
          createdAt: new Date().toISOString(),
        });
        Alert.alert("Success", "Place created successfully.");
      }

      router.back();
    } catch (err) {
      console.error("Error saving:", err);
      Alert.alert("Error", "Could not save the place.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!existingPlace?.id) return;

    Alert.alert("Confirm deletion", "Are you sure you want to delete this place?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            setLoading(true);
            if (existingPlace?.id) {
              await deleteDoc(doc(db, "places", existingPlace.id));
            } else {
              throw new Error("Place ID is undefined.");
            }
            Alert.alert("Success", "Place deleted successfully.");
            router.push("/");
          } catch (err) {
            console.error("Error deleting:", err);
            Alert.alert("Error", "Could not delete the place.");
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  }
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>

        <Text style={styles.title}>
          {existingPlace ? "Edit Place" : "Create Place"}
        </Text>

        <TextInput placeholder="Title" style={[styles.input, { color: colors.text }]} value={title} onChangeText={setTitle} />
        <TextInput placeholder="Subtitle (optional)" style={[styles.input, { color: colors.text }]} value={subtitle} onChangeText={setSubtitle} />
        <TextInput placeholder="Zone" style={[styles.input, { color: colors.text }]} value={zona} onChangeText={setZona} />
        <TextInput placeholder="Category" style={[styles.input, { color: colors.text }]} value={categoria} onChangeText={setCategoria} />

        <TextInput placeholder="Schedule (optional)" style={[styles.input, { color: colors.text }]} value={schedule} onChangeText={setSchedule} />

        <TextInput placeholder="Description (optional)" style={[styles.textArea, { color: colors.text }]} value={description} onChangeText={setDescription} multiline />

        <TextInput placeholder="Latitude"  style={[styles.input, { color: colors.text }]} value={latitude} onChangeText={setLatitude} />
        <TextInput placeholder="Longitude" style={[styles.input, { color: colors.text }]} value={longitude} onChangeText={setLongitude} />

        <TextInput placeholder="Tips (separated by commas)" style={[styles.textArea, { color: colors.text }]} value={tips} onChangeText={setTips} multiline />

        <Pressable onPress={() => pickImage("cover")} style={styles.imageButton}>
          <Text style={{ color: colors.primary }}>{coverUri ? "Change Cover" : "Select Cover"}</Text>
        </Pressable>
        {coverUri && <Image source={{ uri: coverUri }} style={styles.previewImage} />}

        <Pressable onPress={() => pickImage("image")} style={styles.imageButton}>
          <Text style={{ color: colors.primary }}>{imageUri ? "Change Secondary Image" : "Select Secondary Image"}</Text>
        </Pressable>
        {imageUri && <Image source={{ uri: imageUri }} style={styles.previewImage} />}

        <Pressable onPress={handleSave} style={[styles.button, { backgroundColor: colors.primary }]}>
          <Text style={[styles.buttonText, { color: colors.background }]}>
            {loading ? "Saving..." : existingPlace ? "Update" : "Save"}
          </Text>
        </Pressable>
        {existingPlace && (
          <Pressable onPress={handleDelete} style={styles.buttonDelete}>
            <Text style={[styles.buttonText, { color: "#fff" }]}>
              {loading ? "Deleting..." : "Delete"}
            </Text>
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scroll: { padding: 20, gap: 12 },
    backButton: { marginBottom: 12, padding: 8, alignSelf: "flex-start" },
    title: { fontSize: 22, fontWeight: "700", color: colors.text, textAlign: "center", marginBottom: 12 },
    input: {
      borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface,
      borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12,
    },
    textArea: {
      borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface,
      borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, minHeight: 80,
      textAlignVertical: "top",
    },
    imageButton: {
      alignItems: "center", paddingVertical: 10,
      borderWidth: 1, borderColor: colors.primary, borderRadius: 10,
    },
    previewImage: { width: "100%", height: 180, borderRadius: 10, marginTop: 8 },
    button: {
      height: 52, 
      borderRadius: 14, alignItems: "center", justifyContent: "center",
      shadowColor: "#000", shadowOpacity: 0.12, shadowRadius: 10, shadowOffset: { width: 0, height: 6 },
    },
    buttonDelete: {
      height: 52,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center", 
      backgroundColor: colors.error, 
      shadowColor: "#000",
      shadowOpacity: 0.12,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 6 },
      marginTop: 8,
    },
    buttonText: { fontSize: 16, fontWeight: "700", textAlign: "center" },
    centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  });