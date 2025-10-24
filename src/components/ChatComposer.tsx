import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { useThemeColors } from "../hooks/useThemeColors";

export function ChatComposer({
  value,
  onChangeText,
  onSend,
  onPickImage,
  isThinking,
  paddingBottom = 16,
}: {
  value: string;
  onChangeText: (t: string) => void;
  onSend: () => void;
  onPickImage?: () => void;
  isThinking?: boolean;
  paddingBottom?: number;
}) {
  //Listeners del teclado
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      "keyboardDidShow",
      (event) => {
        // Aquí obtenemos la altura en píxeles
        setKeyboardHeight(event.endCoordinates.height);
      }
    );
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);
  const { colors } = useThemeColors();
  return (
    <View
      style={[
        styles.row,
        { borderTopColor: colors.border, paddingBottom },
        { marginBottom: keyboardHeight },
      ]}>
      {onPickImage && (
        <Pressable
          onPress={onPickImage}
          style={[styles.iconBtn, { borderColor: colors.border }]}>
          <Ionicons name="image-outline" size={20} color={colors.text} />
        </Pressable>
      )}
      <TextInput
        style={[
          styles.input,
          {
            borderColor: colors.border,
            color: colors.text,
            backgroundColor: colors.surface,
          },
        ]}
        placeholder="Escribe un mensaje…"
        placeholderTextColor={colors.textSecondary}
        value={value}
        onChangeText={onChangeText}
        multiline
      />
      <Pressable
        onPress={onSend}
        style={[styles.send, { backgroundColor: colors.primary }]}>
        {isThinking ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Ionicons name="paper-plane" size={16} color="#fff" />
        )}
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 8,
    borderTopWidth: 1,
  },
  iconBtn: { padding: 8, borderWidth: 1, borderRadius: 10, marginRight: 8 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxHeight: 120,
  },
  send: { padding: 10, borderRadius: 12, marginLeft: 8 },
});
