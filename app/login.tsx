import { useState } from "react";
import { useRouter } from "expo-router";
import {
  Image,
  SafeAreaView,
  TextInput,
  Pressable,
  Text,
  View,
  StyleSheet,
  Alert,
} from "react-native";
import { useThemeColors } from "./hooks/useThemeColors";
import { ThemeColors } from "./theme/colors";
import { useUserStore } from "./store/useUserStore";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen() {
  const { colors } = useThemeColors();
  const router = useRouter();
  const styles = createStyles(colors);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = useUserStore((s) => s.login);

  const handleLogin = () => {
    const success = login(email.trim(), password.trim());

  if (!success) {
    Alert.alert(
      "Error de inicio de sesión",
      "Usuario o contraseña incorrectos."
    );
    return;
  }

  router.replace("/(tabs)");
};

const [showPassword, setShowPassword] = useState(false);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.card}>
        <TextInput
          style={[styles.input, { color: colors.text, borderColor: colors.border }]}
          placeholder="Usuario o correo"
          placeholderTextColor={colors.textSecondary}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <View style={{ position: "relative" }}>
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.border }]}
            placeholder="Contraseña"
            placeholderTextColor={colors.textSecondary}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <Pressable
              onPress={() => setShowPassword((v) => !v)}
              style={{
                position: "absolute",
                right: 14,
                top: 14,
              }}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={22}
                color={colors.textSecondary}
              />
            </Pressable>
          </View>
        <Pressable
          onPress={handleLogin}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: colors.primary, opacity: pressed ? 0.9 : 1 },
          ]}
        >
          <Text style={[styles.buttonText]}>
            Log in
          </Text>
        </Pressable>

        <Pressable
          onPress={handleLogin}
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: colors.background,
              borderWidth: 2,
              borderColor: colors.primary,
              opacity: pressed ? 0.9 : 1,
            },
          ]}
        >
          <Text style={[styles.buttonText, { color: colors.primary }]}>Sign up</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.background,
    },
    card: { width: "85%", gap: 14 },
    input: {
      height: 52,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      borderRadius: 14,
      paddingHorizontal: 14,
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
    logo: {
      width: 150,
      height: 150,
    },
    logoContainer: {
      alignItems: "center",
      marginBottom: 40,
    },
  });