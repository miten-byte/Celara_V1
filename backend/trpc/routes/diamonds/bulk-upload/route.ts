import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { connectToDatabase, ObjectId } from "../../../../lib/mongodb";
import { Diamond } from "../../../../models/diamond.model";

const diamondInputSchema = z.object({
  stoneId: z.string(),
  shape: z.enum(['RD', 'PR', 'CUS', 'EM', 'HRT', 'PS', 'MQ', 'LR', 'OVAL', 'Other']),
  carat: z.number().positive(),
  color: z.enum(['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O-P', 'P', 'Q', 'Q-R', 'S-T', 'W-X', 'Y-Z']),
  clarity: z.enum(['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2', 'I1', 'I2', 'I3']),
  cut: z.enum(['ID', 'EX', 'VG', 'GD', 'FR']),
  polish: z.enum(['EX', 'VG', 'GD', 'FR']),
  symmetry: z.enum(['EX', 'VG', 'GD', 'FR']),
  fluorescence: z.enum(['NON', 'FNT', 'MED', 'STG', 'VST']),
  lab: z.enum(['GIA', 'IGI', 'HRD', 'AGS', 'Other']),
  certificateNumber: z.string(),
  
  length: z.number().positive().optional(),
  width: z.number().positive().optional(),
  depth: z.number().positive().optional(),
  depthPercent: z.number().positive().optional(),
  tablePercent: z.number().positive().optional(),
  
  rap: z.number(),
  discount: z.number(),
  pricePerCarat: z.number(),
  totalPrice: z.number(),
  
  shade: z.string().optional(),
  milky: z.string().optional(),
  
  images: z.array(z.string()).optional(),
  videoUrl: z.string().optional(),
  certificateUrl: z.string().optional(),
  
  available: z.boolean().default(true),
});

export const bulkUploadDiamondsProcedure = publicProcedure
  .input(
    z.object({
      diamonds: z.array(diamondInputSchema),
    })
  )
  .mutation(async ({ input }) => {
    const { db } = await connectToDatabase();
    const diamondsCollection = db.collection<Diamond>("diamonds");

    const diamondsToInsert = input.diamonds.map((diamond) => ({
      ...diamond,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const result = await diamondsCollection.insertMany(diamondsToInsert);

    return {
      success: true,
      insertedCount: result.insertedCount,
      insertedIds: Object.values(result.insertedIds).map((id) => (id as ObjectId).toString()),
    };
  });
