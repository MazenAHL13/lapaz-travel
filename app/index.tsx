import { useUserStore } from "@/src/store/useUserStore";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function SplashScreen() {
  const { user } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (user) router.replace("/(tabs)");
      else router.replace("/(auth)/login");
    }, 1200);

    return () => clearTimeout(timeout);
  }, [user]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}