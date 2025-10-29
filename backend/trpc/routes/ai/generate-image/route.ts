import { z } from "zod";
import { publicProcedure } from "../../../create-context";

export const generateImageProcedure = publicProcedure
  .input(
    z.object({
      prompt: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    const { prompt } = input;

    try {
      console.log("[Image] Generating with prompt:", prompt);

      const toolkitUrl = process.env.EXPO_PUBLIC_TOOLKIT_URL || "https://toolkit.rork.com";
      const imageGenUrl = new URL("/images/generate/", toolkitUrl).toString();
      
      console.log("[Image] Calling API:", imageGenUrl);

      const response = await fetch(imageGenUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          size: "1024x1024",
        }),
      });

      console.log("[Image] Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("[Image] API error:", response.status, errorText);
        throw new Error(`Image generation failed: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("[Image] Response data received:", !!data.image);
      
      if (!data.image || !data.image.base64Data) {
        throw new Error("Invalid response from image generation API");
      }
      
      const imageUrl = `data:${data.image.mimeType};base64,${data.image.base64Data}`;
      
      return {
        imageUrl,
        id: Date.now().toString(),
      };
    } catch (error) {
      console.error("[Image] Generation error:", error);
      throw new Error("Failed to generate image. Please try again.");
    }
  });
