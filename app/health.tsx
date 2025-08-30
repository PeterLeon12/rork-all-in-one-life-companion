import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Dimensions, Modal, Platform, Alert, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pedometer } from 'expo-sensors';
import { 
  Heart, 
  Activity, 
  Brain, 
  Moon, 
  Droplets,
  Plus,
  MessageCircle,
  CheckCircle,
  Utensils,
  X,
  TrendingUp,
  BarChart3,
  User,
  Target,
  Edit3,
  Save,
  Trash2,
  Quote,
  Sparkles
} from 'lucide-react-native';
import { useCategories, useCategoryData, createActivityImpact } from '@/contexts/CategoryContext';

const { width } = Dimensions.get('window');

interface HealthGoal {
  id: string;
  title: string;
  description: string;
  category: 'movement' | 'nutrition' | 'mindfulness' | 'sleep' | 'hydration';
  icon: React.ComponentType<any>;
  color: string;
  completed: boolean;
  completedAt?: string;
  streak: number;
  importance: 'high' | 'medium' | 'low';
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'anytime';
}

interface HealthMetric {
  id: string;
  label: string;
  value: number;
  target: number;
  unit: string;
  icon: React.ComponentType<any>;
  color: string;
  actionable: boolean;
}



const getInitialHealthGoals = (): HealthGoal[] => [
  {
    id: 'morning_movement',
    title: 'Morning Movement',
    description: 'Start your day with 10 minutes of movement - stretching, walking, or light exercise',
    category: 'movement',
    icon: Activity,
    color: '#FF6B6B',
    completed: false,
    streak: 0,
    importance: 'high',
    timeOfDay: 'morning'
  },
  {
    id: 'hydration_goal',
    title: 'Stay Hydrated',
    description: 'Drink 8 glasses of water throughout the day',
    category: 'hydration',
    icon: Droplets,
    color: '#4ECDC4',
    completed: false,
    streak: 0,
    importance: 'high',
    timeOfDay: 'anytime'
  },
  {
    id: 'mindful_break',
    title: 'Mindful Break',
    description: 'Take 5 minutes for deep breathing or meditation',
    category: 'mindfulness',
    icon: Brain,
    color: '#FFD93D',
    completed: false,
    streak: 0,
    importance: 'medium',
    timeOfDay: 'anytime'
  },
  {
    id: 'healthy_meal',
    title: 'Nutritious Meal',
    description: 'Eat at least one balanced meal with vegetables and protein',
    category: 'nutrition',
    icon: Utensils,
    color: '#27AE60',
    completed: false,
    streak: 0,
    importance: 'high',
    timeOfDay: 'anytime'
  },
  {
    id: 'evening_routine',
    title: 'Evening Wind-down',
    description: 'Create a calming evening routine 30 minutes before bed',
    category: 'sleep',
    icon: Moon,
    color: '#6C5CE7',
    completed: false,
    streak: 0,
    importance: 'medium',
    timeOfDay: 'evening'
  },
  {
    id: 'posture_check',
    title: 'Posture Check',
    description: 'Take hourly breaks to check and correct your posture',
    category: 'movement',
    icon: User,
    color: '#E67E22',
    completed: false,
    streak: 0,
    importance: 'medium',
    timeOfDay: 'anytime'
  }
];

const getInitialHealthMetrics = (): HealthMetric[] => [
  { id: 'steps', label: 'Steps Today', value: 0, target: 8000, unit: 'steps', icon: Activity, color: '#FF6B6B', actionable: false }
];





// Function to generate personalized health tips based on user profile
const generatePersonalizedHealthTips = async () => {
  try {
    const savedProfile = await AsyncStorage.getItem('userProfile');
    if (!savedProfile) {
      return getDefaultHealthTips();
    }
    
    const profile = JSON.parse(savedProfile);
    const tips = [];
    
    // BMI-based tips
    const bmi = profile.weight / ((profile.height / 100) ** 2);
    if (bmi < 18.5) {
      tips.push({
        title: 'Healthy Weight Gain',
        description: `With a BMI of ${bmi.toFixed(1)}, focus on nutrient-dense foods like nuts, avocados, and lean proteins.`,
        icon: Utensils,
        color: '#27AE60'
      });
    } else if (bmi > 25) {
      tips.push({
        title: 'Healthy Weight Management',
        description: `With a BMI of ${bmi.toFixed(1)}, consider portion control and regular physical activity.`,
        icon: Activity,
        color: '#FF6B6B'
      });
    } else {
      tips.push({
        title: 'Maintain Healthy Weight',
        description: `Great job! Your BMI of ${bmi.toFixed(1)} is in the healthy range. Keep up your current habits.`,
        icon: CheckCircle,
        color: '#27AE60'
      });
    }
    
    // Age-based tips
    if (profile.age < 30) {
      tips.push({
        title: 'Build Healthy Habits',
        description: 'Your twenties are perfect for establishing lifelong healthy habits. Focus on consistent sleep and exercise.',
        icon: TrendingUp,
        color: '#4ECDC4'
      });
    } else if (profile.age < 50) {
      tips.push({
        title: 'Prevent Age-Related Issues',
        description: 'Include strength training and calcium-rich foods to maintain bone density and muscle mass.',
        icon: Activity,
        color: '#FF6B6B'
      });
    } else {
      tips.push({
        title: 'Active Aging',
        description: 'Focus on balance exercises, regular health screenings, and staying socially active.',
        icon: Heart,
        color: '#6C5CE7'
      });
    }
    
    // Activity level based tips
    if (profile.activityLevel === 'sedentary') {
      tips.push({
        title: 'Start Moving More',
        description: 'Begin with 10-minute walks after meals. Small steps lead to big changes!',
        icon: Activity,
        color: '#FF6B6B'
      });
    } else if (profile.activityLevel === 'very_active') {
      tips.push({
        title: 'Recovery is Key',
        description: 'With your high activity level, ensure adequate rest and nutrition for optimal recovery.',
        icon: Moon,
        color: '#6C5CE7'
      });
    }
    
    // Goal-based tips
    if (profile.fitnessGoals?.includes('Weight Loss')) {
      tips.push({
        title: 'Sustainable Weight Loss',
        description: 'Aim for 1-2 pounds per week through a combination of diet and exercise. Stay consistent!',
        icon: Target,
        color: '#FF6B6B'
      });
    }
    
    if (profile.fitnessGoals?.includes('Better Sleep')) {
      tips.push({
        title: 'Sleep Optimization',
        description: 'Create a bedtime routine, avoid screens 1 hour before bed, and keep your room cool (65-68°F).',
        icon: Moon,
        color: '#6C5CE7'
      });
    }
    
    if (profile.fitnessGoals?.includes('Stress Relief')) {
      tips.push({
        title: 'Stress Management',
        description: 'Try 5-minute daily meditation, deep breathing exercises, or gentle yoga to reduce stress.',
        icon: Brain,
        color: '#FFD93D'
      });
    }
    
    // Gender-specific tips
    if (profile.gender === 'female') {
      tips.push({
        title: 'Women\'s Health Focus',
        description: 'Ensure adequate iron and calcium intake. Consider strength training to prevent osteoporosis.',
        icon: Heart,
        color: '#FF6B6B'
      });
    }
    
    // Hydration tip (universal)
    tips.push({
      title: 'Stay Hydrated',
      description: `Aim for ${Math.round(profile.weight * 35)}ml of water daily (about ${Math.round(profile.weight * 35 / 250)} glasses).`,
      icon: Droplets,
      color: '#4ECDC4'
    });
    
    return tips.slice(0, 4); // Return max 4 tips
  } catch (error) {
    console.error('Error generating personalized tips:', error);
    return getDefaultHealthTips();
  }
};

