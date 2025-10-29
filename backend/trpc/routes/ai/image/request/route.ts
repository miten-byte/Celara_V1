import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";
import { ImageGeneration } from "@/backend/models/image-generation.model";

export const requestImageGenerationProcedure = publicProcedure
  .input(
    z.object({
      sessionId: z.string(),
      toolCallId: z.string(),
      prompt: z.string(),
    })
  )
  .mutation(async ({ input }: { input: { sessionId: string; toolCallId: string; prompt: string } }) => {
    console.log("[Image Gen] Creating request:", input.toolCallId);

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

    await ImageGeneration.findOneAndUpdate(
      { toolCallId },
      { status: "processing" }
    );

    const response = await fetch(
      "https://toolkit.rork.com/images/generate/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: `High-quality, professional product photography of ${prompt}. Elegant jewelry style, studio lighting, clean white background, detailed and sharp focus, realistic rendering.`,
          size: "1024x1024",
        }),
      }
    );

    console.log("[Image Gen] Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Image Gen] API error:", errorText);
      throw new Error(`Image API returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("[Image Gen] Response data keys:", Object.keys(data));

    if (!data.image || !data.image.base64Data) {
      console.error("[Image Gen] Invalid data structure:", JSON.stringify(data).substring(0, 200));
      throw new Error("Invalid image data received from API");
    }

    const imageDataUri = `data:${data.image.mimeType};base64,${data.image.base64Data}`;

    await ImageGeneration.findOneAndUpdate(
      { toolCallId },
      {
        status: "completed",
        imageData: imageDataUri,
      }
    );

    console.log("[Image Gen] Successfully generated:", toolCallId);
  } catch (error) {
    console.error("[Image Gen] Generation failed:", error);

    await ImageGeneration.findOneAndUpdate(
      { toolCallId },
      {
        status: "failed",
        error: error instanceof Error ? error.message : "Unknown error",
      }
    );
  }
}
