import { z } from "zod";
import { publicProcedure } from "../../create-context";

export const generateImageProcedure = publicProcedure
  .input(
    z.object({
      prompt: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    const { prompt } = input;

    try {
      const response = await fetch("https://api.deepai.org/api/text2img", {
        method: "POST",
        headers: {
          "api-key": process.env.DEEPAI_API_KEY || "quickstart-QUdJIGlzIGNvbWluZy4uLi4K",
        },
        body: new URLSearchParams({
          text: prompt,
        }),
      });

      if (!response.ok) {
        throw new Error(`DeepAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        imageUrl: data.output_url,
        id: data.id,
      };
    } catch (error) {
      console.error("DeepAI image generation error:", error);
      throw new Error("Failed to generate image. Please try again.");
    }
  });
