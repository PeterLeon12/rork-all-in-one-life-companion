import { z } from 'zod';
import { publicProcedure } from '../../../create-context';
import { TRPCError } from '@trpc/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { getUsers } from '../register/route';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export const loginProcedure = publicProcedure
  .input(
    z.object({
      emailOrUsername: z.string().min(1, 'Email or username is required'),
      password: z.string().min(1, 'Password is required'),
    })
  )
  .mutation(async ({ input }) => {
    const { emailOrUsername, password } = input;

    // Find user by email or username (for now, we'll treat it as email since we don't have username field)
    const users = getUsers();
    const user = users.find(u => u.email === emailOrUsername || u.name === emailOrUsername);
    if (!user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Invalid email or password',
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Invalid email or password',
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;
    
    return {
      user: userWithoutPassword,
      token,
      message: 'Login successful'
    };
  });