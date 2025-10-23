import { useThemeColors } from "@/src/hooks/useThemeColors";
import { auth } from "@/src/services/firebase/config";
import { ThemeColors } from "@/src/theme/colors";
import { useRouter } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth";
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

export default function ForgotPasswordScreen() {
  const { colors, theme } = useThemeColors();
  const styles = createStyles(colors);
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [emailValid, setEmailValid] = useState(true);
  const [loading, setLoading] = useState(false);

  const validateEmail = (text: string) => {
    setEmail(text);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailValid(emailRegex.test(text.trim()));
  };

  const handleForgotPassword = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      Alert.alert("Campo requerido", "Por favor, ingresa tu correo electrónico.");
      return;
    }

    if (!emailValid) {
      Alert.alert("Correo inválido", "Por favor, introduce un correo válido.");
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, trimmedEmail);
      Alert.alert(
        "Correo enviado",
        "Se ha enviado un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada."
      );
      router.push("/(auth)/login");
    } catch (error: any) {
      console.error("Error al enviar correo:", error);
      Alert.alert("Error", error.message || "No se pudo enviar el correo.");
    } finally {
      setLoading(false);
    }
  };

  const logoSource =
    theme === "dark"
      ? require("../../assets/images/logoDark.png")
      : require("../../assets/images/logo.png");

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={logoSource} style={styles.logo} resizeMode="contain" />
      </View>

      <View style={styles.card}>
        <Text style={[styles.title, { color: colors.text }]}>
          Reset Password
        </Text>

        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Enter your email address and we'll send you a link to reset your password.
        </Text>

        <TextInput
          style={[
            styles.input,
            {
              color: colors.text,
              borderColor: emailValid ? colors.border : "red",
            },
          ]}
          placeholder="Email"
          placeholderTextColor={colors.textSecondary}
          value={email}
          onChangeText={validateEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Pressable
          onPress={handleForgotPassword}
          disabled={loading}
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: colors.primary,
              opacity: pressed || loading ? 0.9 : 1,
            },
          ]}
        >
          <Text style={[styles.buttonText, { color: colors.background }]}>
            {loading ? "Enviando..." : "Enviar enlace"}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.push("/(auth)/login")}
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
          <Text style={[styles.buttonText, { color: colors.primary }]}>
            Volver al login
          </Text>
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
    logoContainer: {
      alignItems: "center",
      marginBottom: 40,
    },
    logo: {
      width: 150,
      height: 150,
    },
    card: {
      width: "85%",
      gap: 14,
    },
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
    title: {
      fontSize: 22,
      fontWeight: "700",
      textAlign: "center",
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 14,
      textAlign: "center",
      marginBottom: 10,
    },
  });