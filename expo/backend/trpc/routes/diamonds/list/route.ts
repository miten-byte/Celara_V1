import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { connectToDatabase } from "../../../../lib/mongodb";
import { Diamond } from "../../../../models/diamond.model";

export const listDiamondsProcedure = publicProcedure
  .input(
    z.object({
      shapes: z.array(z.string()).optional(),
      caratFrom: z.number().optional(),
      caratTo: z.number().optional(),
      colors: z.array(z.string()).optional(),
      clarities: z.array(z.string()).optional(),
      priceFrom: z.number().optional(),
      priceTo: z.number().optional(),
      limit: z.number().default(50),
      skip: z.number().default(0),
    })
  )
  .query(async ({ input }) => {
    const { db } = await connectToDatabase();
    const diamondsCollection = db.collection<Diamond>("diamonds");

    const filter: any = { available: true };

    if (input.shapes && input.shapes.length > 0) {
      filter.shape = { $in: input.shapes };
    }

    if (input.caratFrom || input.caratTo) {
      filter.carat = {};
      if (input.caratFrom) filter.carat.$gte = input.caratFrom;
      if (input.caratTo) filter.carat.$lte = input.caratTo;
    }

    if (input.colors && input.colors.length > 0) {
      filter.color = { $in: input.colors };
    }

    if (input.clarities && input.clarities.length > 0) {
      filter.clarity = { $in: input.clarities };
    }

    if (input.priceFrom || input.priceTo) {
      filter.totalPrice = {};
      if (input.priceFrom) filter.totalPrice.$gte = input.priceFrom;
      if (input.priceTo) filter.totalPrice.$lte = input.priceTo;
    }

    const [diamonds, total] = await Promise.all([
      diamondsCollection
        .find(filter)
        .skip(input.skip)
        .limit(input.limit)
        .sort({ createdAt: -1 })
        .toArray(),
      diamondsCollection.countDocuments(filter),
    ]);

    return {
      diamonds: diamonds.map((d) => ({
        ...d,
        _id: d._id?.toString(),
      })),
      total,
    };
  });
