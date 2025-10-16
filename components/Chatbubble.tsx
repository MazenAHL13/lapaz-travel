import React from "react";
import { View, Text, StyleSheet, Image} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "../app/hooks/useThemeColors";
import { ThemeColors } from "../app/theme/colors";
import Markdown from "react-native-markdown-display";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  time?: string;
  photos?: string[];
  showAvatar?: boolean;
};

type Props = { message: ChatMessage };

export default function ChatBubble({ message }: Props) {
  const { colors } = useThemeColors();
  const isUser = message.role === "user";
  const styles = getStyles(colors, isUser);

  return (
    <View
      style={[
        baseStyles.messageRow,
        { flexDirection: isUser ? "row-reverse" : "row" },
      ]}
    >
      {/* Avatar */}
      {message.showAvatar !== false && (
        <View style={baseStyles.avatarSlot}>
          <View style={styles.avatar}>
            {isUser ? (
              <Text style={styles.avatarText}>Tú</Text>
            ) : (
              <Ionicons name="sparkles-outline" size={16} color="#fff" />
            )}
          </View>
        </View>
      )}

      {/* Burbuja */}
      <View style={[baseStyles.bubbleShell, isUser ? { marginRight: 6 } : { marginLeft: 6 }]}>
        <View style={styles.bubble}>
          {!isUser && (
            <Text style={styles.assistantLabel}>Asistente</Text>
          )}
          <Markdown
            style={{
              body: styles.text,
              paragraph: { marginTop: 0, marginBottom: 4 },
            }}
          >
            {message.content}
          </Markdown>

          {message.photos?.map((uri, i) => (
            <Image
              key={i}
              source={{ uri }}
              style={{ width: 200, height: 200, borderRadius: 8, marginTop: 8 }}
            />
          ))}

          <Text style={styles.time}>{message.time}</Text>
        </View>
      </View>
    </View>
  );
}

const baseStyles = StyleSheet.create({
  messageRow: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: "flex-end",
  },
  avatarSlot: {
    width: 34,
    alignItems: "center",
  },
  bubbleShell: {
    maxWidth: "72%",
  },
});

const getStyles = (colors: ThemeColors, isUser: boolean) =>
  StyleSheet.create({
    avatar: {
      width: 30,
      height: 30,
      borderRadius: 15,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isUser ? colors.primary : colors.muted,
    },
    avatarText: { color: "#fff", fontWeight: "600", fontSize: 12 },
    bubble: {
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 10,
      paddingVertical: 8,
      backgroundColor: isUser ? colors.primary : colors.surface,
    },
    text: {
      fontSize: 14,
      lineHeight: 20,
      color: isUser ? "#fff" : colors.text,
    },
    assistantLabel: {
      fontSize: 12,
      fontWeight: "600",
      color: colors.muted,
      marginBottom: 2,
    },
    time: {
      alignSelf: isUser ? "flex-end" : "flex-start",
      fontSize: 10,
      color: isUser ? "#E7F1FF" : colors.textSecondary,
      marginTop: 4,
    },
  });