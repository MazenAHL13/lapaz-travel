import { useUserStore } from "@/src/store/useUserStore";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, View } from "react-native";

export default function SplashScreen() {
  const { currentUser } = useUserStore();
  const router = useRouter();
  const [isRouterReady, setIsRouterReady] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsRouterReady(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!isRouterReady) return;

    if (currentUser === null) {
      router.replace("/(auth)/login");
    } else if (currentUser) {
      router.replace("/(tabs)");
    }
  }, [currentUser, isRouterReady]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
      }}
    >
      <Image
        source={require("@/assets/images/logo.png")}
        style={{ width: 140, height: 140, marginBottom: 30 }}
        resizeMode="contain"
      />
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );
}