export type DiamondShape = 'Round' | 'Princess' | 'Cushion' | 'Oval' | 'Emerald' | 'Pear' | 'Marquise' | 'Asscher';
export type MetalType = 'Platinum' | '18K White Gold' | '18K Yellow Gold' | '18K Rose Gold' | '14K White Gold' | '14K Yellow Gold';
export type Category = 'Engagement Rings' | 'Wedding Bands' | 'Earrings' | 'Necklaces' | 'Bracelets' | 'Loose Diamonds';
export type Cut = 'Ideal' | 'Excellent' | 'Very Good' | 'Good';
export type Color = 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J';
export type Clarity = 'FL' | 'IF' | 'VVS1' | 'VVS2' | 'VS1' | 'VS2' | 'SI1' | 'SI2';

export interface Product {
  id: string;
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
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Classic Solitaire Engagement Ring',
    category: 'Engagement Rings',
    price: 8950,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800',
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800',
    ],
    description: 'A timeless solitaire engagement ring featuring a brilliant round diamond set in platinum. The classic six-prong setting showcases the diamond\'s fire and brilliance.',
    shape: 'Round',
    metal: 'Platinum',
    carat: 1.5,
    cut: 'Ideal',
    color: 'F',
    clarity: 'VVS1',
    certification: 'GIA',
    inStock: true,
    isFeatured: true,
    isBestseller: true,
  },
  {
    id: '2',
    name: 'Halo Princess Cut Diamond Ring',
    category: 'Engagement Rings',
    price: 12500,
    image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800',
    images: [
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800',
      'https://images.unsplash.com/photo-1611591437611-e27bbb2e7d59?w=800',
    ],
    description: 'Stunning princess cut diamond surrounded by a halo of smaller diamonds. Set in 18K white gold with diamond-accented band.',
    shape: 'Princess',
    metal: '18K White Gold',
    carat: 2.0,
    cut: 'Excellent',
    color: 'E',
    clarity: 'VS1',
    certification: 'GIA',
    inStock: true,
    isFeatured: true,
    isNewArrival: true,
  },
  {
    id: '3',
    name: 'Vintage Cushion Cut Engagement Ring',
    category: 'Engagement Rings',
    price: 15200,
    image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800',
    images: [
      'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800',
      'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800',
    ],
    description: 'Vintage-inspired cushion cut diamond ring with intricate milgrain detailing and pavé diamonds on the band. Rose gold setting adds warmth.',
    shape: 'Cushion',
    metal: '18K Rose Gold',
    carat: 1.8,
    cut: 'Excellent',
    color: 'G',
    clarity: 'VVS2',
    certification: 'IGI',
    inStock: true,
    isFeatured: true,
  },
  {
    id: '4',
    name: 'Oval Diamond Solitaire',
    category: 'Engagement Rings',
    price: 9800,
    image: 'https://images.unsplash.com/photo-1611591437611-e27bbb2e7d59?w=800',
    images: [
      'https://images.unsplash.com/photo-1611591437611-e27bbb2e7d59?w=800',
    ],
    description: 'Elegant oval diamond in a sleek four-prong setting. The elongated shape creates a flattering look on the finger.',
    shape: 'Oval',
    metal: 'Platinum',
    carat: 1.6,
    cut: 'Excellent',
    color: 'D',
    clarity: 'IF',
    certification: 'GIA',
    inStock: true,
    isBestseller: true,
  },
  {
    id: '5',
    name: 'Diamond Stud Earrings',
    category: 'Earrings',
    price: 3200,
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800',
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800',
    ],
    description: 'Classic diamond stud earrings featuring perfectly matched round brilliant diamonds. Four-prong settings in 14K white gold.',
    shape: 'Round',
    metal: '14K White Gold',
    carat: 1.0,
    cut: 'Ideal',
    color: 'F',
    clarity: 'VS2',
    certification: 'GIA',
    inStock: true,
    isFeatured: true,
    isBestseller: true,
  },
  {
    id: '6',
    name: 'Halo Diamond Earrings',
    category: 'Earrings',
    price: 5600,
    image: 'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=800',
    images: [
      'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=800',
    ],
    description: 'Luxurious halo earrings with center diamonds surrounded by smaller brilliant cut diamonds. Maximum sparkle guaranteed.',
    shape: 'Round',
    metal: 'Platinum',
    carat: 1.5,
    cut: 'Excellent',
    color: 'E',
    clarity: 'VVS1',
    certification: 'GIA',
    inStock: true,
    isNewArrival: true,
  },
  {
    id: '7',
    name: 'Diamond Tennis Necklace',
    category: 'Necklaces',
    price: 18500,
    image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800',
    images: [
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800',
    ],
    description: 'Timeless tennis necklace featuring a continuous line of round brilliant diamonds. 16 inches of pure elegance.',
    shape: 'Round',
    metal: '18K White Gold',
    carat: 5.0,
    cut: 'Excellent',
    color: 'F',
    clarity: 'VS1',
    certification: 'GIA',
    inStock: true,
    isFeatured: true,
  },
  {
    id: '8',
    name: 'Solitaire Diamond Pendant',
    category: 'Necklaces',
    price: 4200,
    image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800',
    images: [
      'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800',
    ],
    description: 'Simple yet stunning solitaire pendant. Features a brilliant round diamond suspended from a delicate chain.',
    shape: 'Round',
    metal: '18K Yellow Gold',
    carat: 0.75,
    cut: 'Ideal',
    color: 'G',
    clarity: 'VS2',
    certification: 'IGI',
    inStock: true,
    isBestseller: true,
  },
  {
    id: '9',
    name: 'Diamond Tennis Bracelet',
    category: 'Bracelets',
    price: 12800,
    image: 'https://images.unsplash.com/photo-1611591437611-e27bbb2e7d59?w=800',
    images: [
      'https://images.unsplash.com/photo-1611591437611-e27bbb2e7d59?w=800',
    ],
    description: 'Classic tennis bracelet featuring perfectly matched round diamonds. Secure clasp and adjustable length.',
    shape: 'Round',
    metal: 'Platinum',
    carat: 3.5,
    cut: 'Excellent',
    color: 'F',
    clarity: 'VS1',
    certification: 'GIA',
    inStock: true,
  },
  {
    id: '10',
    name: 'Eternity Wedding Band',
    category: 'Wedding Bands',
    price: 4800,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800',
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800',
    ],
    description: 'Stunning eternity band with diamonds encircling the entire ring. Perfect as a wedding band or anniversary gift.',
    shape: 'Round',
    metal: 'Platinum',
    carat: 2.0,
    cut: 'Excellent',
    color: 'G',
    clarity: 'VS2',
    certification: 'GIA',
    inStock: true,
    isBestseller: true,
  },
  {
    id: '11',
    name: 'Emerald Cut Diamond Ring',
    category: 'Engagement Rings',
    price: 16900,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800',
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800',
    ],
    description: 'Sophisticated emerald cut diamond with step-cut facets that showcase exceptional clarity. Art deco inspired design.',
    shape: 'Emerald',
    metal: 'Platinum',
    carat: 2.5,
    cut: 'Excellent',
    color: 'D',
    clarity: 'VVS1',
    certification: 'GIA',
    inStock: true,
    isNewArrival: true,
  },
  {
    id: '12',
    name: 'Pear Shape Halo Ring',
    category: 'Engagement Rings',
    price: 11200,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800',
    ],
    description: 'Elegant pear-shaped diamond surrounded by a delicate halo. Unique and romantic design that stands out.',
    shape: 'Pear',
    metal: '18K Rose Gold',
    carat: 1.7,
    cut: 'Very Good',
    color: 'F',
    clarity: 'VS1',
    certification: 'IGI',
    inStock: true,
  },
];

export const categories: Category[] = [
  'Engagement Rings',
  'Wedding Bands',
  'Earrings',
  'Necklaces',
  'Bracelets',
  'Loose Diamonds',
];

export const shapes: DiamondShape[] = [
  'Round',
  'Princess',
  'Cushion',
  'Oval',
  'Emerald',
  'Pear',
  'Marquise',
  'Asscher',
];

export const metals: MetalType[] = [
  'Platinum',
  '18K White Gold',
  '18K Yellow Gold',
  '18K Rose Gold',
  '14K White Gold',
  '14K Yellow Gold',
];
