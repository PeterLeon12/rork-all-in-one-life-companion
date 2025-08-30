import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { 
  Dumbbell,
  Heart,
  Target,
  TrendingUp,
  MessageCircle,
  ArrowRight,
  Play,
  Clock,
  Flame,
  Award,
  CheckCircle
} from 'lucide-react-native';
import { router, Stack } from 'expo-router';
import { useCategories, createActivityImpact } from '@/contexts/CategoryContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FitnessOption {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  route?: string;
}

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
    color: '#FF7675'
  },
  {
    id: 'cardio',
    title: 'Cardio & Endurance',
    description: 'Improve cardiovascular health',
    icon: Heart,
    color: '#FF6B6B'
  },
  {
    id: 'sports',
    title: 'Sports Training',
    description: 'Sport-specific performance',
    icon: Target,
    color: '#74B9FF'
  },
  {
    id: 'progress',
    title: 'Track Progress',
    description: 'Monitor your fitness journey',
    icon: TrendingUp,
    color: '#6C5CE7'
  },
  {
    id: 'ai-coach',
    title: 'AI Fitness Coach',
    description: 'Get personalized guidance',
    icon: MessageCircle,
    color: '#FD79A8',
    route: '/fitness-chat'
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

  const saveFitnessData = async () => {
    try {
      await AsyncStorage.setItem('completedWorkouts', JSON.stringify(completedWorkouts));
      await AsyncStorage.setItem('weeklyFitnessStats', JSON.stringify(weeklyStats));
    } catch (error) {
      console.error('Error saving fitness data:', error);
    }
  };

  useEffect(() => {
    saveFitnessData();
  }, [completedWorkouts, weeklyStats]);

  const startWorkout = (workout: WorkoutSession) => {
    Alert.alert(
      `Start ${workout.name}?`,
      `Duration: ${workout.duration} min\nCalories: ~${workout.calories}\nDifficulty: ${workout.difficulty}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start Workout',
          onPress: () => {
            // Simulate workout completion
            setTimeout(() => {
              completeWorkout(workout);
            }, 2000); // Simulate 2 seconds for demo
            
            Alert.alert('Workout Started!', 'Great job! Keep pushing yourself!');
          }
        }
      ]
    );
  };

  const completeWorkout = (workout: WorkoutSession) => {
    // Mark workout as completed
    setCompletedWorkouts(prev => [...prev, workout.id]);
    
    // Update weekly stats
    setWeeklyStats(prev => ({
      workouts: prev.workouts + 1,
      calories: prev.calories + workout.calories,
      minutes: prev.minutes + workout.duration
    }));
    
    // Add activity to category system
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
    const difficultyColor = workout.difficulty === 'Beginner' ? '#27AE60' :
                           workout.difficulty === 'Advanced' ? '#E74C3C' : '#F39C12';
    
    return (
      <TouchableOpacity
        key={workout.id}
        style={[styles.workoutCard, isCompleted && styles.completedWorkoutCard]}
        onPress={() => startWorkout(workout)}
        activeOpacity={0.7}
      >
        <View style={styles.workoutHeader}>
          <View style={styles.workoutInfo}>
            <Text style={styles.workoutName}>{workout.name}</Text>
            <View style={styles.workoutMeta}>
              <View style={styles.metaItem}>
                <Clock size={14} color="#7F8C8D" />
                <Text style={styles.metaText}>{workout.duration} min</Text>
              </View>
              <View style={styles.metaItem}>
                <Flame size={14} color="#E74C3C" />
                <Text style={styles.metaText}>{workout.calories} cal</Text>
              </View>
              <View style={[styles.difficultyBadge, { backgroundColor: difficultyColor }]}>
                <Text style={styles.difficultyText}>{workout.difficulty}</Text>
              </View>
            </View>
            <Text style={styles.exercisesList}>
              {workout.exercises.slice(0, 3).join(' • ')}
              {workout.exercises.length > 3 && ' ...'}
            </Text>
          </View>
          
          <View style={styles.workoutAction}>
            {isCompleted ? (
              <View style={styles.completedIcon}>
                <CheckCircle size={24} color="#27AE60" />
              </View>
            ) : (
              <View style={[styles.playButton, { backgroundColor: workout.type === 'cardio' ? '#FF6B6B' : '#74B9FF' }]}>
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
        style={styles.optionCard}
        onPress={() => option.route && router.push(option.route as any)}
        activeOpacity={0.7}
      >
        <View style={[styles.optionIcon, { backgroundColor: option.color + '15' }]}>
          <IconComponent size={28} color={option.color} />
        </View>
        <View style={styles.optionContent}>
          <Text style={styles.optionTitle}>{option.title}</Text>
          <Text style={styles.optionDescription}>{option.description}</Text>
        </View>
        <ArrowRight size={20} color="#C7C7CC" />
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Fitness',
          headerStyle: { backgroundColor: '#FF7675' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' }
        }} 
      />
      <View style={styles.container}>
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Fitness</Text>
            <Text style={styles.subtitle}>Your personal training companion</Text>
          </View>

          {/* Weekly Stats */}
          <View style={styles.statsContainer}>
            <Text style={styles.sectionTitle}>This Week</Text>
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Award size={20} color="#FF7675" />
                <Text style={styles.statValue}>{weeklyStats.workouts}</Text>
                <Text style={styles.statLabel}>Workouts</Text>
              </View>
              <View style={styles.statCard}>
                <Flame size={20} color="#E74C3C" />
                <Text style={styles.statValue}>{weeklyStats.calories}</Text>
                <Text style={styles.statLabel}>Calories</Text>
              </View>
              <View style={styles.statCard}>
                <Clock size={20} color="#74B9FF" />
                <Text style={styles.statValue}>{weeklyStats.minutes}</Text>
                <Text style={styles.statLabel}>Minutes</Text>
              </View>
            </View>
          </View>

          {/* Quick Workouts */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Workouts</Text>
            {quickWorkouts.map(renderWorkout)}
          </View>

          <View style={styles.optionsContainer}>
            <Text style={styles.sectionTitle}>Fitness Categories</Text>
            {fitnessOptions.map(renderOption)}
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 34,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 17,
    color: '#8E8E93',
    fontWeight: '400',
  },
  optionsContainer: {
    paddingHorizontal: 20,
    gap: 1,
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    width: 58,
    height: 58,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 15,
    color: '#8E8E93',
    lineHeight: 20,
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  workoutCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  completedWorkoutCard: {
    backgroundColor: '#F0F9F0',
    borderColor: '#27AE60',
    borderWidth: 1,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workoutInfo: {
    flex: 1,
  },
  workoutName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  workoutMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    fontSize: 13,
    color: '#7F8C8D',
    marginLeft: 4,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  difficultyText: {
    fontSize: 11,
    color: 'white',
    fontWeight: '600',
  },
  exercisesList: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 18,
  },
  workoutAction: {
    marginLeft: 16,
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedIcon: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
});