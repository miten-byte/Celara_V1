import { protectedProcedure } from '../../../create-context';
import { z } from 'zod';
import { connectToDatabase, ObjectId } from '../../../../lib/mongodb';
import { Product } from '../../../../models/product.model';
import { TRPCError } from '@trpc/server';

const updateProductSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  category: z.enum(['Engagement Rings', 'Wedding Bands', 'Earrings', 'Necklaces', 'Bracelets', 'Loose Diamonds']).optional(),
  price: z.number().positive().optional(),
  image: z.string().url().optional(),
  images: z.array(z.string().url()).optional(),
  description: z.string().optional(),
  shape: z.enum(['Round', 'Princess', 'Cushion', 'Oval', 'Emerald', 'Pear', 'Marquise', 'Asscher']).optional(),
  metal: z.enum(['Platinum', '18K White Gold', '18K Yellow Gold', '18K Rose Gold', '14K White Gold', '14K Yellow Gold']).optional(),
  carat: z.number().positive().optional(),
  cut: z.enum(['Ideal', 'Excellent', 'Very Good', 'Good']).optional(),
  color: z.enum(['D', 'E', 'F', 'G', 'H', 'I', 'J']).optional(),
  clarity: z.enum(['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2']).optional(),
  certification: z.string().optional(),
  inStock: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isNewArrival: z.boolean().optional(),
  isBestseller: z.boolean().optional(),
});

export const updateProductProcedure = protectedProcedure
  .input(updateProductSchema)
  .mutation(async ({ input }) => {
    const { db } = await connectToDatabase();
    const productsCollection = db.collection<Product>('products');

    const { id, ...updateData } = input;

    const result = await productsCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          ...updateData, 
          updatedAt: new Date() 
        } 
      },
      { returnDocument: 'after' }
    );

    if (!result) {
      throw new TRPCError({ 
        code: 'NOT_FOUND', 
        message: 'Product not found' 
      });
    }

    return {
      ...result,
      id: result._id!.toString(),
    };
  });
