import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  Brain, 
  Target,
  Calendar,
  Clock,
  Activity,
  Zap,
  Award,
  RefreshCw,
  Play,
  CheckCircle,
  User,
  MessageCircle
} from 'lucide-react-native';

interface UserProfile {
  name: string;
  age: number;
  height: number;
  weight: number;
  gender: 'male' | 'female' | 'other';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  fitnessGoals: string[];
  preferredWorkoutTime: 'morning' | 'afternoon' | 'evening';
  workoutDuration: number;
}

interface WorkoutPlan {
  id: string;
  title: string;
  description: string;
  duration: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  exercises: Exercise[];
  targetMuscles: string[];
  caloriesBurned: number;
  equipment: string[];
}

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  duration?: number;
  restTime: number;
  instructions: string;
  targetMuscles: string[];
}

interface NutritionPlan {
  dailyCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  meals: {
    breakfast: string[];
    lunch: string[];
    dinner: string[];
    snacks: string[];
  };
}

const generateAIFitnessPlan = (profile: UserProfile): { workouts: WorkoutPlan[], nutrition: NutritionPlan, recommendations: string[] } => {
  const bmr = profile.gender === 'male' 
    ? 88.362 + (13.397 * profile.weight) + (4.799 * profile.height) - (5.677 * profile.age)
    : 447.593 + (9.247 * profile.weight) + (3.098 * profile.height) - (4.330 * profile.age);

  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  };

  const dailyCalories = Math.round(bmr * activityMultipliers[profile.activityLevel]);
  
  const workouts: WorkoutPlan[] = [];
  
  // Generate workouts based on goals
  if (profile.fitnessGoals.includes('Weight Loss')) {
    workouts.push({
      id: 'cardio-hiit',
      title: 'HIIT Cardio Blast',
      description: 'High-intensity interval training for maximum calorie burn',
      duration: profile.workoutDuration,
      difficulty: profile.activityLevel === 'sedentary' ? 'Beginner' : 'Intermediate',
      exercises: [
        {
          name: 'Jumping Jacks',
          sets: 4,
          reps: '30 seconds',
          restTime: 30,
          instructions: 'Jump while spreading legs and raising arms overhead',
          targetMuscles: ['Full Body']
        },
        {
          name: 'Burpees',
          sets: 3,
          reps: '10-15',
          restTime: 45,
          instructions: 'Squat, jump back to plank, push-up, jump forward, jump up',
          targetMuscles: ['Full Body']
        },
        {
          name: 'Mountain Climbers',
          sets: 4,
          reps: '30 seconds',
          restTime: 30,
          instructions: 'In plank position, alternate bringing knees to chest rapidly',
          targetMuscles: ['Core', 'Cardio']
        }
      ],
      targetMuscles: ['Full Body', 'Cardio'],
      caloriesBurned: Math.round(profile.workoutDuration * 8),
      equipment: ['None']
    });
  }

  if (profile.fitnessGoals.includes('Muscle Gain') || profile.fitnessGoals.includes('Strength')) {
    workouts.push({
      id: 'strength-upper',
      title: 'Upper Body Strength',
      description: 'Build muscle and strength in your upper body',
      duration: profile.workoutDuration,
      difficulty: profile.activityLevel === 'sedentary' ? 'Beginner' : 'Intermediate',
      exercises: [
        {
          name: 'Push-ups',
          sets: 3,
          reps: '8-12',
          restTime: 60,
          instructions: 'Keep body straight, lower chest to ground, push back up',
          targetMuscles: ['Chest', 'Shoulders', 'Triceps']
        },
        {
          name: 'Pike Push-ups',
          sets: 3,
          reps: '6-10',
          restTime: 60,
          instructions: 'In downward dog position, lower head toward ground',
          targetMuscles: ['Shoulders', 'Triceps']
        },
        {
          name: 'Tricep Dips',
          sets: 3,
          reps: '8-12',
          restTime: 60,
          instructions: 'Using chair or bench, lower body by bending arms',
          targetMuscles: ['Triceps', 'Shoulders']
        }
      ],
      targetMuscles: ['Chest', 'Shoulders', 'Triceps'],
      caloriesBurned: Math.round(profile.workoutDuration * 5),
      equipment: ['Chair or Bench']
    });
  }

  if (profile.fitnessGoals.includes('Flexibility')) {
    workouts.push({
      id: 'flexibility-yoga',
      title: 'Flexibility & Mobility',
      description: 'Improve flexibility and reduce muscle tension',
      duration: profile.workoutDuration,
      difficulty: 'Beginner',
      exercises: [
        {
          name: 'Cat-Cow Stretch',
          sets: 1,
          reps: '10-15',
          restTime: 0,
          instructions: 'On hands and knees, alternate arching and rounding spine',
          targetMuscles: ['Spine', 'Core']
        },
        {
          name: 'Downward Dog',
          sets: 3,
          reps: '30 seconds',
          restTime: 15,
          instructions: 'Form inverted V-shape, press heels down, lengthen spine',
          targetMuscles: ['Hamstrings', 'Calves', 'Shoulders']
        },
        {
          name: 'Pigeon Pose',
          sets: 2,
          reps: '30 seconds each side',
          restTime: 15,
          instructions: 'Hip opener, bring one leg forward, extend other leg back',
          targetMuscles: ['Hips', 'Glutes']
        }
      ],
      targetMuscles: ['Full Body', 'Flexibility'],
      caloriesBurned: Math.round(profile.workoutDuration * 3),
      equipment: ['Yoga Mat']
    });
  }

  // Default core workout for everyone
  workouts.push({
    id: 'core-strength',
    title: 'Core Strengthening',
    description: 'Build a strong, stable core foundation',
    duration: Math.min(profile.workoutDuration, 20),
    difficulty: profile.activityLevel === 'sedentary' ? 'Beginner' : 'Intermediate',
    exercises: [
      {
        name: 'Plank',
        sets: 3,
        reps: '30-60 seconds',
        restTime: 30,
        instructions: 'Hold straight line from head to heels, engage core',
        targetMuscles: ['Core', 'Shoulders']
      },
      {
        name: 'Dead Bug',
        sets: 3,
        reps: '10 each side',
        restTime: 30,
        instructions: 'Lie on back, extend opposite arm and leg while keeping core stable',
        targetMuscles: ['Core', 'Stability']
      },
      {
        name: 'Bird Dog',
        sets: 3,
        reps: '10 each side',
        restTime: 30,
        instructions: 'On hands and knees, extend opposite arm and leg',
        targetMuscles: ['Core', 'Back', 'Glutes']
      }
    ],
    targetMuscles: ['Core', 'Stability'],
    caloriesBurned: Math.round(20 * 4),
    equipment: ['None']
  });

  const nutrition: NutritionPlan = {
    dailyCalories,
    macros: {
      protein: Math.round(profile.weight * 1.6), // 1.6g per kg
      carbs: Math.round(dailyCalories * 0.45 / 4), // 45% of calories
      fat: Math.round(dailyCalories * 0.25 / 9) // 25% of calories
    },
    meals: {
      breakfast: [
        'Greek yogurt with berries and granola',
        'Oatmeal with banana and nuts',
        'Scrambled eggs with whole grain toast',
        'Protein smoothie with spinach and fruit'
      ],
      lunch: [
        'Grilled chicken salad with mixed vegetables',
        'Quinoa bowl with roasted vegetables',
        'Turkey and avocado wrap',
        'Lentil soup with whole grain bread'
      ],
      dinner: [
        'Baked salmon with sweet potato and broccoli',
        'Lean beef stir-fry with brown rice',
        'Grilled chicken with quinoa and asparagus',
        'Tofu curry with vegetables and brown rice'
      ],
      snacks: [
        'Apple with almond butter',
        'Greek yogurt with nuts',
        'Hummus with vegetables',
        'Protein shake'
      ]
    }
  };

  const recommendations = [
    `Based on your ${profile.activityLevel} activity level, aim for ${Math.round(dailyCalories)} calories per day`,
    `Your BMR is approximately ${Math.round(bmr)} calories - this is what your body burns at rest`,
    `Focus on ${profile.fitnessGoals.join(', ').toLowerCase()} with consistent ${profile.preferredWorkoutTime} workouts`,
    `Drink at least ${Math.round(profile.weight * 35)}ml of water daily (${Math.round(profile.weight * 35 / 250)} glasses)`,
    `Get 7-9 hours of quality sleep to support your fitness goals`,
    `Track your progress weekly and adjust intensity as you get stronger`
  ];

  return { workouts, nutrition, recommendations };
};

