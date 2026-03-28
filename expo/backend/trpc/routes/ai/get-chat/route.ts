import { z } from "zod";
import { publicProcedure } from "../../create-context";
import { Chat } from "../../../models/chat.model";

export const getChatProcedure = publicProcedure
  .input(
    z.object({
      chatId: z.string(),
    })
  )
  .query(async ({ input }) => {
    const { chatId } = input;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      throw new Error("Chat not found");
    }

    return {
      chatId: chat._id.toString(),
      messages: chat.messages,
    };
  });
