import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useUser } from './UserContext';

export interface CategoryScore {
  health: number;
  fitness: number;
  wealth: number;
  relationships: number;
  confidence: number;
  learning: number;
  productivity: number;
  mindfulness: number;
  creativity: number;
  energy: number;
  lifestyle: number;
  breakFree: number;
  travel: number;
  community: number;
}

export interface CategoryActivity {
  id: string;
  categoryId: string;
  type: string;
  title: string;
  impact: Partial<CategoryScore>;
  timestamp: number;
  value?: number;
}



const initialScores: CategoryScore = {
  health: 75,
  fitness: 70,
  wealth: 65,
  relationships: 80,
  confidence: 72,
  learning: 78,
  productivity: 85,
  mindfulness: 68,
  creativity: 74,
  energy: 76,
  lifestyle: 73,
  breakFree: 60,
  travel: 50,
  community: 55
};

// Define interconnections between categories
const categoryConnections: Record<string, Partial<CategoryScore>> = {
  // Exercise impacts multiple areas
  exercise: {
    fitness: 3,
    health: 2,
    energy: 2,
    confidence: 1,
    mindfulness: 1
  },
  // Meditation impacts mental wellness
  meditation: {
    mindfulness: 3,
    health: 2,
    confidence: 1,
    productivity: 1,
    energy: 1
  },
  // Learning impacts growth areas
  learning: {
    learning: 3,
    confidence: 2,
    wealth: 1,
    creativity: 1
  },
  // Social activities impact relationships and confidence
  social: {
    relationships: 3,
    confidence: 2,
    health: 1
  },
  // Creative work impacts multiple areas
  creative: {
    creativity: 3,
    mindfulness: 1,
    confidence: 1,
    learning: 1
  },
  // Financial activities
  financial: {
    wealth: 3,
    confidence: 1,
    learning: 1
  },
  // Productivity activities
  productivity: {
    productivity: 3,
    confidence: 1,
    wealth: 1
  },
  // Health activities
  health: {
    health: 3,
    energy: 2,
    fitness: 1,
    mindfulness: 1
  },
  // Breaking bad habits
  breakHabit: {
    breakFree: 4,
    health: 2,
    confidence: 2,
    energy: 1
  },
  // Lifestyle improvements
  lifestyle: {
    lifestyle: 3,
    health: 1,
    energy: 1,
    mindfulness: 1
  },
  // Travel activities
  travel: {
    travel: 3,
    creativity: 1,
    learning: 2,
    confidence: 1,
    relationships: 1
  },
  // Community service
  community: {
    community: 3,
    relationships: 2,
    confidence: 1,
    mindfulness: 1
  }
};

export const [CategoryProvider, useCategories] = createContextHook(() => {
  const [scores, setScores] = useState<CategoryScore>(initialScores);
  const [activities, setActivities] = useState<CategoryActivity[]>([]);
  
  // Get user context if available (will be undefined during initial render)
  let userContext: ReturnType<typeof useUser> | null = null;
  try {
    userContext = useUser();
  } catch {
    // User context not available yet
  }

  const loadData = useCallback(async () => {
    try {
      const savedScores = await AsyncStorage.getItem('categoryScores');
      const savedActivities = await AsyncStorage.getItem('categoryActivities');
      
      if (savedScores) {
        setScores(JSON.parse(savedScores));
      }
      
      if (savedActivities) {
        setActivities(JSON.parse(savedActivities));
      }
    } catch (error) {
      console.error('Error loading category data:', error);
    }
  }, []);

  const saveData = useCallback(async () => {
    try {
      await AsyncStorage.setItem('categoryScores', JSON.stringify(scores));
      await AsyncStorage.setItem('categoryActivities', JSON.stringify(activities));
    } catch (error) {
      console.error('Error saving category data:', error);
    }
  }, [scores, activities]);

  // Load data from AsyncStorage on mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Save data whenever scores or activities change
  useEffect(() => {
    saveData();
  }, [saveData]);

  const addActivity = useCallback((activity: Omit<CategoryActivity, 'id' | 'timestamp'>) => {
    const newActivity: CategoryActivity = {
      ...activity,
      id: Date.now().toString(),
      timestamp: Date.now()
    };

    // Apply the activity's impact to scores
    setScores(prevScores => {
      const newScores = { ...prevScores };
      
      // Apply direct impact
      Object.entries(activity.impact).forEach(([category, impact]) => {
        if (impact && category in newScores) {
          const key = category as keyof CategoryScore;
          newScores[key] = Math.min(100, Math.max(0, newScores[key] + impact));
        }
      });

      // Apply interconnected impacts based on activity type
      const connections = categoryConnections[activity.type];
      if (connections) {
        Object.entries(connections).forEach(([category, impact]) => {
          if (impact && category in newScores) {
            const key = category as keyof CategoryScore;
            // Reduce impact for interconnections to avoid over-boosting
            const adjustedImpact = impact * 0.5;
            newScores[key] = Math.min(100, Math.max(0, newScores[key] + adjustedImpact));
          }
        });
      }

      // Update user stats and check achievements if user context is available
      if (userContext) {
        const { updateStats, checkAndUnlockAchievements, user } = userContext;
        
        // Update activity count
        const newActivityCount = user.stats.totalActivities + 1;
        
        // Calculate current streak (simplified - could be more sophisticated)
        const today = new Date();
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
        const yesterdayStart = todayStart - (24 * 60 * 60 * 1000);
        
        const todayActivities = activities.filter(a => a.timestamp >= todayStart).length + 1; // +1 for current activity
        const yesterdayActivities = activities.filter(a => a.timestamp >= yesterdayStart && a.timestamp < todayStart).length;
        
        let newStreak = user.stats.currentStreak;
        if (todayActivities === 1) { // First activity today
          if (yesterdayActivities > 0) {
            newStreak += 1; // Continue streak
          } else {
            newStreak = 1; // Start new streak
          }
        }
        
        // Update stats
        updateStats({
          totalActivities: newActivityCount,
          currentStreak: newStreak,
          longestStreak: Math.max(user.stats.longestStreak, newStreak)
        });
        
        // Check for new achievements
        const newAchievements = checkAndUnlockAchievements(newActivityCount, newScores, newStreak);
        
        if (newAchievements.length > 0) {
          console.log('New achievements unlocked:', newAchievements.map(a => a.title));
        }
      }

      return newScores;
    });

    // Add to activities list (keep last 100 activities)
    setActivities(prevActivities => {
      const newActivities = [newActivity, ...prevActivities].slice(0, 100);
      return newActivities;
    });

    console.log(`Activity added: ${activity.title} - Impact:`, activity.impact);
  }, [activities, userContext]);

  const getOverallScore = useCallback((): number => {
    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    return Math.round(totalScore / Object.keys(scores).length);
  }, [scores]);

  const getCategoryProgress = useCallback((categoryId: string): number => {
    const key = categoryId as keyof CategoryScore;
    return scores[key] || 0;
  }, [scores]);

  const getWeeklyImprovement = useCallback((categoryId: string): number => {
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const weeklyActivities = activities.filter(
      activity => activity.timestamp > oneWeekAgo && 
      (activity.categoryId === categoryId || activity.impact[categoryId as keyof CategoryScore])
    );
    
    const totalImprovement = weeklyActivities.reduce((sum, activity) => {
      const impact = activity.impact[categoryId as keyof CategoryScore] || 0;
      return sum + impact;
    }, 0);

    return Math.round(totalImprovement);
  }, [activities]);

  const resetScores = useCallback(() => {
    setScores(initialScores);
    setActivities([]);
  }, []);

  return useMemo(() => ({
    scores,
    activities,
    addActivity,
    getOverallScore,
    getCategoryProgress,
    getWeeklyImprovement,
    resetScores
  }), [scores, activities, addActivity, getOverallScore, getCategoryProgress, getWeeklyImprovement, resetScores]);
});

