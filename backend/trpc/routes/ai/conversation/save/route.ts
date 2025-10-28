import { z } from "zod";
import { publicProcedure } from "../../../../create-context";
import { connectToDatabase } from "../../../../../lib/mongodb";
import { Conversation, ConversationMessage } from "../../../../../models/conversation.model";

export const saveConversationProcedure = publicProcedure
  .input(
    z.object({
      sessionId: z.string(),
      message: z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
        toolsUsed: z.array(z.string()).optional(),
      }),
      context: z.object({
        productsViewed: z.array(z.string()).optional(),
        categoriesInterested: z.array(z.string()).optional(),
        priceRange: z.object({
          min: z.number().optional(),
          max: z.number().optional(),
        }).optional(),
        customDesignRequested: z.boolean().optional(),
      }).optional(),
    })
  )
  .mutation(async ({ input }: { input: { sessionId: string; message: { role: 'user' | 'assistant'; content: string; toolsUsed?: string[] }; context?: any } }) => {
    console.log("[Conversation Save] Saving message for session:", input.sessionId);

    try {
      const { db } = await connectToDatabase();
      const collection = db.collection<Conversation>("conversations");

      const newMessage: ConversationMessage = {
        role: input.message.role,
        content: input.message.content,
        timestamp: new Date(),
        toolsUsed: input.message.toolsUsed,
      };

      const existingConversation = await collection.findOne({
        sessionId: input.sessionId,
      });

      if (existingConversation) {
        await collection.updateOne(
          { sessionId: input.sessionId },
          {
            $push: { messages: newMessage as any },
            $set: {
              context: input.context || existingConversation.context,
              updatedAt: new Date(),
            },
          }
        );
      } else {
        const newConversation: Omit<Conversation, "_id"> = {
          sessionId: input.sessionId,
          messages: [newMessage],
          feedback: [],
          context: input.context || {},
          isTrainingData: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await collection.insertOne(newConversation as any);
      }

      console.log("[Conversation Save] Message saved");

      return {
        success: true,
      };
    } catch (error) {
      console.error("[Conversation Save] Error:", error);
      throw new Error("Failed to save conversation");
    }
  });
