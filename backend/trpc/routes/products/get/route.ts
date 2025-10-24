import { publicProcedure } from '../../../create-context';
import { z } from 'zod';
import { connectToDatabase, ObjectId } from '../../../../lib/mongodb';
import { Product } from '../../../../models/product.model';
import { TRPCError } from '@trpc/server';

export const getProductProcedure = publicProcedure
  .input(z.object({
    id: z.string(),
  }))
  .query(async ({ input }) => {
    const { db } = await connectToDatabase();
    const productsCollection = db.collection<Product>('products');

    const product = await productsCollection.findOne({ 
      _id: new ObjectId(input.id) 
    });

    if (!product) {
      throw new TRPCError({ 
        code: 'NOT_FOUND', 
        message: 'Product not found' 
      });
    }

    return {
      ...product,
      id: product._id!.toString(),
    };
  });
