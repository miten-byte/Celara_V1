import { z } from "zod";
import { publicProcedure } from "../../create-context";
import { Chat } from "../../../models/chat.model";

export const listChatsProcedure = publicProcedure
  .input(
    z.object({
      userId: z.string(),
    })
  )
  .query(async ({ input }) => {
    const { userId } = input;

    const chats = await Chat.find({ userId }).sort({ updatedAt: -1 }).limit(20);

    return chats.map((chat) => ({
      chatId: chat._id.toString(),
      lastMessage: chat.messages[chat.messages.length - 1]?.content || "",
      updatedAt: chat.updatedAt,
    }));
  });