// Helper hook for specific category data
export const useCategoryData = (categoryId: string) => {
  const { scores, activities, getCategoryProgress, getWeeklyImprovement } = useCategories();
  
  return useMemo(() => {
    const categoryScore = getCategoryProgress(categoryId);
    const weeklyImprovement = getWeeklyImprovement(categoryId);
    const recentActivities = activities
      .filter(activity => 
        activity.categoryId === categoryId || 
        activity.impact[categoryId as keyof CategoryScore]
      )
      .slice(0, 10);

    return {
      score: categoryScore,
      weeklyImprovement,
      recentActivities,
      allScores: scores
    };
  }, [categoryId, scores, activities, getCategoryProgress, getWeeklyImprovement]);
};

// Helper functions for common activities
export const createActivityImpact = {
  exercise: (intensity: 'light' | 'moderate' | 'intense' = 'moderate') => {
    const multiplier = intensity === 'light' ? 0.5 : intensity === 'intense' ? 1.5 : 1;
    return {
      type: 'exercise',
      impact: {
        fitness: 3 * multiplier,
        health: 2 * multiplier,
        energy: 2 * multiplier,
        confidence: 1 * multiplier
      }
    };
  },
  
  meditation: (duration: number) => {
    const multiplier = Math.min(duration / 20, 2); // 20 min = 1x, caps at 2x
    return {
      type: 'meditation',
      impact: {
        mindfulness: 3 * multiplier,
        health: 2 * multiplier,
        confidence: 1 * multiplier,
        energy: 1 * multiplier
      }
    };
  },
  
  learning: (hours: number) => {
    const multiplier = Math.min(hours / 2, 2); // 2 hours = 1x, caps at 2x
    return {
      type: 'learning',
      impact: {
        learning: 3 * multiplier,
        confidence: 2 * multiplier,
        creativity: 1 * multiplier
      }
    };
  },
  
  socialActivity: () => ({
    type: 'social',
    impact: {
      relationships: 3,
      confidence: 2,
      health: 1
    }
  }),
  
  creativeWork: (hours: number) => {
    const multiplier = Math.min(hours / 1, 2); // 1 hour = 1x, caps at 2x
    return {
      type: 'creative',
      impact: {
        creativity: 3 * multiplier,
        mindfulness: 1 * multiplier,
        confidence: 1 * multiplier
      }
    };
  },
  
  financialActivity: () => ({
    type: 'financial',
    impact: {
      wealth: 3,
      confidence: 1,
      learning: 1
    }
  }),
  
  productivityTask: () => ({
    type: 'productivity',
    impact: {
      productivity: 3,
      confidence: 1
    }
  }),
  
  healthActivity: () => ({
    type: 'health',
    impact: {
      health: 3,
      energy: 2,
      mindfulness: 1
    }
  }),
  
  breakBadHabit: () => ({
    type: 'breakHabit',
    impact: {
      breakFree: 4,
      health: 2,
      confidence: 2,
      energy: 1
    }
  }),
  
  lifestyleImprovement: () => ({
    type: 'lifestyle',
    impact: {
      lifestyle: 3,
      health: 1,
      energy: 1
    }
  })
};