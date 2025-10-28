import { z } from "zod";
import { protectedProcedure } from "../../../create-context";
import { getDb } from "../../../../lib/mongodb";
import { AIKnowledge } from "../../../../models/ai-knowledge.model";
import { ObjectId } from "mongodb";

export const updateKnowledgeProcedure = protectedProcedure
  .input(
    z.object({
      id: z.string(),
      title: z.string().optional(),
      content: z.string().optional(),
      keywords: z.array(z.string()).optional(),
      priority: z.number().optional(),
      isActive: z.boolean().optional(),
    })
  )
  .mutation(async ({ input }) => {
    console.log("[AI Knowledge Update] Updating knowledge:", input.id);

    try {
      const db = await getDb();
      const collection = db.collection<AIKnowledge>("aiknowledges");

      const updateData: any = {
        updatedAt: new Date(),
      };

      if (input.title) updateData.title = input.title;
      if (input.content) updateData.content = input.content;
      if (input.keywords) updateData.keywords = input.keywords.map(k => k.toLowerCase());
      if (input.priority !== undefined) updateData.priority = input.priority;
      if (input.isActive !== undefined) updateData.isActive = input.isActive;

      const result = await collection.updateOne(
        { _id: new ObjectId(input.id) },
        { $set: updateData }
      );

      if (result.matchedCount === 0) {
        throw new Error("Knowledge not found");
      }

      console.log("[AI Knowledge Update] Knowledge updated");

      return {
        success: true,
      };
    } catch (error) {
      console.error("[AI Knowledge Update] Error:", error);
      throw new Error("Failed to update knowledge");
    }
  });
