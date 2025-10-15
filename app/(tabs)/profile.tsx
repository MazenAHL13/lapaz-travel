import { SafeAreaView, View, Text, Pressable, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "../hooks/useThemeColors";

export default function ProfileScreen() {
  const { colors } = useThemeColors();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: 16, gap: 16 }}>
        <View style={{ alignItems: "center", gap: 8 }}>
          <Ionicons name="person-circle" size={96} color={colors.text} />
          <Text style={{ fontSize: 20, fontWeight: "700", color: colors.text }}>
            UsuarioDemo
          </Text>
          <Text style={{ color: colors.textSecondary }}>demo@lapaz.travel</Text>
        </View>

        <View
          style={{
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 12,
            padding: 16,
            gap: 6,
          }}>
          <Text style={{ color: colors.textSecondary }}>
            ⚑ Favoritos: próximamente
          </Text>
          <Text style={{ color: colors.textSecondary }}>
            ✈ Viajes guardados: próximamente
          </Text>
        </View>

        <View style={{ gap: 12 }}>
          <Pressable
            style={{
              backgroundColor: colors.primary,
              paddingVertical: 12,
              borderRadius: 12,
              alignItems: "center",
            }}>
            <Text style={{ fontWeight: "700" }}>
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
            onPress={() => {}}
            accessibilityRole="button"
            accessibilityLabel="Cerrar sesión">
            <Text style={{ color: colors.text, fontWeight: "700" }}>
              Cerrar sesión (mock)
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}