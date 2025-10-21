import { useThemeColors } from "@/src/hooks/useThemeColors";
import { auth, db } from "@/src/services/firebase/config";
import { useUserStore } from "@/src/store/useUserStore";
import { ThemeColors } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { Alert, Image, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";

export default function RegisterScreen() {
  const { colors, theme } = useThemeColors();
  const styles = createStyles(colors);
  const setUser = useUserStore((state) => state.setUser);
  
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailValid, setEmailValid] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);

  const validateEmail = (text: string) => {
    setEmail(text);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailValid(emailRegex.test(text.trim()));
  };

  const validatePassword = (text: string) => {
    setPassword(text);
    setPasswordValid(text.trim().length >= 6);
  };

  const handleRegister = async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
  
    if (!trimmedEmail || !trimmedPassword) {
      Alert.alert("Campos requeridos", "Completa todos los campos");
      return;
    }
  
    if (!emailValid) {
      Alert.alert("Correo inválido", "Por favor, introduce un correo válido.");
      return;
    }
  
    if (!passwordValid) {
      Alert.alert("Contraseña demasiado corta", "La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
  
      await setDoc(doc(db, "users", cred.user.uid), {
        uid: cred.user.uid,
        email: cred.user.email,
        createdAt: new Date().toISOString(),
      });
  
      setUser(cred.user);
  
      Alert.alert("Éxito", "Usuario registrado correctamente.");
      router.replace("/(tabs)");
    } catch (err: any) {
      console.error("Firebase Error:", err);
      Alert.alert("Error", err.message || "No se pudo registrar el usuario.");
    }
  };

  const logoSource =
    theme === "dark"
      ? require("../../assets/images/logoDark.png")
      : require("../../assets/images/logo.png");

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={logoSource}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.card}>
        <TextInput
          style={[
            styles.input,
            { 
              color: colors.text, 
              borderColor: emailValid ? colors.border : "red" 
            },
          ]}
          placeholder="Correo electrónico"
          placeholderTextColor={colors.textSecondary}
          value={email}
          onChangeText={validateEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <View style={{ position: "relative" }}>
          <TextInput
            style={[styles.input, { 
              color: colors.text, 
              borderColor: passwordValid ? colors.border : "red"}]}
            placeholder="Contraseña"
            placeholderTextColor={colors.textSecondary}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={validatePassword}
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
          onPress={handleRegister}
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: colors.primary,
              opacity: pressed ? 0.9 : 1,
            },
          ]}
        >
          <Text style={[styles.buttonText, { color: colors.background }]}>
            Create account
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
          <Text style={[styles.buttonText, { color: colors.primary }]}>Back to login</Text>
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