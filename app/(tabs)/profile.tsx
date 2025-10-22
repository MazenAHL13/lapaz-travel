import { useThemeColors } from "@/src/hooks/useThemeColors";
import { useUserStore } from "@/src/store/useUserStore";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Image, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function ProfileScreen() {
  const { colors } = useThemeColors();
  const user = useUserStore((s) => s.currentUser);
  const logout = useUserStore((s) => s.logout);
  const setAvatar = useUserStore((s) => s.setAvatar);
  const clearAvatar = useUserStore((s) => s.clearAvatar);
  const [isEditing, setIsEditing] = useState(false);
  const [tempAvatarUri, setTempAvatarUri] = useState<string | null | undefined>(undefined);
  const styles = createStyles(colors);


  const handleLogout = async () => {
    logout();
    router.replace("/login");
  };


  const pickImage = async () => {
    if (!isEditing) return; 

    Alert.alert(
      "Cambiar foto de perfil",
      "¿Deseas seleccionar una nueva foto desde tu galería?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Elegir",
          onPress: async () => {
            const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!granted) {
              Alert.alert("Permiso requerido", "Concede acceso a tu galería para elegir una foto.");
              return;
            }

            const res = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.9,
            });

            if (!res.canceled && res.assets.length > 0) {
              setTempAvatarUri(res.assets[0].uri);
            }
          },
        },
      ]
    );
  };

  const handleRemovePhoto = () => {
    Alert.alert("Quitar foto", "¿Estás seguro de eliminar tu foto de perfil?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: () => setTempAvatarUri(null) },
    ]);
  };

  const Avatar = () => {
    const sourceUri = isEditing ? tempAvatarUri : user?.avatar;

    if (sourceUri) {
      return (
        <Image
          source={{ uri: sourceUri }}
          style={{
            width: 96,
            height: 96,
            borderRadius: 48,
            borderWidth: 2,
            borderColor: colors.border,
            opacity: isEditing ? 0.9 : 1,
          }}
        />
      );
    }
    return <Ionicons name="person-circle" size={96} color={colors.text} />;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: 16, gap: 16 }}>
        <View style={{ alignItems: "center", gap: 8 }}>
          <Pressable onPress={pickImage} disabled={!isEditing}>
            <Avatar />
          </Pressable>

          {isEditing && (
  <>
          <Text style={{ fontSize: 16, color: colors.textSecondary, marginTop: 4 }}>
            Toca la imagen para cambiar tu foto
          </Text>

          {tempAvatarUri && (
            <Pressable
              onPress={handleRemovePhoto}
              style={({ pressed }) => [
                styles.removePhotoButton,
                {
                  backgroundColor: pressed
                    ? colors.error
                    : colors.background,
                  borderColor: colors.error,
                },
              ]}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Ionicons name="trash-outline" size={18} color={colors.error} />
                <Text style={{ fontSize: 14, fontWeight: "600", color: colors.error }}>
                  Quitar foto
                </Text>
              </View>
            </Pressable>
          )}
        </>
      )}

          <Text style={{ fontSize: 20, fontWeight: "700", color: colors.text }}>
            {user?.name ?? "Usuario"} 
          </Text>
          <Text style={{ color: colors.textSecondary }}>{user?.email ?? "—"}</Text>
        </View>

   
        <View
          style={{
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 12,
            padding: 16,
            gap: 6,
          }}
        >
          <Text style={{ color: colors.textSecondary }}>⚑ Favoritos: próximamente</Text>
          <Text style={{ color: colors.textSecondary }}>✈ Viajes guardados: próximamente</Text>
        </View>

     
        <View style={{ gap: 12 }}>
      
          <Pressable
            style={{
              backgroundColor: isEditing ? colors.surface : colors.primary,
              borderWidth: isEditing ? 2 : 0,
              borderColor: colors.primary,
              paddingVertical: 12,
              borderRadius: 12,
              alignItems: "center",
            }}
            onPress={() => {
              if (isEditing) {
                if (tempAvatarUri) {
                  setAvatar(tempAvatarUri);
                } else if (tempAvatarUri === null) {
                  clearAvatar();
                }
                setIsEditing(false);
                Alert.alert("Cambios guardados", "Tu perfil ha sido actualizado.");
              } else {
                setTempAvatarUri(user?.avatar);
                setIsEditing(true);
              }
            }}
          >
            <Text
              style={{
                fontWeight: "700",
                color: isEditing ? colors.primary : colors.surface,
              }}
            >
              {isEditing ? "Guardar cambios" : "Editar perfil"}
            </Text>
          </Pressable>

       
          <Pressable
            style={{
              borderWidth: 1,
              borderColor: colors.border,
              paddingVertical: 12,
              borderRadius: 12,
              alignItems: "center",
            }}
            onPress={handleLogout}
          >
            <Text style={{ color: colors.text, fontWeight: "700" }}>
              Cerrar sesión
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
const createStyles = (colors: any) =>
  StyleSheet.create({
    removePhotoButton: {
      paddingVertical: 8,
      paddingHorizontal: 14,
      borderRadius: 10,
      borderWidth: 1.5,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 6,
    },
  });