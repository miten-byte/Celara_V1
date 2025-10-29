import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { Chat } from "../../../../models/chat.model";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export const chatProcedure = publicProcedure
  .input(
    z.object({
      userId: z.string(),
      message: z.string(),
      chatId: z.string().optional(),
    })
  )
  .mutation(async ({ input }) => {
    const { userId, message, chatId } = input;

    let chat;
    if (chatId) {
      chat = await Chat.findById(chatId);
    } else {
      chat = new Chat({ userId, messages: [] });
    }

    if (!chat) {
      throw new Error("Chat not found");
    }

    chat.messages.push({
      role: "user",
      content: message,
      timestamp: new Date(),
    });

    try {
      console.log("[Chat] Sending message:", message);

      const conversationHistory: Message[] = chat.messages.map((msg: any) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      }));

      const toolkitUrl = process.env.EXPO_PUBLIC_TOOLKIT_URL || "https://toolkit.rork.com";
      const chatUrl = new URL("/agent/chat", toolkitUrl).toString();
      
      console.log("[Chat] Calling API:", chatUrl);

      const response = await fetch(chatUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: conversationHistory,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("[Chat] API error:", response.status, errorText);
        throw new Error(`Chat API error: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No response stream available");
      }

      const decoder = new TextDecoder();
      let assistantMessage = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("0:")) {
            try {
              const jsonStr = line.slice(2);
              const parsed = JSON.parse(jsonStr);
              if (parsed.type === "text-delta" && parsed.textDelta) {
                assistantMessage += parsed.textDelta;
              }
            } catch (e) {
              console.error("[Chat] Failed to parse chunk:", e);
            }
          }
        }
      }

      if (!assistantMessage) {
        assistantMessage = "I'm having trouble responding right now. Please try again.";
      }

      console.log("[Chat] Assistant response:", assistantMessage);

      chat.messages.push({
        role: "assistant",
        content: assistantMessage,
        timestamp: new Date(),
      });

      await chat.save();

      return {
        chatId: chat._id.toString(),
        message: assistantMessage,
        messages: chat.messages,
      };
    } catch (error) {
      console.error("[Chat] Error:", error);
      const errorMessage = "Sorry, I encountered an error. Please try again.";

      chat.messages.push({
        role: "assistant",
        content: errorMessage,
        timestamp: new Date(),
      });

      await chat.save();

      return {
        chatId: chat._id.toString(),
        message: errorMessage,
        messages: chat.messages,
      };
    }
  });
