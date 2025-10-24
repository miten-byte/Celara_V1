import { protectedProcedure } from '../../../create-context';
import { z } from 'zod';
import { connectToDatabase, ObjectId } from '../../../../lib/mongodb';
import { Product } from '../../../../models/product.model';
import { TRPCError } from '@trpc/server';

export const deleteProductProcedure = protectedProcedure
  .input(z.object({
    id: z.string(),
  }))
  .mutation(async ({ input }) => {
    const { db } = await connectToDatabase();
    const productsCollection = db.collection<Product>('products');

    const result = await productsCollection.deleteOne({ 
      _id: new ObjectId(input.id) 
    });

    if (result.deletedCount === 0) {
      throw new TRPCError({ 
        code: 'NOT_FOUND', 
        message: 'Product not found' 
      });
    }

    return { success: true };
  });
