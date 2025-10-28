import { z } from "zod";
import { publicProcedure } from "../../../../create-context";
import { connectToDatabase } from "../../../../../lib/mongodb";
import { Conversation, ConversationFeedback } from "../../../../../models/conversation.model";

export const addFeedbackProcedure = publicProcedure
  .input(
    z.object({
      sessionId: z.string(),
      messageIndex: z.number(),
      rating: z.enum(["helpful", "not-helpful"]),
      comment: z.string().optional(),
    })
  )
  .mutation(async ({ input }: { input: { sessionId: string; messageIndex: number; rating: 'helpful' | 'not-helpful'; comment?: string } }) => {
    console.log("[Conversation Feedback] Adding feedback for session:", input.sessionId);

    try {
      const { db } = await connectToDatabase();
      const collection = db.collection<Conversation>("conversations");

      const newFeedback: ConversationFeedback = {
        messageIndex: input.messageIndex,
        rating: input.rating,
        comment: input.comment,
        timestamp: new Date(),
      };

      const result = await collection.updateOne(
        { sessionId: input.sessionId },
        {
          $push: { feedback: newFeedback as any },
          $set: { updatedAt: new Date() },
        }
      );

      if (result.matchedCount === 0) {
        throw new Error("Conversation not found");
      }

      if (input.rating === "helpful") {
        const conversation = await collection.findOne({ sessionId: input.sessionId });
        if (conversation && conversation.messages[input.messageIndex]) {
          const message = conversation.messages[input.messageIndex];
          if (message.toolsUsed && message.toolsUsed.includes("searchKnowledge")) {
            console.log("[Conversation Feedback] Positive feedback for knowledge search, marking for training");
            await collection.updateOne(
              { sessionId: input.sessionId },
              { $set: { isTrainingData: true } }
            );
          }
        }
      }

      console.log("[Conversation Feedback] Feedback added");

      return {
        success: true,
      };
    } catch (error) {
      console.error("[Conversation Feedback] Error:", error);
      throw new Error("Failed to add feedback");
    }
  });
