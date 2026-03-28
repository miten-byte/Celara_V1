import { publicProcedure } from '../../../create-context';
import { z } from 'zod';
import { connectToDatabase } from '../../../../lib/mongodb';
import { Product } from '../../../../models/product.model';

export const listProductsProcedure = publicProcedure
  .input(z.object({
    category: z.string().optional(),
    minPrice: z.number().optional(),
    maxPrice: z.number().optional(),
    shape: z.string().optional(),
    metal: z.string().optional(),
    limit: z.number().default(20),
    skip: z.number().default(0),
  }).optional())
  .query(async ({ input }) => {
    const { db } = await connectToDatabase();
    const productsCollection = db.collection<Product>('products');

    const filter: any = {};
    
    if (input?.category) {
      filter.category = input.category;
    }
    
    if (input?.shape) {
      filter.shape = input.shape;
    }
    
    if (input?.metal) {
      filter.metal = input.metal;
    }
    
    if (input?.minPrice !== undefined || input?.maxPrice !== undefined) {
      filter.price = {};
      if (input.minPrice !== undefined) {
        filter.price.$gte = input.minPrice;
      }
      if (input.maxPrice !== undefined) {
        filter.price.$lte = input.maxPrice;
      }
    }

    const products = await productsCollection
      .find(filter)
      .skip(input?.skip ?? 0)
      .limit(input?.limit ?? 20)
      .toArray();

    const total = await productsCollection.countDocuments(filter);

    return {
      products: products.map(p => ({
        ...p,
        id: p._id!.toString(),
      })),
      total,
    };
  });
