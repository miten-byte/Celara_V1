import { z } from "zod";
import { protectedProcedure } from "../../../create-context";
import { getDb } from "../../../../lib/mongodb";
import { AIKnowledge } from "../../../../models/ai-knowledge.model";

export const listKnowledgeProcedure = protectedProcedure
  .input(
    z.object({
      category: z.string().optional(),
      isActive: z.boolean().optional(),
      limit: z.number().default(50),
      skip: z.number().default(0),
    })
  )
  .query(async ({ input }) => {
    console.log("[AI Knowledge List] Fetching knowledge");

    try {
      const db = await getDb();
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
