import { z } from 'zod';
import { protectedProcedure } from '../../../create-context';
import { TRPCError } from '@trpc/server';
import { getUsers, saveUser } from '../../auth/register/route';

export const updateDailyGoalsProcedure = protectedProcedure
  .input(
    z.object({
      goals: z.array(z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        category: z.string(),
        completed: z.boolean(),
        completedAt: z.string().optional(),
        streak: z.number(),
        importance: z.enum(['high', 'medium', 'low']),
        timeOfDay: z.enum(['morning', 'afternoon', 'evening', 'anytime']).optional()
      })),
      completedGoalsToday: z.number(),
      dailyStreak: z.number()
    })
  )
  .mutation(async ({ input, ctx }) => {
    const { goals, completedGoalsToday, dailyStreak } = input;
    const userId = ctx.userId;

    // Get current user
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found',
      });
    }

    // Update health data
    const updatedUser = {
      ...user,
      healthData: {
        ...user.healthData,
        dailyGoals: goals,
        completedGoals: completedGoalsToday,
        streak: dailyStreak,
        lastUpdated: new Date().toISOString(),
        weeklyReports: user.healthData?.weeklyReports || []
      }
    };

    saveUser(updatedUser);

    return {
      success: true,
      message: 'Health data updated successfully'
    };
  });