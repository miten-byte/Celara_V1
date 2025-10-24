import { ObjectId } from 'mongodb';

export type DiamondShape = 'Round' | 'Princess' | 'Cushion' | 'Oval' | 'Emerald' | 'Pear' | 'Marquise' | 'Asscher';
export type MetalType = 'Platinum' | '18K White Gold' | '18K Yellow Gold' | '18K Rose Gold' | '14K White Gold' | '14K Yellow Gold';
export type Category = 'Engagement Rings' | 'Wedding Bands' | 'Earrings' | 'Necklaces' | 'Bracelets' | 'Loose Diamonds';
export type Cut = 'Ideal' | 'Excellent' | 'Very Good' | 'Good';
export type Color = 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J';
export type Clarity = 'FL' | 'IF' | 'VVS1' | 'VVS2' | 'VS1' | 'VS2' | 'SI1' | 'SI2';

export interface Product {
  _id?: ObjectId;
  name: string;
  category: Category;
  price: number;
  image: string;
  images: string[];
  description: string;
  shape?: DiamondShape;
  metal?: MetalType;
  carat?: number;
  cut?: Cut;
  color?: Color;
  clarity?: Clarity;
  certification?: string;
  inStock: boolean;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestseller?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
