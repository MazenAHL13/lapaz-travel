import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

import { useThemeColors } from "@/src/hooks/useThemeColors";
import { useUserStore } from "@/src/store/useUserStore";
import { StyleSheet } from "react-native";
import { ThemeColors } from "../../src/theme/colors";

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    tabBarStyle: {
      backgroundColor: colors.surface,
      borderTopColor: colors.border,
    },
  });

const TabsLayout = () => {
  const { colors } = useThemeColors();
  const styles = createStyles(colors);
  const user = useUserStore((state) => state.currentUser);

  return (
    <Tabs
      key={colors.background}
      initialRouteName="index"
      screenOptions={({ route }) => ({
        headerShown: true,
        headerStyle: { backgroundColor: colors.surface },
        headerTitleStyle: { color: colors.text },
        headerTintColor: colors.surface,
        tabBarActiveBackgroundColor: colors.surface,
        tabBarInactiveBackgroundColor: colors.background,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: styles.tabBarStyle,
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home";

          if (route.name === "index") iconName = "search";
          else if (route.name === "favorites") iconName = "star";
          else if (route.name === "settings") iconName = "settings";
          else if (route.name === "profile") iconName = "person";
          else if (route.name === "plan") iconName = "trail-sign";
          else if (route.name === "create") iconName = "add-circle";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}>
      <Tabs.Screen name="index" options={{ title: "Explorar" }} />
      <Tabs.Screen name="favorites" options={{ title: "Favoritos" }} />
      <Tabs.Screen name="plan" options={{ title: "Plan" }} />
      <Tabs.Screen name="settings" options={{ title: "Ajustes" }} />
      <Tabs.Screen name="profile" options={{ title: "Perfil" }} />
    </Tabs>
  );
};

export default TabsLayout;
