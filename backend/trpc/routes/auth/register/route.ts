import { z } from 'zod';
import { publicProcedure } from '../../../create-context';
import { TRPCError } from '@trpc/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

export interface User {
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
  achievements: {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlockedAt: string;
    category: string;
  }[];
}

// File-based user storage
const USERS_FILE = path.join(process.cwd(), 'users.json');

// Load users from file
const loadUsers = (): User[] => {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading users:', error);
  }
  return [];
};

// Save users to file
const saveUsers = (users: User[]) => {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error saving users:', error);
  }
};

// Get users (loads from file each time to ensure fresh data)
export const getUsers = (): User[] => {
  return loadUsers();
};

// Add or update user
export const saveUser = (user: User) => {
  const users = loadUsers();
  const existingIndex = users.findIndex(u => u.id === user.id);
  
  if (existingIndex >= 0) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }
  
  saveUsers(users);
};

// Remove user
export const removeUser = (userId: string) => {
  const users = loadUsers();
  const filteredUsers = users.filter(u => u.id !== userId);
  saveUsers(filteredUsers);
};

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
    const users = getUsers();
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

    saveUser(newUser);

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

