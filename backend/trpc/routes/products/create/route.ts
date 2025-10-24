import { protectedProcedure } from '../../../create-context';
import { z } from 'zod';
import { connectToDatabase } from '../../../../lib/mongodb';
import { Product } from '../../../../models/product.model';

const productSchema = z.object({
  name: z.string(),
  category: z.enum(['Engagement Rings', 'Wedding Bands', 'Earrings', 'Necklaces', 'Bracelets', 'Loose Diamonds']),
  price: z.number().positive(),
  image: z.string().url(),
  images: z.array(z.string().url()),
  description: z.string(),
  shape: z.enum(['Round', 'Princess', 'Cushion', 'Oval', 'Emerald', 'Pear', 'Marquise', 'Asscher']).optional(),
  metal: z.enum(['Platinum', '18K White Gold', '18K Yellow Gold', '18K Rose Gold', '14K White Gold', '14K Yellow Gold']).optional(),
  carat: z.number().positive().optional(),
  cut: z.enum(['Ideal', 'Excellent', 'Very Good', 'Good']).optional(),
  color: z.enum(['D', 'E', 'F', 'G', 'H', 'I', 'J']).optional(),
  clarity: z.enum(['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2']).optional(),
  certification: z.string().optional(),
  inStock: z.boolean(),
  isFeatured: z.boolean().optional(),
  isNewArrival: z.boolean().optional(),
  isBestseller: z.boolean().optional(),
});

export const createProductProcedure = protectedProcedure
  .input(productSchema)
  .mutation(async ({ input }) => {
    const { db } = await connectToDatabase();
    const productsCollection = db.collection<Product>('products');

    const product: Omit<Product, '_id'> = {
      ...input,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await productsCollection.insertOne(product as Product);

    return {
      id: result.insertedId.toString(),
      ...product,
    };
  });
