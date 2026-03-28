import { z } from "zod";
import { publicProcedure } from "../../../../create-context";
import { ImageGeneration } from "../../../../../models/image-generation.model";
import { connectToDatabase } from "../../../../../lib/mongodb";

export const requestImageGenerationProcedure = publicProcedure
  .input(
    z.object({
      sessionId: z.string(),
      toolCallId: z.string(),
      prompt: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    console.log("[Image Gen] Creating request:", input.toolCallId);

    await connectToDatabase();

    const imageGenRequest = await ImageGeneration.create({
      sessionId: input.sessionId,
      toolCallId: input.toolCallId,
      prompt: input.prompt,
      status: "pending",
    });

    processImageGeneration(input.toolCallId, input.prompt).catch((error) => {
      console.error("[Image Gen] Background processing error:", error);
    });

    return {
      toolCallId: imageGenRequest.toolCallId,
      status: imageGenRequest.status,
    };
  });

async function processImageGeneration(toolCallId: string, prompt: string) {
  try {
    console.log("[Image Gen] Starting generation for:", toolCallId);

    await connectToDatabase();

    await ImageGeneration.findOneAndUpdate(
      { toolCallId },
      { status: "processing" }
    );

    const enhancedPrompt = `High-quality, professional product photography of ${prompt}. Elegant jewelry style, studio lighting, clean white background, detailed and sharp focus, realistic rendering, 4K quality.`;

    console.log("[Image Gen] Calling API with prompt:", enhancedPrompt.substring(0, 100));

    const response = await fetch(
      "https://toolkit.rork.com/images/generate/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: enhancedPrompt,
          size: "1024x1024",
        }),
      }
    );

    console.log("[Image Gen] Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Image Gen] API error response:", errorText.substring(0, 500));
      throw new Error(`Image API returned ${response.status}`);
    }

    const data = await response.json();
    console.log("[Image Gen] Response received, has image:", !!data.image);

    if (!data.image?.base64Data) {
      console.error("[Image Gen] Invalid response structure:", Object.keys(data));
      throw new Error("Invalid image data structure");
    }

    const imageDataUri = `data:${data.image.mimeType || 'image/png'};base64,${data.image.base64Data}`;
    console.log("[Image Gen] Image data URI created, length:", imageDataUri.length);

    await ImageGeneration.findOneAndUpdate(
      { toolCallId },
      {
        status: "completed",
        imageData: imageDataUri,
      }
    );

    console.log("[Image Gen] Successfully completed:", toolCallId);
  } catch (error) {
    console.error("[Image Gen] Generation failed:", error);

    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";

    await ImageGeneration.findOneAndUpdate(
      { toolCallId },
      {
        status: "failed",
        error: errorMessage,
      }
    );
  }
}
