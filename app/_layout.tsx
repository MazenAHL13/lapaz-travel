import { useThemeStore } from "@/src/store/useThemeStore";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function RootLayout() {
  const theme = useThemeStore((state) => state.theme);
  return (
    <>
      <StatusBar
          barStyle={theme === "dark" ? "light-content" : "dark-content"}
          backgroundColor="transparent"
          translucent
        />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </> 
  );
}