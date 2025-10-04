import { View, Text } from "react-native";

export default function SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20, fontWeight: "700" }}>⚙️ Ajustes</Text>
      <Text>Configuración de tema e información general.</Text>
    </View>
  );
}