const getDefaultHealthTips = () => [
  {
    title: 'Stay Hydrated',
    description: 'Drink water first thing in the morning to kickstart your metabolism.',
    icon: Droplets,
    color: '#4ECDC4'
  },
  {
    title: 'Move Every Hour',
    description: 'Take a 2-minute walk every hour to improve circulation and energy.',
    icon: Activity,
    color: '#FF6B6B'
  },
  {
    title: 'Deep Breathing',
    description: 'Practice 4-7-8 breathing: inhale 4, hold 7, exhale 8 seconds.',
    icon: Brain,
    color: '#FFD93D'
  },
  {
    title: 'Sleep Hygiene',
    description: 'Keep your bedroom cool (65-68°F) for optimal sleep quality.',
    icon: Moon,
    color: '#6C5CE7'
  }
];

const healthQuotes = [
  {
    quote: "Take care of your body. It's the only place you have to live.",
    author: "Jim Rohn",
    category: "wellness"
  },
  {
    quote: "Health is not about the weight you lose, but about the life you gain.",
    author: "Dr. Josh Axe",
    category: "mindset"
  },
  {
    quote: "The groundwork for all happiness is good health.",
    author: "Leigh Hunt",
    category: "happiness"
  },
  {
    quote: "Your body can stand almost anything. It's your mind you have to convince.",
    author: "Unknown",
    category: "motivation"
  },
  {
    quote: "A healthy outside starts from the inside.",
    author: "Robert Urich",
    category: "holistic"
  },
  {
    quote: "Exercise is a celebration of what your body can do, not a punishment for what you ate.",
    author: "Unknown",
    category: "exercise"
  },
  {
    quote: "The first wealth is health.",
    author: "Ralph Waldo Emerson",
    category: "wealth"
  },
  {
    quote: "Health is a state of complete harmony of the body, mind and spirit.",
    author: "B.K.S. Iyengar",
    category: "balance"
  },
  {
    quote: "To keep the body in good health is a duty... otherwise we shall not be able to keep our mind strong and clear.",
    author: "Buddha",
    category: "duty"
  },
  {
    quote: "Every moment is a fresh beginning.",
    author: "T.S. Eliot",
    category: "renewal"
  }
];



