import { ObjectId } from 'mongodb';

export type KnowledgeCategory = 
  | "diamond-education"
  | "metal-types"
  | "jewelry-care"
  | "sizing-guide"
  | "certification"
  | "customization"
  | "pricing"
  | "lab-grown-vs-mined"
  | "ring-styles"
  | "earring-styles"
  | "necklace-styles"
  | "bracelet-styles"
  | "pendant-styles"
  | "gemstone-properties"
  | "design-trends"
  | "maintenance"
  | "general";

export type KnowledgeSource = "manual" | "feedback" | "admin";

export interface AIKnowledge {
  _id?: ObjectId;
  category: KnowledgeCategory;
  title: string;
  content: string;
  keywords: string[];
  priority: number;
  usageCount: number;
  successRate: number;
  isActive: boolean;
  source: KnowledgeSource;
  createdAt: Date;
  updatedAt: Date;
}
