import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, TouchableOpacity, Alert } from 'react-native';
import { 
  Dumbbell,
  Heart,
  Target,
  TrendingUp,
  ArrowRight,
  Play,
  Clock,
  Flame,
  Award,
  CheckCircle
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useCategories, createActivityImpact } from '@/contexts/CategoryContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CategoryScreenLayout from '@/components/CategoryScreenLayout';
import { sharedStyles, colors, gradients } from '@/constants/styles';

interface WorkoutSession {
  id: string;
  name: string;
  duration: number;
  exercises: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  type: 'strength' | 'cardio' | 'flexibility' | 'sports';
  calories: number;
  completed?: boolean;
}

interface FitnessOption {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  route?: string;
}

const quickWorkouts: WorkoutSession[] = [
  {
    id: 'morning-energy',
    name: '10-Min Morning Energy',
    duration: 10,
    exercises: ['Jumping Jacks', 'Push-ups', 'Squats', 'Plank'],
    difficulty: 'Beginner',
    type: 'cardio',
    calories: 80
  },
  {
    id: 'strength-basics',
    name: '15-Min Strength Basics',
    duration: 15,
    exercises: ['Push-ups', 'Squats', 'Lunges', 'Plank', 'Burpees'],
    difficulty: 'Intermediate',
    type: 'strength',
    calories: 120
  },
  {
    id: 'cardio-blast',
    name: '20-Min Cardio Blast',
    duration: 20,
    exercises: ['High Knees', 'Mountain Climbers', 'Burpees', 'Jump Squats'],
    difficulty: 'Advanced',
    type: 'cardio',
    calories: 200
  },
  {
    id: 'flexibility-flow',
    name: '12-Min Flexibility Flow',
    duration: 12,
    exercises: ['Cat-Cow', 'Downward Dog', 'Pigeon Pose', 'Child\'s Pose'],
    difficulty: 'Beginner',
    type: 'flexibility',
    calories: 60
  }
];

const fitnessOptions: FitnessOption[] = [
  {
    id: 'strength',
    title: 'Strength Training',
    description: 'Build muscle and increase power',
    icon: Dumbbell,
    color: colors.fitness
  },
  {
    id: 'cardio',
    title: 'Cardio & Endurance',
    description: 'Improve cardiovascular health',
    icon: Heart,
    color: colors.health
  },
  {
    id: 'sports',
    title: 'Sports Training',
    description: 'Sport-specific performance',
    icon: Target,
    color: colors.info
  },
  {
    id: 'progress',
    title: 'Track Progress',
    description: 'Monitor your fitness journey',
    icon: TrendingUp,
    color: colors.learning,
    route: '/fitness-history'
  }
];

