import { publicProcedure } from '../../../create-context';
import { z } from 'zod';
import { connectToDatabase } from '../../../../lib/mongodb';
import { User } from '../../../../models/user.model';
import bcrypt from 'bcryptjs';
import { generateToken } from '../../../../lib/auth';
import { TRPCError } from '@trpc/server';

export const userLoginProcedure = publicProcedure
  .input(z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }))
  .mutation(async ({ input }) => {
    const { db } = await connectToDatabase();
    const usersCollection = db.collection<User>('users');

    const user = await usersCollection.findOne({ email: input.email });
    
    if (!user) {
      throw new TRPCError({ 
        code: 'UNAUTHORIZED', 
        message: 'Invalid email or password' 
      });
    }

    const isValidPassword = await bcrypt.compare(input.password, user.password);
    
    if (!isValidPassword) {
      throw new TRPCError({ 
        code: 'UNAUTHORIZED', 
        message: 'Invalid email or password' 
      });
    }

    const token = generateToken({
      userId: user._id!.toString(),
      email: user.email,
    });

    return {
      token,
      user: {
        id: user._id!.toString(),
        email: user.email,
        name: user.name,
      },
    };
  });