export default function AIFitnessPlanScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [plan, setPlan] = useState<{ workouts: WorkoutPlan[], nutrition: NutritionPlan, recommendations: string[] } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutPlan | null>(null);

  useEffect(() => {
    loadProfileAndGeneratePlan();
  }, []);

  const loadProfileAndGeneratePlan = async () => {
    try {
      const savedProfile = await AsyncStorage.getItem('userProfile');
      if (savedProfile) {
        const userProfile = JSON.parse(savedProfile);
        setProfile(userProfile);
        const generatedPlan = generateAIFitnessPlan(userProfile);
        setPlan(generatedPlan);
      } else {
        Alert.alert(
          'Profile Required',
          'Please set up your profile first to generate a personalized fitness plan.',
          [
            {
              text: 'Set Up Profile',
              onPress: () => router.replace('/profile-setup')
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      Alert.alert('Error', 'Failed to load your profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const regeneratePlan = () => {
    if (profile) {
      setIsLoading(true);
      setTimeout(() => {
        const newPlan = generateAIFitnessPlan(profile);
        setPlan(newPlan);
        setIsLoading(false);
        Alert.alert('Success', 'Your AI fitness plan has been regenerated!');
      }, 1000);
    }
  };

  const startWorkout = (workout: WorkoutPlan) => {
    Alert.alert(
      'Start Workout',
      `Ready to start "${workout.title}"? This workout will take approximately ${workout.duration} minutes.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start',
          onPress: () => {
            // Here you could navigate to a workout session screen
            Alert.alert('Workout Started!', 'Great job starting your workout! Track your progress and stay consistent.');
          }
        }
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Brain size={48} color="#FF6B6B" />
        <Text style={styles.loadingText}>Generating your AI fitness plan...</Text>
      </View>
    );
  }

  if (!profile || !plan) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Unable to load fitness plan</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadProfileAndGeneratePlan}>
          <RefreshCw size={20} color="white" />
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderWorkoutCard = (workout: WorkoutPlan, index: number) => {
    const difficultyColors = {
      Beginner: '#27AE60',
      Intermediate: '#F39C12',
      Advanced: '#E74C3C'
    };

    return (
      <View key={index} style={styles.workoutCard}>
        <View style={styles.workoutHeader}>
          <View style={styles.workoutInfo}>
            <Text style={styles.workoutTitle}>{workout.title}</Text>
            <Text style={styles.workoutDescription}>{workout.description}</Text>
            <View style={styles.workoutMeta}>
              <View style={styles.metaItem}>
                <Clock size={16} color="#7F8C8D" />
                <Text style={styles.metaText}>{workout.duration} min</Text>
              </View>
              <View style={styles.metaItem}>
                <Zap size={16} color="#7F8C8D" />
                <Text style={styles.metaText}>{workout.caloriesBurned} cal</Text>
              </View>
              <View style={[styles.difficultyBadge, { backgroundColor: difficultyColors[workout.difficulty] }]}>
                <Text style={styles.difficultyText}>{workout.difficulty}</Text>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.workoutDetails}>
          <Text style={styles.detailsTitle}>Target Muscles:</Text>
          <Text style={styles.detailsText}>{workout.targetMuscles.join(', ')}</Text>
          
          <Text style={styles.detailsTitle}>Equipment:</Text>
          <Text style={styles.detailsText}>{workout.equipment.join(', ')}</Text>
          
          <Text style={styles.detailsTitle}>Exercises ({workout.exercises.length}):</Text>
          {workout.exercises.slice(0, 3).map((exercise, idx) => (
            <Text key={idx} style={styles.exerciseItem}>
              • {exercise.name} - {exercise.sets} sets × {exercise.reps}
            </Text>
          ))}
          {workout.exercises.length > 3 && (
            <Text style={styles.moreExercises}>+{workout.exercises.length - 3} more exercises</Text>
          )}
        </View>
        
        <View style={styles.workoutActions}>
          <TouchableOpacity 
            style={styles.viewDetailsButton}
            onPress={() => setSelectedWorkout(workout)}
          >
            <Text style={styles.viewDetailsText}>View Details</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.startButton}
            onPress={() => startWorkout(workout)}
          >
            <Play size={20} color="white" />
            <Text style={styles.startButtonText}>Start</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: "AI Fitness Plan",
          headerStyle: { backgroundColor: '#FF6B6B' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' },
          headerRight: () => (
            <TouchableOpacity onPress={regeneratePlan} style={styles.headerButton}>
              <RefreshCw size={24} color="white" />
            </TouchableOpacity>
          )
        }} 
      />
      
      <View style={styles.backgroundContainer}>
        <LinearGradient
          colors={['#667eea', '#764ba2', '#f093fb', '#f5576c']}
          style={styles.backgroundGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.backgroundOverlay}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
              
              {/* Header */}
              <View style={styles.headerCard}>
                <LinearGradient
                  colors={['#FF6B6B', '#FF8E8E']}
                  style={styles.headerGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Brain size={32} color="white" />
                  <Text style={styles.headerTitle}>Your AI Fitness Plan</Text>
                  <Text style={styles.headerSubtitle}>
                    Personalized for {profile.name}
                  </Text>
                  
                  <TouchableOpacity 
                    style={styles.chatButton}
                    onPress={() => router.push('/health-chat')}
                  >
                    <MessageCircle size={20} color="white" />
                    <Text style={styles.chatButtonText}>Ask AI Coach</Text>
                  </TouchableOpacity>
                </LinearGradient>
              </View>

              {/* Quick Stats */}
              <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                  <Target size={24} color="#FF6B6B" />
                  <Text style={styles.statValue}>{plan.nutrition.dailyCalories}</Text>
                  <Text style={styles.statLabel}>Daily Calories</Text>
                </View>
                
                <View style={styles.statCard}>
                  <Activity size={24} color="#4ECDC4" />
                  <Text style={styles.statValue}>{plan.workouts.length}</Text>
                  <Text style={styles.statLabel}>Workouts</Text>
                </View>
                
                <View style={styles.statCard}>
                  <Award size={24} color="#FFD93D" />
                  <Text style={styles.statValue}>{profile.fitnessGoals.length}</Text>
                  <Text style={styles.statLabel}>Goals</Text>
                </View>
              </View>

              {/* Workouts */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recommended Workouts</Text>
                {plan.workouts.map(renderWorkoutCard)}
              </View>

              {/* Nutrition Overview */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Nutrition Plan</Text>
                <View style={styles.nutritionCard}>
                  <View style={styles.macrosContainer}>
                    <View style={styles.macroItem}>
                      <Text style={styles.macroValue}>{plan.nutrition.macros.protein}g</Text>
                      <Text style={styles.macroLabel}>Protein</Text>
                    </View>
                    <View style={styles.macroItem}>
                      <Text style={styles.macroValue}>{plan.nutrition.macros.carbs}g</Text>
                      <Text style={styles.macroLabel}>Carbs</Text>
                    </View>
                    <View style={styles.macroItem}>
                      <Text style={styles.macroValue}>{plan.nutrition.macros.fat}g</Text>
                      <Text style={styles.macroLabel}>Fat</Text>
                    </View>
                  </View>
                  
                  <Text style={styles.mealTitle}>Sample Meals:</Text>
                  <Text style={styles.mealCategory}>Breakfast:</Text>
                  <Text style={styles.mealItem}>• {plan.nutrition.meals.breakfast[0]}</Text>
                  
                  <Text style={styles.mealCategory}>Lunch:</Text>
                  <Text style={styles.mealItem}>• {plan.nutrition.meals.lunch[0]}</Text>
                  
                  <Text style={styles.mealCategory}>Dinner:</Text>
                  <Text style={styles.mealItem}>• {plan.nutrition.meals.dinner[0]}</Text>
                </View>
              </View>

              {/* AI Recommendations */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>AI Recommendations</Text>
                <View style={styles.recommendationsCard}>
                  {plan.recommendations.map((rec, index) => (
                    <View key={index} style={styles.recommendationItem}>
                      <CheckCircle size={16} color="#27AE60" />
                      <Text style={styles.recommendationText}>{rec}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Quick Actions */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.quickActions}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => router.push('/fitness-history')}
                  >
                    <Calendar size={24} color="white" />
                    <Text style={styles.actionButtonText}>View History</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.actionButton, { backgroundColor: '#4ECDC4' }]}
                    onPress={() => router.push('/profile-setup')}
                  >
                    <User size={24} color="white" />
                    <Text style={styles.actionButtonText}>Update Profile</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
            </ScrollView>
          </View>
        </LinearGradient>
      </View>
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    fontSize: 16,
    color: '#7F8C8D',
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    color: '#E74C3C',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  headerButton: {
    padding: 8,
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
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
  },
  headerSubtitle: {
    color: 'white',
    fontSize: 14,
    opacity: 0.9,
    marginTop: 4,
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 16,
  },
  chatButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 0.3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  workoutCard: {
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
  },
  workoutHeader: {
    marginBottom: 16,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  workoutDescription: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 12,
  },
  workoutMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#7F8C8D',
    marginLeft: 4,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  workoutDetails: {
    marginBottom: 16,
  },
  detailsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 8,
    marginBottom: 4,
  },
  detailsText: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 4,
  },
  exerciseItem: {
    fontSize: 13,
    color: '#7F8C8D',
    marginLeft: 8,
    marginBottom: 2,
  },
  moreExercises: {
    fontSize: 13,
    color: '#FF6B6B',
    fontWeight: '600',
    marginLeft: 8,
    marginTop: 4,
  },
  workoutActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  viewDetailsButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    marginRight: 8,
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7F8C8D',
  },
  startButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#FF6B6B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  startButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    marginLeft: 8,
  },
  nutritionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  macrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  macroItem: {
    alignItems: 'center',
  },
  macroValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  macroLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 4,
  },
  mealTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 12,
  },
  mealCategory: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B6B',
    marginTop: 8,
    marginBottom: 4,
  },
  mealItem: {
    fontSize: 14,
    color: '#7F8C8D',
    marginLeft: 8,
  },
  recommendationsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  recommendationText: {
    fontSize: 14,
    color: '#2C3E50',
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    padding: 16,
    flex: 0.48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
});