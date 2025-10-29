import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { Chat } from "../../../../models/chat.model";
import { openai } from "../../../../lib/openai";

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
      console.log("[Chat] Sending message to OpenAI:", message);

      const conversationHistory = chat.messages.map((msg: any) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      }));

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: conversationHistory,
        max_tokens: 500,
        temperature: 0.7,
      });

      const assistantMessage = completion.choices[0]?.message?.content || "I'm having trouble responding right now. Please try again.";

      console.log("[Chat] OpenAI response:", assistantMessage);

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
