import mongoose from "mongoose";

export interface IImageGeneration {
  sessionId: string;
  toolCallId: string;
  prompt: string;
  status: "pending" | "processing" | "completed" | "failed";
  imageData?: string;
  imageUrl?: string;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

const imageGenerationSchema = new mongoose.Schema<IImageGeneration>(
  {
    sessionId: { type: String, required: true, index: true },
    toolCallId: { type: String, required: true, unique: true, index: true },
    prompt: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
      index: true,
    },
    imageData: { type: String },
    imageUrl: { type: String },
    error: { type: String },
  },
  { timestamps: true }
);

export const ImageGeneration =
  (mongoose.models.ImageGeneration as mongoose.Model<IImageGeneration>) ||
  mongoose.model<IImageGeneration>("ImageGeneration", imageGenerationSchema);
