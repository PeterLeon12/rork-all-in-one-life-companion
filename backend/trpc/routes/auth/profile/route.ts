import { z } from 'zod';
import { protectedProcedure } from '../../../create-context';
import { TRPCError } from '@trpc/server';
import { getUsers, saveUser } from '../register/route';

export const getProfileProcedure = protectedProcedure
  .query(async ({ ctx }) => {
    const users = getUsers();
    const user = users.find(u => u.id === ctx.userId);
    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found',
      });
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });

export const updateProfileProcedure = protectedProcedure
  .input(
    z.object({
      name: z.string().min(1).optional(),
      preferences: z.object({
        notifications: z.boolean().optional(),
        darkMode: z.boolean().optional(),
        reminderTime: z.string().optional(),
        weeklyGoals: z.number().optional(),
      }).optional(),
      stats: z.object({
        totalActivities: z.number().optional(),
        currentStreak: z.number().optional(),
        longestStreak: z.number().optional(),
        achievementsUnlocked: z.number().optional(),
        goalsCompleted: z.number().optional(),
      }).optional(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const users = getUsers();
    const user = users.find(u => u.id === ctx.userId);
    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found',
      });
    }

    // Update user data
    const updatedUser = { ...user };
    if (input.name) {
      updatedUser.name = input.name;
    }
    if (input.preferences) {
      updatedUser.preferences = { ...updatedUser.preferences, ...input.preferences };
    }
    if (input.stats) {
      updatedUser.stats = { ...updatedUser.stats, ...input.stats };
    }

    saveUser(updatedUser);

    const { password: _, ...userWithoutPassword } = updatedUser;
    return {
      user: userWithoutPassword,
      message: 'Profile updated successfully'
    };
  });

export const addAchievementProcedure = protectedProcedure
  .input(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      icon: z.string(),
      category: z.string(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const users = getUsers();
    const user = users.find(u => u.id === ctx.userId);
    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found',
      });
    }

    const achievement = {
      ...input,
      unlockedAt: new Date().toISOString()
    };

    // Check if achievement already exists
    const existingAchievement = user.achievements.find(a => a.id === input.id);
    if (!existingAchievement) {
      const updatedUser = {
        ...user,
        achievements: [...user.achievements, achievement],
        stats: {
          ...user.stats,
          achievementsUnlocked: user.stats.achievementsUnlocked + 1
        }
      };
      
      saveUser(updatedUser);
      
      const { password: _, ...userWithoutPassword } = updatedUser;
      return {
        user: userWithoutPassword,
        newAchievement: achievement,
        message: 'Achievement unlocked!'
      };
    }

    const { password: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      newAchievement: achievement,
      message: 'Achievement already unlocked'
    };
  });