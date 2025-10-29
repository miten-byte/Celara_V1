import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Send, Sparkles } from "lucide-react-native";
import { Image } from "expo-image";
import Colors from "@/constants/colors";
import { trpc } from "@/lib/trpc";

type Message = {
  role: "user" | "assistant";
  content: string;
  imageUrl?: string;
  timestamp: Date;
};

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatId, setChatId] = useState<string | undefined>(undefined);
  const [userId] = useState<string>("user-" + Date.now());
  const scrollViewRef = useRef<ScrollView>(null);

  const chatMutation = trpc.ai.chat.useMutation({
    onSuccess: (data: { chatId: string; message: string; messages: Message[] }) => {
      console.log("[Chat] Success:", data);
      setChatId(data.chatId);
      setMessages(data.messages as Message[]);
    },
    onError: (error: Error) => {
      console.error("[Chat] Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
          timestamp: new Date(),
        },
      ]);
    },
  });

  const generateImageMutation = trpc.ai.generateImage.useMutation({
    onSuccess: (data: { imageUrl: string; id: string }) => {
      console.log("[Image] Generated:", data);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Here's your image!",
          imageUrl: data.imageUrl,
          timestamp: new Date(),
        },
      ]);
    },
    onError: (error: Error) => {
      console.error("[Image] Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I couldn't generate the image. Please try again.",
          timestamp: new Date(),
        },
      ]);
    },
  });

  const handleSend = () => {
    if (!message.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");

    if (message.toLowerCase().includes("generate image") || message.toLowerCase().includes("create image")) {
      const prompt = message.replace(/generate image|create image/gi, "").trim();
      generateImageMutation.mutate({ prompt: prompt || message });
    } else {
      chatMutation.mutate({
        userId,
        message,
        chatId,
      });
    }
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const isLoading = chatMutation.isPending || generateImageMutation.isPending;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Sparkles color={Colors.light.primary} size={24} />
        <Text style={styles.headerTitle}>AI Assistant</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.length === 0 && (
            <View style={styles.emptyState}>
              <Sparkles color={Colors.light.textSecondary} size={48} />
              <Text style={styles.emptyTitle}>Welcome to AI Chat!</Text>
              <Text style={styles.emptyDescription}>
                Ask me anything or say &quot;generate image&quot; followed by a description
              </Text>
            </View>
          )}

          {messages.map((msg, index) => (
            <View
              key={index}
              style={[
                styles.messageWrapper,
                msg.role === "user" ? styles.userMessageWrapper : styles.assistantMessageWrapper,
              ]}
            >
              <View
                style={[
                  styles.messageBubble,
                  msg.role === "user" ? styles.userMessage : styles.assistantMessage,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    msg.role === "user" ? styles.userMessageText : styles.assistantMessageText,
                  ]}
                >
                  {msg.content}
                </Text>
                {msg.imageUrl && (
                  <Image
                    source={{ uri: msg.imageUrl }}
                    style={styles.messageImage}
                    contentFit="cover"
                  />
                )}
              </View>
            </View>
          ))}

          {isLoading && (
            <View style={styles.loadingWrapper}>
              <View style={styles.loadingBubble}>
                <ActivityIndicator color={Colors.light.primary} />
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={message}
              onChangeText={setMessage}
              placeholder="Type a message..."
              placeholderTextColor={Colors.light.textSecondary}
              multiline
              maxLength={500}
              editable={!isLoading}
            />
            <TouchableOpacity
              style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
              onPress={handleSend}
              disabled={!message.trim() || isLoading}
            >
              <Send
                color={message.trim() ? Colors.light.white : Colors.light.textSecondary}
                size={20}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.light.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    gap: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.light.text,
  },
  keyboardAvoid: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 80,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    paddingTop: 100,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginTop: 16,
  },
  emptyDescription: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: "center" as const,
    paddingHorizontal: 40,
  },
  messageWrapper: {
    marginBottom: 12,
  },
  userMessageWrapper: {
    alignItems: "flex-end" as const,
  },
  assistantMessageWrapper: {
    alignItems: "flex-start" as const,
  },
  messageBubble: {
    maxWidth: "80%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  userMessage: {
    backgroundColor: Colors.light.primary,
    borderBottomRightRadius: 4,
  },
  assistantMessage: {
    backgroundColor: Colors.light.white,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  userMessageText: {
    color: Colors.light.white,
  },
  assistantMessageText: {
    color: Colors.light.text,
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginTop: 8,
  },
  loadingWrapper: {
    alignItems: "flex-start" as const,
    marginBottom: 12,
  },
  loadingBubble: {
    backgroundColor: Colors.light.white,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  inputContainer: {
    position: "absolute" as const,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.light.white,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: Platform.OS === "ios" ? 24 : 12,
  },
  inputWrapper: {
    flexDirection: "row" as const,
    alignItems: "flex-end" as const,
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.light.background,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.light.text,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.light.primary,
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
  sendButtonDisabled: {
    backgroundColor: Colors.light.background,
  },
});
