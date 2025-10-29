import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY || "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";

if (!apiKey) {
  console.error("[OpenAI] API key is missing!");
}

export const openai = new OpenAI({
  apiKey,
});

console.log("[OpenAI] Client initialized");
