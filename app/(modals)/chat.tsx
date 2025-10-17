import BackButton from "@/components/Backbutton";
import { useRef, useState } from "react";
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
} from "react-native";
import ChatBubble, { ChatMessage } from "../../components/Chatbubble";
import { ChatComposer } from "../../components/ChatComposer";
import { useThemeColors } from "../hooks/useThemeColors";

export default function ChatModal() {
  const { colors } = useThemeColors();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content: "¡Hola! Cuéntame qué tipo de lugares te gustaría visitar hoy 🌄",
      time: "Ahora",
    },
  ]);

  const listRef = useRef<FlatList<ChatMessage>>(null);

  const scrollToEnd = () => {
    requestAnimationFrame(() => {
      listRef.current?.scrollToEnd({ animated: true });
    });
  };

  const send = () => {
    const text = input.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      time: "Ahora",
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    scrollToEnd();

    setTimeout(() => {
      const reply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "Respuesta mock",
        time: "Ahora",
      };
      setMessages((prev) => [...prev, reply]);
      scrollToEnd();
    }, 500);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({ ios: "padding", android: undefined })}
        keyboardVerticalOffset={Platform.select({ ios: 0, android: 0 }) ?? 0}
      >
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          ListHeaderComponent={<BackButton />}
          renderItem={({ item }) => <ChatBubble message={item} />}
          contentContainerStyle={{
            paddingVertical: 10,
            paddingHorizontal: 8,
          }}
          onContentSizeChange={scrollToEnd}
          onLayout={scrollToEnd}
        />

        <ChatComposer
          value={input}
          onChangeText={setInput}
          onSend={send}
          isThinking={false}
          paddingBottom={16}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});