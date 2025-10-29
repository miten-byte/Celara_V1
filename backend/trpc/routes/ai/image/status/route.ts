import { z } from "zod";
import { publicProcedure } from "../../../../create-context";
import { ImageGeneration } from "../../../../../models/image-generation.model";
import { connectToDatabase } from "../../../../../lib/mongodb";

export const getImageStatusProcedure = publicProcedure
  .input(
    z.object({
      toolCallId: z.string(),
    })
  )
  .query(async ({ input }) => {
    console.log("[Image Status] Checking status for:", input.toolCallId);

    await connectToDatabase();

    const imageGen = await ImageGeneration.findOne({
      toolCallId: input.toolCallId,
    });

    if (!imageGen) {
      throw new Error("Image generation request not found");
    }

    return {
      toolCallId: imageGen.toolCallId,
      status: imageGen.status,
      imageData: imageGen.imageData,
      error: imageGen.error,
      updatedAt: imageGen.updatedAt,
    };
  });
