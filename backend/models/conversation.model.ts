import { ObjectId } from 'mongodb';

export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  toolsUsed?: string[];
}

export interface ConversationFeedback {
  messageIndex: number;
  rating: "helpful" | "not-helpful";
  comment?: string;
  timestamp: Date;
}

export interface ConversationContext {
  productsViewed?: string[];
  categoriesInterested?: string[];
  priceRange?: {
    min?: number;
    max?: number;
  };
  customDesignRequested?: boolean;
}

export interface Conversation {
  _id?: ObjectId;
  userId?: ObjectId | null;
  sessionId: string;
  messages: ConversationMessage[];
  feedback: ConversationFeedback[];
  context: ConversationContext;
  isTrainingData: boolean;
  createdAt: Date;
  updatedAt: Date;
}