export default function HealthScreen() {
  const { addActivity } = useCategories();
  const { score: healthScore } = useCategoryData('health');
  const [healthGoals, setHealthGoals] = useState<HealthGoal[]>(getInitialHealthGoals());
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>(getInitialHealthMetrics());
  const [dailyStreak, setDailyStreak] = useState<number>(0);
  const [selectedMetric, setSelectedMetric] = useState<HealthMetric | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [lastResetDate, setLastResetDate] = useState<string>('');
  const [isPedometerAvailable, setIsPedometerAvailable] = useState<boolean>(false);
  const [pastStepCount, setPastStepCount] = useState<number>(0);
  const [completedGoalsToday, setCompletedGoalsToday] = useState<number>(0);
  const [totalGoalsCompleted, setTotalGoalsCompleted] = useState<number>(0);
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [editGoalTitle, setEditGoalTitle] = useState<string>('');
  const [editGoalDescription, setEditGoalDescription] = useState<string>('');
  const [goalEditModalVisible, setGoalEditModalVisible] = useState<boolean>(false);

  const [personalizedTips, setPersonalizedTips] = useState<any[]>(getDefaultHealthTips());
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState<number>(0);

  const loadHealthData = React.useCallback(async () => {
    try {
      const savedGoals = await AsyncStorage.getItem('healthGoals');
      const savedMetrics = await AsyncStorage.getItem('healthMetrics');
      const savedStreak = await AsyncStorage.getItem('healthStreak');
      const savedResetDate = await AsyncStorage.getItem('healthResetDate');
      const savedCompletedToday = await AsyncStorage.getItem('completedGoalsToday');
      const savedTotalCompleted = await AsyncStorage.getItem('totalGoalsCompleted');
      
      if (savedGoals) {
        const parsedGoals = JSON.parse(savedGoals);
        const initialGoals = getInitialHealthGoals();
        const restoredGoals = parsedGoals.map((goal: any) => {
          const initialGoal = initialGoals.find(g => g.id === goal.id);
          return {
            ...goal,
            icon: initialGoal?.icon || Activity
          };
        });
        setHealthGoals(restoredGoals);
      }
      
      if (savedMetrics) {
        const parsedMetrics = JSON.parse(savedMetrics);
        const initialMetrics = getInitialHealthMetrics();
        const restoredMetrics = parsedMetrics.map((metric: any) => {
          const initialMetric = initialMetrics.find(m => m.id === metric.id);
          return {
            ...metric,
            icon: initialMetric?.icon || Activity
          };
        });
        setHealthMetrics(restoredMetrics);
      }
      
      if (savedStreak) {
        setDailyStreak(parseInt(savedStreak));
      }
      
      if (savedResetDate) {
        setLastResetDate(savedResetDate);
      }
      
      if (savedCompletedToday) {
        setCompletedGoalsToday(parseInt(savedCompletedToday));
      }
      
      if (savedTotalCompleted) {
        setTotalGoalsCompleted(parseInt(savedTotalCompleted));
      }
    } catch (error) {
      console.error('Error loading health data:', error);
    }
  }, []);

  const saveHealthData = React.useCallback(async () => {
    try {
      const goalsToSave = healthGoals.map(goal => ({
        ...goal,
        icon: undefined
      }));
      const metricsToSave = healthMetrics.map(metric => ({
        ...metric,
        icon: undefined
      }));
      
      await AsyncStorage.setItem('healthGoals', JSON.stringify(goalsToSave));
      await AsyncStorage.setItem('healthMetrics', JSON.stringify(metricsToSave));
      await AsyncStorage.setItem('healthStreak', dailyStreak.toString());
      await AsyncStorage.setItem('healthResetDate', lastResetDate);
      await AsyncStorage.setItem('completedGoalsToday', completedGoalsToday.toString());
      await AsyncStorage.setItem('totalGoalsCompleted', totalGoalsCompleted.toString());
    } catch (error) {
      console.error('Error saving health data:', error);
    }
  }, [healthGoals, healthMetrics, dailyStreak, lastResetDate, completedGoalsToday, totalGoalsCompleted]);

  const checkDailyReset = React.useCallback(() => {
    const today = new Date().toDateString();
    const lastReset = lastResetDate;
    
    if (lastReset !== today) {
      // Check if yesterday's goals were met for streak calculation
      const yesterdayGoalsMet = healthGoals.filter(goal => goal.completed).length >= Math.ceil(healthGoals.length * 0.6); // 60% completion threshold
      
      if (lastReset && yesterdayGoalsMet) {
        setDailyStreak(prev => prev + 1);
      } else if (lastReset) {
        setDailyStreak(0);
      }
      
      // Reset daily goals and metrics
      setHealthGoals(prev => prev.map(goal => ({
        ...goal,
        completed: false,
        completedAt: undefined
      })));
      
      setHealthMetrics(prev => prev.map(metric => ({
        ...metric,
        value: metric.id === 'steps' ? 0 : 0
      })));
      
      // Reset daily counters
      setCompletedGoalsToday(0);
      setPastStepCount(0);
      
      setLastResetDate(today);
    }
  }, [lastResetDate, healthGoals]);

  // Load saved metrics from storage and initialize pedometer
  useEffect(() => {
    loadHealthData();
    checkDailyReset();
    loadPersonalizedTips();
    
    // Rotate quotes every 10 seconds
    const quoteInterval = setInterval(() => {
      setCurrentQuoteIndex(prev => (prev + 1) % healthQuotes.length);
    }, 10000);
    
    return () => clearInterval(quoteInterval);
  }, [loadHealthData, checkDailyReset]);
  
  const loadPersonalizedTips = async () => {
    const tips = await generatePersonalizedHealthTips();
    setPersonalizedTips(tips);
  };

  // Save data whenever goals or metrics change
  useEffect(() => {
    saveHealthData();
  }, [saveHealthData]);
  
  // Toggle goal completion
  const toggleGoalCompletion = (goalId: string) => {
    setHealthGoals(prev => prev.map(goal => {
      if (goal.id === goalId) {
        const wasCompleted = goal.completed;
        const newCompleted = !wasCompleted;
        
        // Update counters
        if (newCompleted && !wasCompleted) {
          setCompletedGoalsToday(prev => prev + 1);
          setTotalGoalsCompleted(prev => prev + 1);
        } else if (!newCompleted && wasCompleted) {
          setCompletedGoalsToday(prev => Math.max(0, prev - 1));
          setTotalGoalsCompleted(prev => Math.max(0, prev - 1));
        }
        
        // Add activity for completion
        if (newCompleted) {
          const activityData = {
            ...createActivityImpact.healthActivity(),
            categoryId: 'health',
            title: `Completed: ${goal.title}`,
            impact: { health: goal.importance === 'high' ? 3 : goal.importance === 'medium' ? 2 : 1 }
          };
          addActivity(activityData);
          
          // Show encouraging message
          Alert.alert(
            '🎉 Goal Completed!',
            `Great job completing "${goal.title}"! Every small step counts towards a healthier you.`,
            [{ text: 'Keep Going!', style: 'default' }]
          );
        }
        
        return {
          ...goal,
          completed: newCompleted,
          completedAt: newCompleted ? new Date().toISOString() : undefined,
          streak: newCompleted ? goal.streak + 1 : Math.max(0, goal.streak - 1)
        };
      }
      return goal;
    }));
  };

  // Initialize pedometer for real step tracking
  const initializePedometer = React.useCallback(async () => {
    console.log('Initializing pedometer...');
    
    if (Platform.OS === 'web') {
      console.log('Pedometer not available on web, using simulated steps');
      // Fallback to simulated steps for web
      const updateSteps = () => {
        setHealthMetrics(prev => prev.map(metric => {
          if (metric.id === 'steps') {
            const increment = Math.floor(Math.random() * 50) + 10;
            return { ...metric, value: Math.min(metric.target, metric.value + increment) };
          }
          return metric;
        }));
      };
      const interval = setInterval(updateSteps, 30000);
      return () => clearInterval(interval);
    }
    
    try {
      const isAvailable = await Pedometer.isAvailableAsync();
      console.log('Pedometer available:', isAvailable);
      setIsPedometerAvailable(isAvailable);
      
      if (isAvailable) {
        // Get today's steps from midnight
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        const end = new Date();
        
        console.log('Getting step count from', start, 'to', end);
        
        try {
          const pastStepCountResult = await Pedometer.getStepCountAsync(start, end);
          console.log('Past step count:', pastStepCountResult.steps);
          setPastStepCount(pastStepCountResult.steps);
          
          // Update the steps metric with real data
          setHealthMetrics(prev => prev.map(metric => {
            if (metric.id === 'steps') {
              return { ...metric, value: pastStepCountResult.steps };
            }
            return metric;
          }));
        } catch (error) {
          console.error('Error getting past step count:', error);
        }
        
        // Subscribe to real-time step updates
        const subscription = Pedometer.watchStepCount(result => {
          console.log('Step count update:', result.steps);
          const totalSteps = pastStepCount + result.steps;
          
          setHealthMetrics(prev => prev.map(metric => {
            if (metric.id === 'steps') {
              return { ...metric, value: totalSteps };
            }
            return metric;
          }));
        });
        
        return () => {
          console.log('Unsubscribing from pedometer');
          subscription && subscription.remove();
        };
      } else {
        console.log('Pedometer not available, using simulated steps');
        // Fallback to simulated steps
        const updateSteps = () => {
          setHealthMetrics(prev => prev.map(metric => {
            if (metric.id === 'steps') {
              const increment = Math.floor(Math.random() * 50) + 10;
              return { ...metric, value: Math.min(metric.target, metric.value + increment) };
            }
            return metric;
          }));
        };
        const interval = setInterval(updateSteps, 30000);
        return () => clearInterval(interval);
      }
    } catch (error) {
      console.error('Error initializing pedometer:', error);
      setIsPedometerAvailable(false);
      
      // Fallback to simulated steps
      const updateSteps = () => {
        setHealthMetrics(prev => prev.map(metric => {
          if (metric.id === 'steps') {
            const increment = Math.floor(Math.random() * 50) + 10;
            return { ...metric, value: Math.min(metric.target, metric.value + increment) };
          }
          return metric;
        }));
      };
      const interval = setInterval(updateSteps, 30000);
      return () => clearInterval(interval);
    }
  }, [pastStepCount]);
  
  // Real step tracking effect
  useEffect(() => {
    let cleanup: (() => void) | undefined;
    
    const setupPedometer = async () => {
      cleanup = await initializePedometer();
    };
    
    setupPedometer();
    
    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, [initializePedometer]);
  


  const openMetricModal = (metric: HealthMetric) => {
    if (metric.actionable) {
      setSelectedMetric(metric);
      setModalVisible(true);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedMetric(null);
  };





  const openGoalEditModal = (goal: HealthGoal) => {
    setEditingGoal(goal.id);
    setEditGoalTitle(goal.title);
    setEditGoalDescription(goal.description);
    setGoalEditModalVisible(true);
  };

  const saveGoalEdit = () => {
    if (!editingGoal) return;
    
    setHealthGoals(prev => prev.map(goal => {
      if (goal.id === editingGoal) {
        return {
          ...goal,
          title: editGoalTitle.trim() || goal.title,
          description: editGoalDescription.trim() || goal.description
        };
      }
      return goal;
    }));
    
    setGoalEditModalVisible(false);
    setEditingGoal(null);
    setEditGoalTitle('');
    setEditGoalDescription('');
  };

  const deleteGoal = (goalId: string) => {
    Alert.alert(
      'Delete Goal',
      'Are you sure you want to delete this goal?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setHealthGoals(prev => prev.filter(goal => goal.id !== goalId));
          }
        }
      ]
    );
  };

  const addNewGoal = () => {
    const newGoal: HealthGoal = {
      id: `custom_${Date.now()}`,
      title: 'New Health Goal',
      description: 'Tap edit to customize this goal',
      category: 'movement',
      icon: Target,
      color: '#3498DB',
      completed: false,
      streak: 0,
      importance: 'medium',
      timeOfDay: 'anytime'
    };
    
    setHealthGoals(prev => [...prev, newGoal]);
    openGoalEditModal(newGoal);
  };
  
  const getCategoryColor = (category: string): string => {
    const colors: { [key: string]: string } = {
      wellness: '#27AE60',
      mindset: '#6C5CE7',
      happiness: '#FFD93D',
      motivation: '#FF6B6B',
      holistic: '#4ECDC4',
      exercise: '#E67E22',
      wealth: '#F39C12',
      balance: '#9B59B6',
      duty: '#34495E',
      renewal: '#1ABC9C'
    };
    return colors[category] || '#95A5A6';
  };
  
  const renderMetricCard = (metric: HealthMetric, index: number) => {
    const IconComponent = metric.icon;
    const progress = Math.round((metric.value / metric.target) * 100);
    const progressWidth = (width - 72) * (progress / 100);
    const isCompleted = metric.value >= metric.target;
    
    return (
      <TouchableOpacity 
        key={index} 
        style={[
          styles.metricCard,
          isCompleted && styles.metricCardCompleted
        ]}
        onPress={() => openMetricModal(metric)}
        activeOpacity={metric.actionable ? 0.8 : 1}
      >
        <View style={styles.metricHeader}>
          <View style={[styles.metricIcon, { backgroundColor: metric.color + '20' }]}>
            {React.createElement(IconComponent, { size: 20, color: metric.color })}
            {isCompleted && (
              <View style={styles.completedBadge}>
                <CheckCircle size={12} color="#27AE60" />
              </View>
            )}
          </View>
          <View style={styles.metricInfo}>
            <Text style={styles.metricLabel}>{metric.label}</Text>
            <Text style={styles.metricValue}>
              {metric.value.toLocaleString()} {metric.unit}
              {metric.id === 'steps' && Platform.OS !== 'web' && (
                <Text style={styles.stepTrackingIndicator}>
                  {isPedometerAvailable ? ' 📱' : ' 🔄'}
                </Text>
              )}
            </Text>
            <Text style={styles.metricTarget}>Goal: {metric.target.toLocaleString()} {metric.unit}</Text>
          </View>
          <View style={styles.metricProgressContainer}>
            <Text style={[styles.metricProgress, isCompleted && styles.metricProgressCompleted]}>
              {progress}%
            </Text>
            {metric.actionable && (
              <TouchableOpacity style={styles.metricAddButton}>
                <Plus size={16} color={metric.color} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <View 
              style={[
                styles.progressBarFill, 
                { width: progressWidth, backgroundColor: metric.color },
                isCompleted && styles.progressBarCompleted
              ]} 
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };





  return (
    <>
      <Stack.Screen 
        options={{ 
          title: "Health & Fitness",
          headerStyle: { backgroundColor: '#FF6B6B' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' }
        }} 
      />
      
      <View style={styles.backgroundContainer}>
        <LinearGradient
          colors={['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe']}
          style={styles.backgroundGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.backgroundOverlay}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Stats */}
        <View style={styles.headerCard}>
          <LinearGradient
            colors={['#FF6B6B', '#FF8E8E']}
            style={styles.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.headerContent}>
              <Heart size={32} color="white" />
              <Text style={styles.headerTitle}>Health</Text>
              <Text style={styles.headerScore}>{healthScore}/100</Text>
              <Text style={styles.headerSubtitle}>
                {completedGoalsToday > 0 ? `${completedGoalsToday} goals completed today!` : 'Start your healthy day!'}
              </Text>
              
              <TouchableOpacity 
                style={styles.aiChatButton}
                onPress={() => router.push('/health-chat')}
                activeOpacity={0.8}
              >
                <MessageCircle size={20} color="white" />
                <Text style={styles.aiChatButtonText}>AI Coach</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/* Daily Streak & Stats */}
        <View style={styles.section}>
          <View style={styles.statsRow}>
            <View style={styles.streakCard}>
              <Text style={styles.streakDays}>{dailyStreak}</Text>
              <Text style={styles.streakTitle}>Day Streak</Text>
            </View>
            
            <View style={styles.statCard}>
              <TrendingUp size={20} color="#27AE60" />
              <Text style={styles.statValue}>{Math.round((completedGoalsToday / healthGoals.length) * 100)}%</Text>
              <Text style={styles.statLabel}>Goals Today</Text>
            </View>
          </View>
        </View>

        {/* Daily Health Goals */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Today&apos;s Health Goals</Text>
              <Text style={styles.sectionSubtitle}>
                Complete {Math.ceil(healthGoals.length * 0.6)} goals to maintain your streak
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={addNewGoal}
              activeOpacity={0.7}
            >
              <Plus size={20} color="#3498DB" />
            </TouchableOpacity>
          </View>
          
          {healthGoals.map((goal, index) => {
            const IconComponent = goal.icon;
            const isCompleted = goal.completed;
            
            return (
              <View 
                key={index}
                style={[
                  styles.goalCard,
                  isCompleted && styles.goalCardCompleted
                ]}
              >
                <TouchableOpacity 
                  style={styles.goalHeader}
                  onPress={() => toggleGoalCompletion(goal.id)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.goalIcon, { backgroundColor: goal.color + '20' }]}>
                    {React.createElement(IconComponent, { size: 24, color: goal.color })}
                  </View>
                  
                  <View style={styles.goalInfo}>
                    <Text style={[styles.goalTitle, isCompleted && styles.goalTitleCompleted]}>
                      {goal.title}
                    </Text>
                    <Text style={[styles.goalDescription, isCompleted && styles.goalDescriptionCompleted]}>
                      {goal.description}
                    </Text>
                    
                    <View style={styles.goalMeta}>
                      <View style={[styles.importanceBadge, { backgroundColor: 
                        goal.importance === 'high' ? '#E74C3C' : 
                        goal.importance === 'medium' ? '#F39C12' : '#95A5A6'
                      }]}>
                        <Text style={styles.importanceBadgeText}>
                          {goal.importance.toUpperCase()}
                        </Text>
                      </View>
                      
                      {goal.timeOfDay !== 'anytime' && (
                        <View style={styles.timeBadge}>
                          <Text style={styles.timeBadgeText}>
                            {goal.timeOfDay?.toUpperCase()}
                          </Text>
                        </View>
                      )}
                      
                      {goal.streak > 0 && (
                        <View style={styles.streakBadge}>
                          <Text style={styles.streakBadgeText}>
                            🔥 {goal.streak}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                  
                  <TouchableOpacity 
                    style={[
                      styles.goalCheckbox,
                      isCompleted && styles.goalCheckboxCompleted
                    ]}
                    onPress={() => toggleGoalCompletion(goal.id)}
                  >
                    {isCompleted ? (
                      <CheckCircle size={28} color="#27AE60" />
                    ) : (
                      <View style={styles.goalCheckboxEmpty} />
                    )}
                  </TouchableOpacity>
                </TouchableOpacity>
                
                <View style={styles.goalActions}>
                  <TouchableOpacity 
                    style={styles.goalActionButton}
                    onPress={() => openGoalEditModal(goal)}
                    activeOpacity={0.7}
                  >
                    <Edit3 size={16} color="#3498DB" />
                  </TouchableOpacity>
                  
                  {goal.id.startsWith('custom_') && (
                    <TouchableOpacity 
                      style={styles.goalActionButton}
                      onPress={() => deleteGoal(goal.id)}
                      activeOpacity={0.7}
                    >
                      <Trash2 size={16} color="#E74C3C" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* Progress Summary */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderSimple}>
            <Text style={styles.sectionTitle}>Today&apos;s Progress</Text>
          </View>
          <View style={styles.progressSummaryCard}>
            <View style={styles.progressSummaryHeader}>
              <Text style={styles.progressSummaryTitle}>Goals Completed</Text>
              <Text style={styles.progressSummaryValue}>
                {completedGoalsToday}/{healthGoals.length}
              </Text>
            </View>
            
            <View style={styles.progressSummaryBar}>
              <View 
                style={[
                  styles.progressSummaryFill,
                  { width: `${(completedGoalsToday / healthGoals.length) * 100}%` }
                ]}
              />
            </View>
            
            <View style={styles.progressStats}>
              <View style={styles.progressStat}>
                <Text style={styles.progressStatValue}>{totalGoalsCompleted}</Text>
                <Text style={styles.progressStatLabel}>Total Completed</Text>
              </View>
              
              <View style={styles.progressStat}>
                <Text style={styles.progressStatValue}>{dailyStreak}</Text>
                <Text style={styles.progressStatLabel}>Day Streak</Text>
              </View>
              
              <View style={styles.progressStat}>
                <Text style={styles.progressStatValue}>
                  {Math.round((completedGoalsToday / healthGoals.length) * 100)}%
                </Text>
                <Text style={styles.progressStatLabel}>Today</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Today's Metrics */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderSimple}>
            <Text style={styles.sectionTitle}>Health Metrics</Text>
          </View>
          {healthMetrics.map(renderMetricCard)}
        </View>

        {/* Daily Achievement Report */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderSimple}>
            <Text style={styles.sectionTitle}>Daily Achievement Report</Text>
          </View>
          <View style={styles.achievementReportCard}>
            <View style={styles.achievementHeader}>
              <View style={styles.achievementIconContainer}>
                <BarChart3 size={24} color="#27AE60" />
              </View>
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementTitle}>Today&apos;s Performance</Text>
                <Text style={styles.achievementSubtitle}>
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </Text>
              </View>
              <View style={styles.achievementScore}>
                <Text style={styles.achievementScoreValue}>
                  {Math.round((completedGoalsToday / healthGoals.length) * 100)}%
                </Text>
                <Text style={styles.achievementScoreLabel}>Complete</Text>
              </View>
            </View>
            
            <View style={styles.achievementStats}>
              <View style={styles.achievementStatItem}>
                <View style={[styles.achievementStatIcon, { backgroundColor: '#27AE60' + '20' }]}>
                  <CheckCircle size={16} color="#27AE60" />
                </View>
                <Text style={styles.achievementStatValue}>{completedGoalsToday}</Text>
                <Text style={styles.achievementStatLabel}>Goals Completed</Text>
              </View>
              
              <View style={styles.achievementStatItem}>
                <View style={[styles.achievementStatIcon, { backgroundColor: '#FF6B6B' + '20' }]}>
                  <Target size={16} color="#FF6B6B" />
                </View>
                <Text style={styles.achievementStatValue}>{healthGoals.length - completedGoalsToday}</Text>
                <Text style={styles.achievementStatLabel}>Goals Remaining</Text>
              </View>
              
              <View style={styles.achievementStatItem}>
                <View style={[styles.achievementStatIcon, { backgroundColor: '#FFD93D' + '20' }]}>
                  <TrendingUp size={16} color="#FFD93D" />
                </View>
                <Text style={styles.achievementStatValue}>{dailyStreak}</Text>
                <Text style={styles.achievementStatLabel}>Day Streak</Text>
              </View>
            </View>
            
            <View style={styles.achievementProgress}>
              <View style={styles.achievementProgressHeader}>
                <Text style={styles.achievementProgressTitle}>Goal Categories</Text>
                <Text style={styles.achievementProgressSubtitle}>
                  {completedGoalsToday}/{healthGoals.length} completed
                </Text>
              </View>
              
              <View style={styles.categoryProgressList}>
                {['movement', 'nutrition', 'mindfulness', 'sleep', 'hydration'].map((category) => {
                  const categoryGoals = healthGoals.filter(goal => goal.category === category);
                  const completedCategoryGoals = categoryGoals.filter(goal => goal.completed);
                  const categoryProgress = categoryGoals.length > 0 ? (completedCategoryGoals.length / categoryGoals.length) * 100 : 0;
                  
                  if (categoryGoals.length === 0) return null;
                  
                  const categoryColors: { [key: string]: string } = {
                    movement: '#FF6B6B',
                    nutrition: '#27AE60',
                    mindfulness: '#FFD93D',
                    sleep: '#6C5CE7',
                    hydration: '#4ECDC4'
                  };
                  
                  return (
                    <View key={category} style={styles.categoryProgressItem}>
                      <View style={styles.categoryProgressInfo}>
                        <Text style={styles.categoryProgressName}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </Text>
                        <Text style={styles.categoryProgressValue}>
                          {completedCategoryGoals.length}/{categoryGoals.length}
                        </Text>
                      </View>
                      <View style={styles.categoryProgressBarContainer}>
                        <View style={styles.categoryProgressBar}>
                          <View 
                            style={[
                              styles.categoryProgressBarFill,
                              { 
                                width: `${categoryProgress}%`,
                                backgroundColor: categoryColors[category] || '#95A5A6'
                              }
                            ]}
                          />
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
            
            {completedGoalsToday === healthGoals.length && (
              <View style={styles.perfectDayBanner}>
                <Text style={styles.perfectDayText}>🎉 Perfect Day! All goals completed!</Text>
              </View>
            )}
          </View>
        </View>



        {/* Inspirational Health Quotes */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderSimple}>
            <Text style={styles.sectionTitle}>Daily Inspiration</Text>
          </View>
          <View style={styles.quoteCard}>
            <View style={styles.quoteHeader}>
              <View style={styles.quoteIconContainer}>
                <Quote size={24} color="#6C5CE7" />
              </View>
              <View style={styles.quoteIndicator}>
                <Sparkles size={16} color="#FFD93D" />
              </View>
            </View>
            
            <Text style={styles.quoteText}>
              &ldquo;{healthQuotes[currentQuoteIndex].quote}&rdquo;
            </Text>
            
            <View style={styles.quoteFooter}>
              <Text style={styles.quoteAuthor}>
                — {healthQuotes[currentQuoteIndex].author}
              </Text>
              <View style={[styles.quoteCategoryBadge, { backgroundColor: getCategoryColor(healthQuotes[currentQuoteIndex].category) + '20' }]}>
                <Text style={[styles.quoteCategoryText, { color: getCategoryColor(healthQuotes[currentQuoteIndex].category) }]}>
                  {healthQuotes[currentQuoteIndex].category.toUpperCase()}
                </Text>
              </View>
            </View>
            
            <View style={styles.quoteProgress}>
              <View style={styles.quoteProgressBar}>
                <View 
                  style={[
                    styles.quoteProgressFill,
                    { width: `${((currentQuoteIndex + 1) / healthQuotes.length) * 100}%` }
                  ]}
                />
              </View>
              <Text style={styles.quoteProgressText}>
                {currentQuoteIndex + 1} of {healthQuotes.length}
              </Text>
            </View>
          </View>
        </View>

        {/* Personalized Health Tips */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderSimple}>
            <Text style={styles.sectionTitle}>Personalized Health Tips</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tipsScrollView}>
            {personalizedTips.map((tip, index) => {
              const IconComponent = tip.icon;
              return (
                <View key={index} style={styles.tipCard}>
                  <View style={[styles.tipIcon, { backgroundColor: tip.color + '20' }]}>
                    {React.createElement(IconComponent, { size: 24, color: tip.color })}
                  </View>
                  <Text style={styles.tipTitle}>{tip.title}</Text>
                  <Text style={styles.tipDescription}>{tip.description}</Text>
                </View>
              );
            })}
          </ScrollView>
        </View>



        {/* Health Tools Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderSimple}>
            <Text style={styles.sectionTitle}>Health Tools</Text>
          </View>
          <View style={styles.fitnessGrid}>
            <TouchableOpacity 
              style={styles.fitnessCard}
              onPress={() => router.push('/fitness-history')}
            >
              <BarChart3 size={24} color="#FF6B6B" />
              <Text style={styles.fitnessCardTitle}>Activity History</Text>
              <Text style={styles.fitnessCardDescription}>Track your progress</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.fitnessCard}
              onPress={async () => {
                router.push('/profile-setup');
                // Refresh tips when returning from profile setup
                setTimeout(async () => {
                  const tips = await generatePersonalizedHealthTips();
                  setPersonalizedTips(tips);
                }, 1000);
              }}
            >
              <User size={24} color="#4ECDC4" />
              <Text style={styles.fitnessCardTitle}>Health Profile</Text>
              <Text style={styles.fitnessCardDescription}>Get personalized tips</Text>
            </TouchableOpacity>
          </View>
        </View>
            </ScrollView>
          </View>
        </LinearGradient>
      </View>

      {/* Metric Update Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedMetric && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedMetric.label}</Text>
                  <TouchableOpacity onPress={closeModal} style={styles.modalCloseButton}>
                    <X size={24} color="#7F8C8D" />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.modalBody}>
                  <View style={[styles.modalIcon, { backgroundColor: selectedMetric.color + '20' }]}>
                    {(() => {
                      const IconComponent = selectedMetric.icon;
                      return React.createElement(IconComponent, { size: 32, color: selectedMetric.color });
                    })()}
                  </View>
                  
                  <Text style={styles.modalDescription}>
                    Current: {selectedMetric.value} {selectedMetric.unit}
                  </Text>
                  <Text style={styles.modalDescription}>
                    Goal: {selectedMetric.target} {selectedMetric.unit}
                  </Text>
                  
                  <View style={styles.modalActions}>
                    <TouchableOpacity 
                      style={[styles.modalActionButton, { backgroundColor: '#95A5A6' }]}
                      onPress={closeModal}
                    >
                      <X size={20} color="white" />
                      <Text style={styles.modalActionText}>Close</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Goal Edit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={goalEditModalVisible}
        onRequestClose={() => setGoalEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Goal</Text>
              <TouchableOpacity 
                onPress={() => setGoalEditModalVisible(false)} 
                style={styles.modalCloseButton}
              >
                <X size={24} color="#7F8C8D" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Goal Title</Text>
                <TextInput
                  style={styles.textInput}
                  value={editGoalTitle}
                  onChangeText={setEditGoalTitle}
                  placeholder="Enter goal title"
                  placeholderTextColor="#95A5A6"
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Description</Text>
                <TextInput
                  style={[styles.textInput, styles.textInputMultiline]}
                  value={editGoalDescription}
                  onChangeText={setEditGoalDescription}
                  placeholder="Enter goal description"
                  placeholderTextColor="#95A5A6"
                  multiline
                  numberOfLines={3}
                />
              </View>
              
              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={[styles.modalActionButton, { backgroundColor: '#95A5A6' }]}
                  onPress={() => setGoalEditModalVisible(false)}
                >
                  <X size={20} color="white" />
                  <Text style={styles.modalActionText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.modalActionButton, { backgroundColor: '#27AE60' }]}
                  onPress={saveGoalEdit}
                >
                  <Save size={20} color="white" />
                  <Text style={styles.modalActionText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
  },
  backgroundOverlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  headerCard: {
    margin: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  headerGradient: {
    padding: 24,
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
  },
  headerScore: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 8,
  },
  headerSubtitle: {
    color: 'white',
    fontSize: 14,
    opacity: 0.9,
    marginTop: 4,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  metricCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginHorizontal: 24,
    marginBottom: 12,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  metricIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  metricInfo: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 2,
  },
  metricTarget: {
    fontSize: 12,
    color: '#95A5A6',
  },
  metricProgress: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  progressBarContainer: {
    marginTop: 8,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#E9ECEF',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },

  playButton: {
    alignSelf: 'flex-end',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  programCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginHorizontal: 24,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  programHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  programTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  programDescription: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 20,
    marginBottom: 8,
    maxWidth: width - 140,
  },
  programDuration: {
    fontSize: 12,
    color: '#95A5A6',
  },
  continueButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  insightCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginLeft: 12,
  },
  insightText: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 20,
    marginBottom: 20,
  },
  insightStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  insightStat: {
    alignItems: 'center',
  },
  insightStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  insightStatLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 4,
    textAlign: 'center',
  },
  aiChatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 16,
  },
  aiChatButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  programInfo: {
    flex: 1,
  },
  programIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  programTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  newBadge: {
    backgroundColor: '#E74C3C',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  newBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  // New styles for enhanced functionality
  metricCardCompleted: {
    borderColor: '#27AE60',
    borderWidth: 2,
  },
  completedBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  metricProgressContainer: {
    alignItems: 'center',
  },
  metricProgressCompleted: {
    color: '#27AE60',
  },
  metricAddButton: {
    marginTop: 4,
    padding: 4,
  },
  progressBarCompleted: {
    backgroundColor: '#27AE60',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 8,
  },
  streakCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  streakTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7F8C8D',
  },
  streakDays: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 4,
  },
  streakSubtitle: {
    color: 'white',
    fontSize: 12,
    opacity: 0.9,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    minWidth: 80,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7F8C8D',
    marginTop: 2,
  },

  weeklyGoalsContainer: {
    paddingHorizontal: 24,
  },
  weeklyGoalCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  weeklyGoalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  weeklyGoalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  weeklyGoalProgress: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 8,
  },
  weeklyProgressBar: {
    height: 4,
    backgroundColor: '#E9ECEF',
    borderRadius: 2,
    overflow: 'hidden',
  },
  weeklyProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    flex: 1,
  },
  modalCloseButton: {
    padding: 4,
  },
  modalBody: {
    alignItems: 'center',
    marginBottom: 24,
  },
  modalIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalDescription: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  durationText: {
    fontSize: 14,
    color: '#7F8C8D',
    marginLeft: 8,
    fontWeight: '500',
  },
  modalActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginTop: 20,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7F8C8D',
  },
  modalConfirmButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
  },
  modalConfirmText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  modalActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    minWidth: 100,
    justifyContent: 'center',
  },
  modalActionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  tipsScrollView: {
    paddingLeft: 24,
  },
  tipCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 20,
    marginRight: 16,
    width: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tipIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  tipDescription: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 20,
  },
  stepTrackingIndicator: {
    fontSize: 12,
    opacity: 0.7,
  },
  fitnessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  fitnessCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  fitnessCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginTop: 8,
    textAlign: 'center',
  },
  fitnessCardDescription: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 4,
    textAlign: 'center',
  },
  
  // Goal-focused styles
  goalCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginHorizontal: 24,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  goalCardCompleted: {
    borderColor: '#27AE60',
    backgroundColor: 'rgba(39, 174, 96, 0.05)',
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  goalIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  goalInfo: {
    flex: 1,
    marginRight: 16,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  goalTitleCompleted: {
    color: '#27AE60',
    textDecorationLine: 'line-through',
  },
  goalDescription: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 20,
    marginBottom: 12,
  },
  goalDescriptionCompleted: {
    color: '#95A5A6',
  },
  goalMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  importanceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  importanceBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  timeBadge: {
    backgroundColor: '#E9ECEF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  timeBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6C757D',
  },
  streakBadge: {
    backgroundColor: '#FFF3CD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  streakBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#856404',
  },
  goalCheckbox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalCheckboxCompleted: {
    backgroundColor: 'rgba(39, 174, 96, 0.1)',
  },
  goalCheckboxEmpty: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#BDC3C7',
  },
  
  // Progress summary styles
  progressSummaryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  progressSummaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressSummaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  progressSummaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#27AE60',
  },
  progressSummaryBar: {
    height: 8,
    backgroundColor: '#E9ECEF',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 20,
  },
  progressSummaryFill: {
    height: '100%',
    backgroundColor: '#27AE60',
    borderRadius: 4,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  progressStat: {
    alignItems: 'center',
  },
  progressStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  progressStatLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 4,
  },
  
  // Goal editing styles
  goalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
    gap: 12,
  },
  goalActionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
  },
  
  // Input styles for goal editing
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2C3E50',
    backgroundColor: '#F8F9FA',
  },
  textInputMultiline: {
    height: 80,
    textAlignVertical: 'top',
  },
  
  sectionHeaderSimple: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  
  // Achievement Report Styles
  achievementReportCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  achievementIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#27AE60' + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 2,
  },
  achievementSubtitle: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  achievementScore: {
    alignItems: 'center',
  },
  achievementScoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#27AE60',
  },
  achievementScoreLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 2,
  },
  achievementStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E9ECEF',
  },
  achievementStatItem: {
    alignItems: 'center',
  },
  achievementStatIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  achievementStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 2,
  },
  achievementStatLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    textAlign: 'center',
  },
  achievementProgress: {
    marginTop: 8,
  },
  achievementProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  achievementProgressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  achievementProgressSubtitle: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  categoryProgressList: {
    gap: 12,
  },
  categoryProgressItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryProgressInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryProgressName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2C3E50',
  },
  categoryProgressValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7F8C8D',
  },
  categoryProgressBarContainer: {
    flex: 2,
  },
  categoryProgressBar: {
    height: 6,
    backgroundColor: '#E9ECEF',
    borderRadius: 3,
    overflow: 'hidden',
  },
  categoryProgressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  perfectDayBanner: {
    backgroundColor: '#27AE60' + '20',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    alignItems: 'center',
  },
  perfectDayText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#27AE60',
    textAlign: 'center',
  },
  
  // Quote Card Styles
  quoteCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginHorizontal: 24,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(108, 92, 231, 0.1)',
  },
  quoteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  quoteIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#6C5CE7' + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quoteIndicator: {
    padding: 8,
  },
  quoteText: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#2C3E50',
    lineHeight: 26,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500',
  },
  quoteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  quoteAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7F8C8D',
    fontStyle: 'italic',
  },
  quoteCategoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  quoteCategoryText: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  quoteProgress: {
    alignItems: 'center',
  },
  quoteProgressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#E9ECEF',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  quoteProgressFill: {
    height: '100%',
    backgroundColor: '#6C5CE7',
    borderRadius: 2,
  },
  quoteProgressText: {
    fontSize: 12,
    color: '#95A5A6',
    fontWeight: '500',
  },
});