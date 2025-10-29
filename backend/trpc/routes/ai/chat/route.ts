import { z } from "zod";
import { publicProcedure } from "../../create-context";
import { Chat } from "../../../models/chat.model";

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
      const response = await fetch("https://api.deepai.org/api/text-generator", {
        method: "POST",
        headers: {
          "api-key": process.env.DEEPAI_API_KEY || "quickstart-QUdJIGlzIGNvbWluZy4uLi4K",
        },
        body: new URLSearchParams({
          text: message,
        }),
      });

      if (!response.ok) {
        throw new Error(`DeepAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      const assistantMessage = data.output || "I'm having trouble responding right now.";

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
      console.error("DeepAI API error:", error);
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
