import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
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
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  category: string;
}

const defaultUser: UserProfile = {
  id: 'user_1',
  name: 'Life Explorer',
  email: 'explorer@lifemastery.app',
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

const availableAchievements: Omit<Achievement, 'unlockedAt'>[] = [
  {
    id: 'first_activity',
    title: 'First Steps',
    description: 'Complete your first activity',
    icon: '🎯',
    category: 'milestone'
  },
  {
    id: 'week_streak',
    title: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    category: 'streak'
  },
  {
    id: 'month_streak',
    title: 'Monthly Master',
    description: 'Maintain a 30-day streak',
    icon: '👑',
    category: 'streak'
  },
  {
    id: 'all_categories',
    title: 'Life Explorer',
    description: 'Try activities in all life areas',
    icon: '🌟',
    category: 'exploration'
  },
  {
    id: 'hundred_activities',
    title: 'Century Club',
    description: 'Complete 100 activities',
    icon: '💯',
    category: 'milestone'
  },
  {
    id: 'health_master',
    title: 'Health Hero',
    description: 'Reach 90% in Health category',
    icon: '❤️',
    category: 'mastery'
  },
  {
    id: 'wealth_master',
    title: 'Wealth Wizard',
    description: 'Reach 90% in Wealth category',
    icon: '💰',
    category: 'mastery'
  },
  {
    id: 'relationship_master',
    title: 'Connection Champion',
    description: 'Reach 90% in Relationships category',
    icon: '🤝',
    category: 'mastery'
  },
  {
    id: 'confidence_master',
    title: 'Confidence King',
    description: 'Reach 90% in Confidence category',
    icon: '🦁',
    category: 'mastery'
  },
  {
    id: 'learning_master',
    title: 'Knowledge Keeper',
    description: 'Reach 90% in Learning category',
    icon: '📚',
    category: 'mastery'
  },
  {
    id: 'early_bird',
    title: 'Early Bird',
    description: 'Complete 10 morning activities',
    icon: '🌅',
    category: 'habit'
  },
  {
    id: 'night_owl',
    title: 'Night Owl',
    description: 'Complete 10 evening activities',
    icon: '🦉',
    category: 'habit'
  }
];

export const [UserProvider, useUser] = createContextHook(() => {
  const [user, setUser] = useState<UserProfile>(defaultUser);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadUserData = useCallback(async () => {
    try {
      setIsLoading(true);
      const savedUser = await AsyncStorage.getItem('userProfile');
      const authStatus = await AsyncStorage.getItem('isAuthenticated');
      
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      
      if (authStatus === 'true') {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveUserData = useCallback(async () => {
    try {
      await AsyncStorage.setItem('userProfile', JSON.stringify(user));
      await AsyncStorage.setItem('isAuthenticated', isAuthenticated.toString());
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  }, [user, isAuthenticated]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  useEffect(() => {
    if (!isLoading) {
      saveUserData();
    }
  }, [saveUserData, isLoading]);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setUser(prevUser => ({ ...prevUser, ...updates }));
  }, []);

  const updatePreferences = useCallback((preferences: Partial<UserProfile['preferences']>) => {
    setUser(prevUser => ({
      ...prevUser,
      preferences: { ...prevUser.preferences, ...preferences }
    }));
  }, []);

  const updateStats = useCallback((stats: Partial<UserProfile['stats']>) => {
    setUser(prevUser => ({
      ...prevUser,
      stats: { ...prevUser.stats, ...stats }
    }));
  }, []);

  const checkAndUnlockAchievements = useCallback((activityCount: number, categoryScores: any, streakCount: number) => {
    const newAchievements: Achievement[] = [];
    const currentAchievementIds = user.achievements.map(a => a.id);

    availableAchievements.forEach(achievement => {
      if (currentAchievementIds.includes(achievement.id)) return;

      let shouldUnlock = false;

      switch (achievement.id) {
        case 'first_activity':
          shouldUnlock = activityCount >= 1;
          break;
        case 'week_streak':
          shouldUnlock = streakCount >= 7;
          break;
        case 'month_streak':
          shouldUnlock = streakCount >= 30;
          break;
        case 'hundred_activities':
          shouldUnlock = activityCount >= 100;
          break;
        case 'health_master':
          shouldUnlock = categoryScores.health >= 90;
          break;
        case 'wealth_master':
          shouldUnlock = categoryScores.wealth >= 90;
          break;
        case 'relationship_master':
          shouldUnlock = categoryScores.relationships >= 90;
          break;
        case 'confidence_master':
          shouldUnlock = categoryScores.confidence >= 90;
          break;
        case 'learning_master':
          shouldUnlock = categoryScores.learning >= 90;
          break;
        case 'all_categories':
          const categoriesWithActivity = Object.values(categoryScores).filter((score: any) => score > 0).length;
          shouldUnlock = categoriesWithActivity >= 10;
          break;
      }

      if (shouldUnlock) {
        newAchievements.push({
          ...achievement,
          unlockedAt: new Date().toISOString()
        });
      }
    });

    if (newAchievements.length > 0) {
      setUser(prevUser => ({
        ...prevUser,
        achievements: [...prevUser.achievements, ...newAchievements],
        stats: {
          ...prevUser.stats,
          achievementsUnlocked: prevUser.stats.achievementsUnlocked + newAchievements.length
        }
      }));
      
      // Return new achievements for notification purposes
      return newAchievements;
    }

    return [];
  }, [user.achievements]);

  const signIn = useCallback(async (name: string, email: string) => {
    const newUser: UserProfile = {
      ...defaultUser,
      id: `user_${Date.now()}`,
      name,
      email,
      joinDate: new Date().toISOString()
    };
    
    setUser(newUser);
    setIsAuthenticated(true);
  }, []);

  const signOut = useCallback(async () => {
    setIsAuthenticated(false);
    setUser(defaultUser);
    await AsyncStorage.removeItem('userProfile');
    await AsyncStorage.removeItem('isAuthenticated');
  }, []);

  const getInitials = useCallback(() => {
    return user.name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, [user.name]);

  const getJoinDuration = useCallback(() => {
    const joinDate = new Date(user.joinDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - joinDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} days`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} year${years > 1 ? 's' : ''}`;
    }
  }, [user.joinDate]);

  return useMemo(() => ({
    user,
    isAuthenticated,
    isLoading,
    updateProfile,
    updatePreferences,
    updateStats,
    checkAndUnlockAchievements,
    signIn,
    signOut,
    getInitials,
    getJoinDuration
  }), [
    user,
    isAuthenticated,
    isLoading,
    updateProfile,
    updatePreferences,
    updateStats,
    checkAndUnlockAchievements,
    signIn,
    signOut,
    getInitials,
    getJoinDuration
  ]);
});

// Helper hook for user achievements
export const useUserAchievements = () => {
  const { user } = useUser();
  
  return useMemo(() => {
    const unlockedAchievements = user.achievements;
    const totalAchievements = availableAchievements.length;
    const completionPercentage = Math.round((unlockedAchievements.length / totalAchievements) * 100);
    
    const achievementsByCategory = unlockedAchievements.reduce((acc, achievement) => {
      if (!acc[achievement.category]) {
        acc[achievement.category] = [];
      }
      acc[achievement.category].push(achievement);
      return acc;
    }, {} as Record<string, Achievement[]>);
    
    return {
      unlockedAchievements,
      totalAchievements,
      completionPercentage,
      achievementsByCategory,
      recentAchievements: unlockedAchievements
        .sort((a, b) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime())
        .slice(0, 5)
    };
  }, [user.achievements]);
};