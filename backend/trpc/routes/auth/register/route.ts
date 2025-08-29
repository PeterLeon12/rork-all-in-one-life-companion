import { z } from 'zod';
import { publicProcedure } from '../../../create-context';
import { TRPCError } from '@trpc/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Simple in-memory user storage (replace with database in production)
const users: Array<{
  id: string;
  name: string;
  email: string;
  password: string;
  joinDate: string;
  preferences: {
    notifications: boolean;
    darkMode: boolean;
    reminderTime: string;
    weeklyGoals: number;
  };
  stats: {
    totalActivities: number;
    currentStreak: number;
    longestStreak: number;
    achievementsUnlocked: number;
    goalsCompleted: number;
  };
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    unlockedAt: string;
    category: string;
  }>;
}> = [];

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export const registerProcedure = publicProcedure
  .input(
    z.object({
      name: z.string().min(1, 'Name is required'),
      email: z.string().email('Invalid email address'),
      password: z.string().min(6, 'Password must be at least 6 characters'),
    })
  )
  .mutation(async ({ input }) => {
    const { name, email, password } = input;

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'User with this email already exists',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      email,
      password: hashedPassword,
      joinDate: new Date().toISOString(),
      preferences: {
        notifications: true,
        darkMode: false,
        reminderTime: '09:00',
        weeklyGoals: 5
      },
      stats: {
        totalActivities: 0,
        currentStreak: 0,
        longestStreak: 0,
        achievementsUnlocked: 0,
        goalsCompleted: 0
      },
      achievements: []
    };

    users.push(newUser);

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Return user data without password
    const { password: _, ...userWithoutPassword } = newUser;
    
    return {
      user: userWithoutPassword,
      token,
      message: 'User registered successfully'
    };
  });

// Export users array for other routes to access
export { users };