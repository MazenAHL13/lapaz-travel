import { FlatList } from "react-native";
import ChatBubble, { ChatMessage } from "./Chatbubble";
import { RefObject } from "react";

export function MessageList({
  messages, listRef, bottomSpacing = 24,
}: {
  messages: ChatMessage[];
  listRef: RefObject<FlatList<ChatMessage>>;
  bottomSpacing?: number;
}) {
  return (
    <FlatList
      ref={listRef}
      data={messages}
      keyExtractor={(m) => m.id}
      renderItem={({ item }) => <ChatBubble message={item} />}
      contentContainerStyle={{ paddingVertical: 10, paddingBottom: bottomSpacing }}
      onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
      onLayout={() => listRef.current?.scrollToEnd({ animated: true })}
    />
  );
}