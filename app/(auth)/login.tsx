import { useThemeColors } from "@/src/hooks/useThemeColors";
import { auth } from "@/src/services/firebase/config";
import { useUserStore } from "@/src/store/useUserStore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { ThemeColors } from "../../src/theme/colors";


export default function LoginScreen() {
  const { theme, colors } = useThemeColors();
  const router = useRouter();
  const styles = createStyles(colors);
  const setUser = useUserStore((state) => state.setUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
  
    if (!trimmedEmail || !trimmedPassword) {
      Alert.alert("Campos requeridos", "Debes llenar ambos campos.");
      return;
    }
  
    try {
      const cred = await signInWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
      if (cred.user.email) {
        setUser({ ...cred.user, email: cred.user.email });
      } else {
        Alert.alert("Error", "El usuario no tiene un correo electrónico válido.");
      }
      Alert.alert("Éxito", "Inicio de sesión correcto.");
      router.replace("/(tabs)");
    } catch (error: any) {
    
      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential"
      ) {
        Alert.alert("Error de inicio de sesión", "Usuario o contraseña incorrecta.");
      } else if (error.code === "auth/invalid-email") {
        Alert.alert("Error de inicio de sesión", "Correo electrónico inválido.");
      } else {
        Alert.alert(
          "Error de inicio de sesión",
          error.message || "Ocurrió un error inesperado."
        );
      }
    }
  };

  const handleRegister = () => {
    router.push("/(auth)/register");
  };

  const [showPassword, setShowPassword] = useState(false);

  const logoSource =
    theme === "dark"
      ? require("../../assets/images/logoDark.png")
      : require("../../assets/images/logo.png");

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.logoContainer}>
        <Image
          source={logoSource}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.card}>
        <TextInput
          style={[styles.input, { color: colors.text, borderColor: colors.border }]}
          placeholder="Email"
          placeholderTextColor={colors.textSecondary}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <View style={{ position: "relative" }}>
          <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border }]}
              placeholder="Password"
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
          onPress={handleRegister}
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