export default function FitnessScreen() {
  const { addActivity } = useCategories();
  const [completedWorkouts, setCompletedWorkouts] = useState<string[]>([]);
  const [weeklyStats, setWeeklyStats] = useState({ workouts: 0, calories: 0, minutes: 0 });

  useEffect(() => {
    loadFitnessData();
  }, []);

  const loadFitnessData = async () => {
    try {
      const completed = await AsyncStorage.getItem('completedWorkouts');
      const stats = await AsyncStorage.getItem('weeklyFitnessStats');
      
      if (completed) {
        setCompletedWorkouts(JSON.parse(completed));
      }
      
      if (stats) {
        setWeeklyStats(JSON.parse(stats));
      }
    } catch (error) {
      console.error('Error loading fitness data:', error);
    }
  };

  const saveFitnessData = useCallback(async () => {
    try {
      await AsyncStorage.setItem('completedWorkouts', JSON.stringify(completedWorkouts));
      await AsyncStorage.setItem('weeklyFitnessStats', JSON.stringify(weeklyStats));
    } catch (error) {
      console.error('Error saving fitness data:', error);
    }
  }, [completedWorkouts, weeklyStats]);

  useEffect(() => {
    saveFitnessData();
  }, [completedWorkouts, weeklyStats, saveFitnessData]);

  const startWorkout = (workout: WorkoutSession) => {
    Alert.alert(
      `Start ${workout.name}?`,
      `Duration: ${workout.duration} min\nCalories: ~${workout.calories}\nDifficulty: ${workout.difficulty}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start Workout',
          onPress: () => {
            setTimeout(() => {
              completeWorkout(workout);
            }, 2000);
            
            Alert.alert('Workout Started!', 'Great job! Keep pushing yourself!');
          }
        }
      ]
    );
  };

  const completeWorkout = (workout: WorkoutSession) => {
    setCompletedWorkouts(prev => [...prev, workout.id]);
    
    setWeeklyStats(prev => ({
      workouts: prev.workouts + 1,
      calories: prev.calories + workout.calories,
      minutes: prev.minutes + workout.duration
    }));
    
    const intensity = workout.difficulty === 'Beginner' ? 'light' : 
                     workout.difficulty === 'Advanced' ? 'intense' : 'moderate';
    
    const activityData = {
      ...createActivityImpact.exercise(intensity),
      categoryId: 'fitness',
      title: `Completed ${workout.name}`,
      value: workout.duration
    };
    
    addActivity(activityData);
    
    Alert.alert(
      'Workout Complete! 🎉',
      `Amazing work! You burned ~${workout.calories} calories in ${workout.duration} minutes.`,
      [{ text: 'Great!', style: 'default' }]
    );
  };

  const renderWorkout = (workout: WorkoutSession) => {
    const isCompleted = completedWorkouts.includes(workout.id);
    const difficultyColor = workout.difficulty === 'Beginner' ? colors.success :
                           workout.difficulty === 'Advanced' ? colors.error : colors.warning;
    
    return (
      <TouchableOpacity
        key={workout.id}
        style={[sharedStyles.card, isCompleted && { backgroundColor: '#F0F9F0', borderColor: colors.success, borderWidth: 1 }]}
        onPress={() => startWorkout(workout)}
        activeOpacity={0.7}
      >
        <View style={[sharedStyles.flexRow, sharedStyles.spaceBetween, { alignItems: 'center' }]}>
          <View style={sharedStyles.flex1}>
            <Text style={sharedStyles.listItemTitle}>{workout.name}</Text>
            <View style={[sharedStyles.flexRow, { alignItems: 'center', marginVertical: 8 }]}>
              <View style={[sharedStyles.flexRow, { alignItems: 'center', marginRight: 16 }]}>
                <Clock size={14} color={colors.textSecondary} />
                <Text style={[sharedStyles.caption, { marginLeft: 4 }]}>{workout.duration} min</Text>
              </View>
              <View style={[sharedStyles.flexRow, { alignItems: 'center', marginRight: 16 }]}>
                <Flame size={14} color={colors.error} />
                <Text style={[sharedStyles.caption, { marginLeft: 4 }]}>{workout.calories} cal</Text>
              </View>
              <View style={[sharedStyles.smallCard, { backgroundColor: difficultyColor, paddingHorizontal: 8, paddingVertical: 2 }]}>
                <Text style={[sharedStyles.caption, { color: 'white', fontWeight: '600' }]}>{workout.difficulty}</Text>
              </View>
            </View>
            <Text style={sharedStyles.bodyText}>
              {workout.exercises.slice(0, 3).join(' • ')}
              {workout.exercises.length > 3 && ' ...'}
            </Text>
          </View>
          
          <View style={{ marginLeft: 16 }}>
            {isCompleted ? (
              <CheckCircle size={24} color={colors.success} />
            ) : (
              <View style={[sharedStyles.iconContainer, { 
                backgroundColor: workout.type === 'cardio' ? colors.health : colors.info,
                width: 44,
                height: 44,
                borderRadius: 22,
                marginBottom: 0
              }]}>
                <Play size={20} color="white" />
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderOption = (option: FitnessOption) => {
    const IconComponent = option.icon;
    
    return (
      <TouchableOpacity
        key={option.id}
        style={sharedStyles.card}
        onPress={() => option.route && router.push(option.route as any)}
        activeOpacity={0.7}
      >
        <View style={[sharedStyles.flexRow, { alignItems: 'center' }]}>
          <View style={[sharedStyles.iconContainer, { backgroundColor: option.color + '15', marginBottom: 0, marginRight: 16 }]}>
            <IconComponent size={28} color={option.color} />
          </View>
          <View style={sharedStyles.flex1}>
            <Text style={sharedStyles.listItemTitle}>{option.title}</Text>
            <Text style={sharedStyles.bodyText}>{option.description}</Text>
          </View>
          <ArrowRight size={20} color={colors.textLight} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <CategoryScreenLayout
      categoryId="fitness"
      title="Fitness"
      headerColor={colors.fitness}
      headerGradient={gradients.fitness}
      icon={Dumbbell}
      chatRoute="/fitness-chat"
    >
      {/* Weekly Stats */}
      <View style={sharedStyles.section}>
        <Text style={sharedStyles.sectionTitle}>This Week</Text>
        <View style={sharedStyles.statsRow}>
          <View style={sharedStyles.statCard}>
            <Award size={20} color={colors.fitness} />
            <Text style={sharedStyles.statValue}>{weeklyStats.workouts}</Text>
            <Text style={sharedStyles.statLabel}>Workouts</Text>
          </View>
          <View style={sharedStyles.statCard}>
            <Flame size={20} color={colors.error} />
            <Text style={sharedStyles.statValue}>{weeklyStats.calories}</Text>
            <Text style={sharedStyles.statLabel}>Calories</Text>
          </View>
          <View style={sharedStyles.statCard}>
            <Clock size={20} color={colors.info} />
            <Text style={sharedStyles.statValue}>{weeklyStats.minutes}</Text>
            <Text style={sharedStyles.statLabel}>Minutes</Text>
          </View>
        </View>
      </View>

      {/* Quick Workouts */}
      <View style={sharedStyles.section}>
        <Text style={sharedStyles.sectionTitle}>Quick Workouts</Text>
        {quickWorkouts.map(renderWorkout)}
      </View>

      {/* Fitness Categories */}
      <View style={sharedStyles.section}>
        <Text style={sharedStyles.sectionTitle}>Fitness Categories</Text>
        {fitnessOptions.map(renderOption)}
      </View>
    </CategoryScreenLayout>
  );
}