import { ObjectId } from 'mongodb';

export type DiamondShape = 'RD' | 'PR' | 'CUS' | 'EM' | 'HRT' | 'PS' | 'MQ' | 'LR' | 'OVAL' | 'Other';
export type DiamondColor = 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O-P' | 'P' | 'Q' | 'Q-R' | 'S-T' | 'W-X' | 'Y-Z';
export type DiamondClarity = 'FL' | 'IF' | 'VVS1' | 'VVS2' | 'VS1' | 'VS2' | 'SI1' | 'SI2' | 'I1' | 'I2' | 'I3';
export type DiamondCut = 'ID' | 'EX' | 'VG' | 'GD' | 'FR';
export type DiamondPolish = 'EX' | 'VG' | 'GD' | 'FR';
export type DiamondSymmetry = 'EX' | 'VG' | 'GD' | 'FR';
export type DiamondFluorescence = 'NON' | 'FNT' | 'MED' | 'STG' | 'VST';
export type DiamondLab = 'GIA' | 'IGI' | 'HRD' | 'AGS' | 'Other';

export interface Diamond {
  _id?: ObjectId;
  stoneId: string;
  shape: DiamondShape;
  carat: number;
  color: DiamondColor;
  clarity: DiamondClarity;
  cut: DiamondCut;
  polish: DiamondPolish;
  symmetry: DiamondSymmetry;
  fluorescence: DiamondFluorescence;
  lab: DiamondLab;
  certificateNumber: string;
  
  // Measurements
  length?: number;
  width?: number;
  depth?: number;
  depthPercent?: number;
  tablePercent?: number;
  
  // Pricing
  rap: number;
  discount: number;
  pricePerCarat: number;
  totalPrice: number;
  
  // Additional attributes
  shade?: string;
  milky?: string;
  
  // Media
  images?: string[];
  videoUrl?: string;
  certificateUrl?: string;
  
  // Availability
  available: boolean;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}
