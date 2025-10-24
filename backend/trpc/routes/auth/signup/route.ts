import { publicProcedure } from '../../../create-context';
import { z } from 'zod';
import { connectToDatabase } from '../../../../lib/mongodb';
import { User } from '../../../../models/user.model';
import bcrypt from 'bcryptjs';
import { generateToken } from '../../../../lib/auth';
import { TRPCError } from '@trpc/server';

export const signupProcedure = publicProcedure
  .input(z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(2),
  }))
  .mutation(async ({ input }) => {
    const { db } = await connectToDatabase();
    const usersCollection = db.collection<User>('users');

    const existingUser = await usersCollection.findOne({ email: input.email });
    
    if (existingUser) {
      throw new TRPCError({ 
        code: 'BAD_REQUEST', 
        message: 'Email already registered' 
      });
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);

    const newUser: User = {
      email: input.email,
      password: hashedPassword,
      name: input.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUser);

    const token = generateToken({
      userId: result.insertedId.toString(),
      email: newUser.email,
    });

    return {
      token,
      user: {
        id: result.insertedId.toString(),
        email: newUser.email,
        name: newUser.name,
      },
    };
  });
