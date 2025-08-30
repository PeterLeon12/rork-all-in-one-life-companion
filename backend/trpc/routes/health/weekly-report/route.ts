import { z } from 'zod';
import { protectedProcedure } from '../../../create-context';
import { TRPCError } from '@trpc/server';
import { getUsers, saveUser } from '../../auth/register/route';

// Helper function to get start of week (Sunday)
const getWeekStart = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
};

// Helper function to get end of week (Saturday)
const getWeekEnd = (date: Date): Date => {
  const weekStart = getWeekStart(date);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  return weekEnd;
};

// Generate insights based on weekly data
const generateWeeklyInsights = (
  totalGoalsCompleted: number,
  averageDailyCompletion: number,
  categories: { [key: string]: number },
  bestDay: string
): string[] => {
  const insights: string[] = [];

  // Performance insights
  if (averageDailyCompletion >= 80) {
    insights.push("🎉 Excellent week! You maintained high consistency with your health goals.");
  } else if (averageDailyCompletion >= 60) {
    insights.push("👍 Good progress this week! You're building solid healthy habits.");
  } else if (averageDailyCompletion >= 40) {
    insights.push("📈 Room for improvement. Try setting smaller, more achievable daily goals.");
  } else {
    insights.push("💪 Every journey starts with a single step. Focus on one goal at a time.");
  }

  // Category insights
  const topCategory = Object.entries(categories).reduce((a, b) => a[1] > b[1] ? a : b);
  if (topCategory && topCategory[1] > 0) {
    insights.push(`🏆 You excelled in ${topCategory[0]} with ${topCategory[1]} goals completed!`);
  }

  // Best day insight
  if (bestDay) {
    const dayName = new Date(bestDay).toLocaleDateString('en-US', { weekday: 'long' });
    insights.push(`⭐ ${dayName} was your strongest day this week!`);
  }

  // Motivational insights
  if (totalGoalsCompleted > 0) {
    insights.push(`🎯 You completed ${totalGoalsCompleted} health goals this week. Keep up the momentum!`);
  }

  return insights;
};

export const generateWeeklyReportProcedure = protectedProcedure
  .input(
    z.object({
      weekOffset: z.number().default(0) // 0 = current week, -1 = last week, etc.
    })
  )
  .query(async ({ input, ctx }) => {
    const { weekOffset } = input;
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

    // Calculate week dates
    const now = new Date();
    const targetDate = new Date(now);
    targetDate.setDate(now.getDate() + (weekOffset * 7));
    
    const weekStart = getWeekStart(targetDate);
    const weekEnd = getWeekEnd(targetDate);

    // Check if report already exists
    const existingReport = user.healthData?.weeklyReports?.find(report => 
      report.weekStart === weekStart.toISOString().split('T')[0]
    );

    if (existingReport && weekOffset !== 0) {
      return existingReport;
    }

    // Generate new report for current/recent week
    const dailyGoals = user.healthData?.dailyGoals || [];
    
    // Simulate daily data for the week (in a real app, you'd store daily snapshots)
    const weeklyData = {
      totalGoalsCompleted: dailyGoals.filter(goal => goal.completed).length * 7, // Simulate week data
      dailyCompletions: [
        { date: new Date(weekStart.getTime() + 0 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], completed: Math.floor(Math.random() * dailyGoals.length) },
        { date: new Date(weekStart.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], completed: Math.floor(Math.random() * dailyGoals.length) },
        { date: new Date(weekStart.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], completed: Math.floor(Math.random() * dailyGoals.length) },
        { date: new Date(weekStart.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], completed: Math.floor(Math.random() * dailyGoals.length) },
        { date: new Date(weekStart.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], completed: Math.floor(Math.random() * dailyGoals.length) },
        { date: new Date(weekStart.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], completed: Math.floor(Math.random() * dailyGoals.length) },
        { date: new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], completed: Math.floor(Math.random() * dailyGoals.length) }
      ]
    };

    // Calculate categories
    const categories: { [key: string]: number } = {};
    dailyGoals.forEach(goal => {
      if (goal.completed) {
        categories[goal.category] = (categories[goal.category] || 0) + 1;
      }
    });

    // Find best day
    const bestDay = weeklyData.dailyCompletions.reduce((best, current) => 
      current.completed > best.completed ? current : best
    );

    const totalCompleted = weeklyData.dailyCompletions.reduce((sum, day) => sum + day.completed, 0);
    const averageDailyCompletion = dailyGoals.length > 0 ? (totalCompleted / (dailyGoals.length * 7)) * 100 : 0;

    const report = {
      weekStart: weekStart.toISOString().split('T')[0],
      weekEnd: weekEnd.toISOString().split('T')[0],
      totalGoalsCompleted: totalCompleted,
      averageDailyCompletion: Math.round(averageDailyCompletion),
      bestDay: bestDay.date,
      categories,
      insights: generateWeeklyInsights(totalCompleted, averageDailyCompletion, categories, bestDay.date),
      dailyBreakdown: weeklyData.dailyCompletions
    };

    // Save report to user data (only for completed weeks)
    if (weekOffset < 0) {
      const updatedUser = {
        ...user,
        healthData: {
          dailyGoals: user.healthData?.dailyGoals || [],
          completedGoals: user.healthData?.completedGoals || 0,
          streak: user.healthData?.streak || 0,
          lastUpdated: user.healthData?.lastUpdated || new Date().toISOString(),
          weeklyReports: [
            ...(user.healthData?.weeklyReports || []),
            report
          ].slice(-12) // Keep last 12 weeks
        }
      };
      saveUser(updatedUser);
    }

    return report;
  });