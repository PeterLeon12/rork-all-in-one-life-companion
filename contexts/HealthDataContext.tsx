import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';

interface DailyHealthData {
  date: string;
  goalsCompleted: number;
  totalGoals: number;
  categories: { [key: string]: number };
  stepCount: number;
  streak: number;
}

interface WeeklyHealthSummary {
  weekStart: string;
  weekEnd: string;
  totalGoalsCompleted: number;
  averageCompletion: number;
  bestDay: string;
  categories: { [key: string]: number };
  dailyData: DailyHealthData[];
}

export const [HealthDataProvider, useHealthData] = createContextHook(() => {
  const [dailyData, setDailyData] = useState<DailyHealthData[]>([]);
  const [currentStreak, setCurrentStreak] = useState<number>(0);

  const loadHealthData = useCallback(async () => {
    try {
      const savedData = await AsyncStorage.getItem('dailyHealthData');
      const savedStreak = await AsyncStorage.getItem('healthStreak');
      
      if (savedData) {
        setDailyData(JSON.parse(savedData));
      }
      
      if (savedStreak) {
        setCurrentStreak(parseInt(savedStreak));
      }
    } catch (error) {
      console.error('Error loading health data:', error);
    }
  }, []);

  const saveHealthData = useCallback(async () => {
    try {
      await AsyncStorage.setItem('dailyHealthData', JSON.stringify(dailyData));
      await AsyncStorage.setItem('healthStreak', currentStreak.toString());
    } catch (error) {
      console.error('Error saving health data:', error);
    }
  }, [dailyData, currentStreak]);

  useEffect(() => {
    loadHealthData();
  }, [loadHealthData]);

  useEffect(() => {
    if (dailyData.length > 0) {
      saveHealthData();
    }
  }, [dailyData, currentStreak, saveHealthData]);

  const recordDailyData = useCallback((data: Omit<DailyHealthData, 'date'>) => {
    const today = new Date().toISOString().split('T')[0];
    
    setDailyData(prev => {
      const existingIndex = prev.findIndex(d => d.date === today);
      const newData = { ...data, date: today };
      
      if (existingIndex >= 0) {
        // Update existing data
        const updated = [...prev];
        updated[existingIndex] = newData;
        return updated;
      } else {
        // Add new data and keep last 30 days
        return [newData, ...prev].slice(0, 30);
      }
    });

    // Update streak based on completion rate
    const completionRate = data.totalGoals > 0 ? (data.goalsCompleted / data.totalGoals) : 0;
    if (completionRate >= 0.6) { // 60% completion threshold
      setCurrentStreak(prev => prev + 1);
    } else {
      setCurrentStreak(0);
    }
  }, []);

  const getWeeklySummary = useCallback((weekOffset: number = 0): WeeklyHealthSummary | null => {
    const now = new Date();
    const targetDate = new Date(now.getTime() + (weekOffset * 7 * 24 * 60 * 60 * 1000));
    
    // Get start of week (Sunday)
    const weekStart = new Date(targetDate);
    weekStart.setDate(targetDate.getDate() - targetDate.getDay());
    weekStart.setHours(0, 0, 0, 0);
    
    // Get end of week (Saturday)
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    // Filter data for this week
    const weekData = dailyData.filter(data => {
      const dataDate = new Date(data.date);
      return dataDate >= weekStart && dataDate <= weekEnd;
    });

    if (weekData.length === 0) {
      return null;
    }

    // Calculate summary
    const totalGoalsCompleted = weekData.reduce((sum, day) => sum + day.goalsCompleted, 0);
    const totalPossibleGoals = weekData.reduce((sum, day) => sum + day.totalGoals, 0);
    const averageCompletion = totalPossibleGoals > 0 ? (totalGoalsCompleted / totalPossibleGoals) * 100 : 0;

    // Find best day
    const bestDay = weekData.reduce((best, current) => {
      const currentRate = current.totalGoals > 0 ? current.goalsCompleted / current.totalGoals : 0;
      const bestRate = best.totalGoals > 0 ? best.goalsCompleted / best.totalGoals : 0;
      return currentRate > bestRate ? current : best;
    });

    // Aggregate categories
    const categories: { [key: string]: number } = {};
    weekData.forEach(day => {
      Object.entries(day.categories).forEach(([category, count]) => {
        categories[category] = (categories[category] || 0) + count;
      });
    });

    return {
      weekStart: weekStart.toISOString().split('T')[0],
      weekEnd: weekEnd.toISOString().split('T')[0],
      totalGoalsCompleted,
      averageCompletion: Math.round(averageCompletion),
      bestDay: bestDay.date,
      categories,
      dailyData: weekData
    };
  }, [dailyData]);

  const getTodaysData = useCallback((): DailyHealthData | null => {
    const today = new Date().toISOString().split('T')[0];
    return dailyData.find(data => data.date === today) || null;
  }, [dailyData]);

  return useMemo(() => ({
    dailyData,
    currentStreak,
    recordDailyData,
    getWeeklySummary,
    getTodaysData,
    loadHealthData
  }), [dailyData, currentStreak, recordDailyData, getWeeklySummary, getTodaysData, loadHealthData]);
});