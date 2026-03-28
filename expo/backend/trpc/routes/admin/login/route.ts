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
    try {
      console.log('Admin login attempt for:', input.email);
      
      const { db } = await connectToDatabase();
      const adminsCollection = db.collection<Admin>('admins');

      const adminCount = await adminsCollection.countDocuments();
      console.log('Total admins in database:', adminCount);

      const admin = await adminsCollection.findOne({ email: input.email });
      
      if (!admin) {
        console.log('Admin not found for email:', input.email);
        throw new TRPCError({ 
          code: 'UNAUTHORIZED', 
          message: 'Invalid email or password' 
        });
      }

      console.log('Admin found:', admin.email);

      const isValidPassword = await bcrypt.compare(input.password, admin.password);
      
      if (!isValidPassword) {
        console.log('Invalid password for admin:', input.email);
        throw new TRPCError({ 
          code: 'UNAUTHORIZED', 
          message: 'Invalid email or password' 
        });
      }

      console.log('Login successful for admin:', admin.email);

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
    } catch (error) {
      console.error('Admin login error:', error);
      if (error instanceof TRPCError) {
        throw error;
      }
      throw new TRPCError({ 
        code: 'INTERNAL_SERVER_ERROR', 
        message: error instanceof Error ? error.message : 'Login failed' 
      });
    }
  });
