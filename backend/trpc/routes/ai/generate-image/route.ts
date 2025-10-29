import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { openai } from "../../../../lib/openai";

export const generateImageProcedure = publicProcedure
  .input(
    z.object({
      prompt: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    const { prompt } = input;

    try {
      console.log("[Image] Generating with OpenAI DALL-E:", prompt);

      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        response_format: "url",
      });

      const imageUrl = response.data?.[0]?.url;

      if (!imageUrl) {
        throw new Error("No image URL in response");
      }

      console.log("[Image] Generated successfully:", imageUrl);

      return {
        imageUrl,
        id: Date.now().toString(),
      };
    } catch (error) {
      console.error("[Image] Generation error:", error);
      throw new Error("Failed to generate image. Please try again.");
    }
  });
