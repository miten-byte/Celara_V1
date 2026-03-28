import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { connectToDatabase, ObjectId } from "../../../../lib/mongodb";
import { Diamond } from "../../../../models/diamond.model";

export const getDiamondProcedure = publicProcedure
  .input(
    z.object({
      id: z.string(),
    })
  )
  .query(async ({ input }) => {
    const { db } = await connectToDatabase();
    const diamondsCollection = db.collection<Diamond>("diamonds");

    const diamond = await diamondsCollection.findOne({
      _id: new ObjectId(input.id),
    });

    if (!diamond) {
      throw new Error("Diamond not found");
    }

    return {
      ...diamond,
      _id: diamond._id?.toString(),
    };
  });
