import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { getDb } from "../../../../lib/mongodb";
import { AIKnowledge } from "../../../../models/ai-knowledge.model";

export const searchKnowledgeProcedure = publicProcedure
  .input(
    z.object({
      query: z.string(),
      category: z.string().optional(),
      limit: z.number().default(5),
    })
  )
  .query(async ({ input }) => {
    console.log("[AI Knowledge Search] Input:", input);

    try {
      const db = await getDb();
      const collection = db.collection<AIKnowledge>("aiknowledges");

      const searchQuery: any = {
        isActive: true,
      };

      if (input.category) {
        searchQuery.category = input.category;
      }

      const keywordMatch = await collection
        .find({
          ...searchQuery,
          keywords: { $in: input.query.toLowerCase().split(" ") },
        })
        .sort({ priority: -1, usageCount: -1 })
        .limit(input.limit)
        .toArray();

      if (keywordMatch.length > 0) {
        console.log("[AI Knowledge Search] Found by keywords:", keywordMatch.length);
        return {
          success: true,
          results: keywordMatch,
        };
      }

      const textSearchResults = await collection
        .find({
          ...searchQuery,
          $or: [
            { title: { $regex: input.query, $options: "i" } },
            { content: { $regex: input.query, $options: "i" } },
          ],
        })
        .sort({ priority: -1, usageCount: -1 })
        .limit(input.limit)
        .toArray();

      console.log("[AI Knowledge Search] Found by text search:", textSearchResults.length);
      
      return {
        success: true,
        results: textSearchResults,
      };
    } catch (error) {
      console.error("[AI Knowledge Search] Error:", error);
      throw new Error("Failed to search knowledge base");
    }
  });
