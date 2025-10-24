import { publicProcedure } from '../../../create-context';
import { z } from 'zod';
import { connectToDatabase } from '../../../../lib/mongodb';
import { Admin } from '../../../../models/admin.model';
import bcrypt from 'bcryptjs';
import { generateToken } from '../../../../lib/auth';
import { TRPCError } from '@trpc/server';

export const loginProcedure = publicProcedure
  .input(z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }))
  .mutation(async ({ input }) => {
    const { db } = await connectToDatabase();
    const adminsCollection = db.collection<Admin>('admins');

    const admin = await adminsCollection.findOne({ email: input.email });
    
    if (!admin) {
      throw new TRPCError({ 
        code: 'UNAUTHORIZED', 
        message: 'Invalid email or password' 
      });
    }

    const isValidPassword = await bcrypt.compare(input.password, admin.password);
    
    if (!isValidPassword) {
      throw new TRPCError({ 
        code: 'UNAUTHORIZED', 
        message: 'Invalid email or password' 
      });
    }

    const token = generateToken({
      adminId: admin._id!.toString(),
      email: admin.email,
      role: admin.role,
    });

    return {
      token,
      admin: {
        id: admin._id!.toString(),
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    };
  });
