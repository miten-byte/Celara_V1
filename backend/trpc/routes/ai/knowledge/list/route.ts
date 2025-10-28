import { z } from "zod";
import { protectedProcedure } from "../../../../create-context";
import { connectToDatabase } from "../../../../../lib/mongodb";
import { AIKnowledge } from "../../../../../models/ai-knowledge.model";

export const listKnowledgeProcedure = protectedProcedure
  .input(
    z.object({
      category: z.string().optional(),
      isActive: z.boolean().optional(),
      limit: z.number().default(50),
      skip: z.number().default(0),
    })
  )
  .query(async ({ input }: { input: { category?: string; isActive?: boolean; limit: number; skip: number } }) => {
    console.log("[AI Knowledge List] Fetching knowledge");

    try {
      const { db } = await connectToDatabase();
      const collection = db.collection<AIKnowledge>("aiknowledges");

      const filter: any = {};
      if (input.category) {
        filter.category = input.category;
      }
      if (input.isActive !== undefined) {
        filter.isActive = input.isActive;
      }

      const knowledge = await collection
        .find(filter)
        .sort({ priority: -1, createdAt: -1 })
        .skip(input.skip)
        .limit(input.limit)
        .toArray();

      const total = await collection.countDocuments(filter);

      console.log("[AI Knowledge List] Found:", knowledge.length);

      return {
        success: true,
        knowledge,
        total,
      };
    } catch (error) {
      console.error("[AI Knowledge List] Error:", error);
      throw new Error("Failed to list knowledge");
    }
  });
