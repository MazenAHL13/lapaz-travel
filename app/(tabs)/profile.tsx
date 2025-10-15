import { SafeAreaView, View, Text, Pressable, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "../hooks/useThemeColors";
import { useUserStore } from "../store/useUserStore";
import { router } from "expo-router";

export default function ProfileScreen() {
  const { colors } = useThemeColors();
  const user = useUserStore((s) => s.currentUser);
  const logout = useUserStore((s) => s.logout);

  const handleLogout = async () => {
    await logout();            
    router.replace("/login"); 
  };

  const Avatar = () => {
    if (user?.avatar) {
      return typeof user.avatar === "string" ? (
        <Image source={{ uri: user.avatar }} style={{ width: 96, height: 96, borderRadius: 48 }} />
      ) : (
        <Image source={user.avatar} style={{ width: 96, height: 96, borderRadius: 48 }} />
      );
    }
    return <Ionicons name="person-circle" size={96} color={colors.text} />;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: 16, gap: 16 }}>
        <View style={{ alignItems: "center", gap: 8 }}>
          <Avatar />
          <Text style={{ fontSize: 20, fontWeight: "700", color: colors.text }}>
            {user?.name ?? "Invitado"}
          </Text>
          <Text style={{ color: colors.textSecondary }}>
            {user?.email ?? "—"}
          </Text>
        </View>

        <View
          style={{
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 12,
            padding: 16,
            gap: 6,
          }}>
          <Text style={{ color: colors.textSecondary }}>⚑ Favoritos: próximamente</Text>
          <Text style={{ color: colors.textSecondary }}>✈ Viajes guardados: próximamente</Text>
        </View>

        {/* Acciones */}
        <View style={{ gap: 12 }}>
          <Pressable
            style={{
              backgroundColor: colors.primary,
              paddingVertical: 12,
              borderRadius: 12,
              alignItems: "center",
            }}
            accessibilityRole="button"
            accessibilityLabel="Editar perfil (próximamente)"
            onPress={() => {}}
          >
            <Text style={{ fontWeight: "700", color: colors.primary }}>
              Editar perfil
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
            accessibilityRole="button"
            accessibilityLabel="Cerrar sesión"
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