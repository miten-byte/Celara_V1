import { z } from "zod";
import { protectedProcedure } from "../../../../create-context";
import { connectToDatabase } from "../../../../../lib/mongodb";
import { AIKnowledge, KnowledgeCategory, KnowledgeSource } from "../../../../../models/ai-knowledge.model";

export const addKnowledgeProcedure = protectedProcedure
  .input(
    z.object({
      category: z.enum([
        "diamond-education",
        "metal-types",
        "jewelry-care",
        "sizing-guide",
        "certification",
        "customization",
        "pricing",
        "lab-grown-vs-mined",
        "ring-styles",
        "earring-styles",
        "necklace-styles",
        "bracelet-styles",
        "pendant-styles",
        "gemstone-properties",
        "design-trends",
        "maintenance",
        "general",
      ]),
      title: z.string().min(1),
      content: z.string().min(1),
      keywords: z.array(z.string()),
      priority: z.number().default(0),
      source: z.enum(["manual", "feedback", "admin"]).default("admin"),
    })
  )
  .mutation(async ({ input }: { input: { category: string; title: string; content: string; keywords: string[]; priority: number; source: string } }) => {
    console.log("[AI Knowledge Add] Adding knowledge:", input.title);

    try {
      const { db } = await connectToDatabase();
      const collection = db.collection<AIKnowledge>("aiknowledges");

      const newKnowledge: Omit<AIKnowledge, "_id"> = {
        category: input.category as KnowledgeCategory,
        title: input.title,
        content: input.content,
        keywords: input.keywords.map((k: string) => k.toLowerCase()),
        priority: input.priority,
        usageCount: 0,
        successRate: 0,
        isActive: true,
        source: input.source as KnowledgeSource,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await collection.insertOne(newKnowledge as any);

      console.log("[AI Knowledge Add] Knowledge added:", result.insertedId);

      return {
        success: true,
        id: result.insertedId.toString(),
      };
    } catch (error) {
      console.error("[AI Knowledge Add] Error:", error);
      throw new Error("Failed to add knowledge");
    }
  });
