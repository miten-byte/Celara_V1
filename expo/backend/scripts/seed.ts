import { connectToDatabase } from '../lib/mongodb';
import { Product } from '../models/product.model';
import { Admin } from '../models/admin.model';
import bcrypt from 'bcryptjs';

const seedProducts: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Classic Solitaire Engagement Ring',
    category: 'Engagement Rings',
    price: 8950,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800',
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800',
    ],
    description: 'A timeless solitaire engagement ring featuring a brilliant round diamond set in 18K white gold. The classic six-prong setting showcases the diamond\'s fire and brilliance.',
    shape: 'Round',
    metal: '18K White Gold',
    carat: 1.5,
    cut: 'Ideal',
    color: 'F',
    clarity: 'VVS1',
    certification: 'IGI',
    inStock: true,
    isFeatured: true,
    isBestseller: true,
  },
  {
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
    certification: 'IGI',
    inStock: true,
    isFeatured: true,
    isNewArrival: true,
  },
  {
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
    name: 'Oval Diamond Solitaire',
    category: 'Engagement Rings',
    price: 9800,
    image: 'https://images.unsplash.com/photo-1611591437611-e27bbb2e7d59?w=800',
    images: [
      'https://images.unsplash.com/photo-1611591437611-e27bbb2e7d59?w=800',
    ],
    description: 'Elegant oval diamond in a sleek four-prong setting. The elongated shape creates a flattering look on the finger.',
    shape: 'Oval',
    metal: '18K White Gold',
    carat: 1.6,
    cut: 'Excellent',
    color: 'D',
    clarity: 'IF',
    certification: 'IGI',
    inStock: true,
    isBestseller: true,
  },
  {
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
    certification: 'IGI',
    inStock: true,
    isFeatured: true,
    isBestseller: true,
  },
  {
    name: 'Halo Diamond Earrings',
    category: 'Earrings',
    price: 5600,
    image: 'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=800',
    images: [
      'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=800',
    ],
    description: 'Luxurious halo earrings with center diamonds surrounded by smaller brilliant cut diamonds. Maximum sparkle guaranteed.',
    shape: 'Round',
    metal: '18K White Gold',
    carat: 1.5,
    cut: 'Excellent',
    color: 'E',
    clarity: 'VVS1',
    certification: 'IGI',
    inStock: true,
    isNewArrival: true,
  },
  {
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
    certification: 'IGI',
    inStock: true,
    isFeatured: true,
  },
  {
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
    name: 'Diamond Tennis Bracelet',
    category: 'Bracelets',
    price: 12800,
    image: 'https://images.unsplash.com/photo-1611591437611-e27bbb2e7d59?w=800',
    images: [
      'https://images.unsplash.com/photo-1611591437611-e27bbb2e7d59?w=800',
    ],
    description: 'Classic tennis bracelet featuring perfectly matched round diamonds. Secure clasp and adjustable length.',
    shape: 'Round',
    metal: '18K White Gold',
    carat: 3.5,
    cut: 'Excellent',
    color: 'F',
    clarity: 'VS1',
    certification: 'IGI',
    inStock: true,
  },
  {
    name: 'Eternity Wedding Band',
    category: 'Wedding Bands',
    price: 4800,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800',
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800',
    ],
    description: 'Stunning eternity band with diamonds encircling the entire ring. Perfect as a wedding band or anniversary gift.',
    shape: 'Round',
    metal: '18K White Gold',
    carat: 2.0,
    cut: 'Excellent',
    color: 'G',
    clarity: 'VS2',
    certification: 'IGI',
    inStock: true,
    isBestseller: true,
  },
  {
    name: 'Emerald Cut Diamond Ring',
    category: 'Engagement Rings',
    price: 16900,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800',
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800',
    ],
    description: 'Sophisticated emerald cut diamond with step-cut facets that showcase exceptional clarity. Art deco inspired design.',
    shape: 'Emerald',
    metal: '18K White Gold',
    carat: 2.5,
    cut: 'Excellent',
    color: 'D',
    clarity: 'VVS1',
    certification: 'IGI',
    inStock: true,
    isNewArrival: true,
  },
  {
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

export async function seedDatabase() {
  try {
    const { db } = await connectToDatabase();

    console.log('Seeding products...');
    const productsCollection = db.collection<Product>('products');
    await productsCollection.deleteMany({});
    
    const productsWithTimestamps = seedProducts.map(product => ({
      ...product,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    
    await productsCollection.insertMany(productsWithTimestamps);
    console.log(`Seeded ${seedProducts.length} products`);

    console.log('Creating default admin...');
    const adminsCollection = db.collection<Admin>('admins');
    const existingAdmin = await adminsCollection.findOne({ email: 'admin@jewelry.com' });
    
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await adminsCollection.insertOne({
        email: 'admin@jewelry.com',
        password: hashedPassword,
        name: 'Admin',
        role: 'super-admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log('Created default admin (email: admin@jewelry.com, password: admin123)');
    } else {
      console.log('Admin already exists');
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
