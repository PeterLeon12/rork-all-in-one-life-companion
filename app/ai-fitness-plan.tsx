import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Alert, Image, Modal } from 'react-native';
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
  MessageCircle,
  X,
  Timer,
  Repeat,
  Eye
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
  imageUrl: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tips: string[];
  commonMistakes: string[];
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
          targetMuscles: ['Full Body'],
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
          difficulty: 'Easy',
          tips: ['Keep your core engaged', 'Land softly on your feet', 'Maintain steady rhythm'],
          commonMistakes: ['Landing too hard', 'Not fully extending arms', 'Going too fast']
        },
        {
          name: 'Burpees',
          sets: 3,
          reps: '10-15',
          restTime: 45,
          instructions: 'Squat, jump back to plank, push-up, jump forward, jump up',
          targetMuscles: ['Full Body'],
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
          difficulty: 'Hard',
          tips: ['Keep your core tight throughout', 'Jump explosively', 'Control the descent'],
          commonMistakes: ['Sagging hips in plank', 'Not jumping high enough', 'Poor form when tired']
        },
        {
          name: 'Mountain Climbers',
          sets: 4,
          reps: '30 seconds',
          restTime: 30,
          instructions: 'In plank position, alternate bringing knees to chest rapidly',
          targetMuscles: ['Core', 'Cardio'],
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
          difficulty: 'Medium',
          tips: ['Keep hips level', 'Drive knees toward chest', 'Maintain plank position'],
          commonMistakes: ['Raising hips too high', 'Not bringing knees far enough', 'Losing plank form']
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
          targetMuscles: ['Chest', 'Shoulders', 'Triceps'],
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
          difficulty: 'Medium',
          tips: ['Keep body in straight line', 'Lower chest to ground', 'Push through palms'],
          commonMistakes: ['Sagging hips', 'Not going low enough', 'Flaring elbows too wide']
        },
        {
          name: 'Pike Push-ups',
          sets: 3,
          reps: '6-10',
          restTime: 60,
          instructions: 'In downward dog position, lower head toward ground',
          targetMuscles: ['Shoulders', 'Triceps'],
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
          difficulty: 'Hard',
          tips: ['Keep legs straight', 'Lower head between hands', 'Push up explosively'],
          commonMistakes: ['Bending knees', 'Not lowering far enough', 'Poor hand placement']
        },
        {
          name: 'Tricep Dips',
          sets: 3,
          reps: '8-12',
          restTime: 60,
          instructions: 'Using chair or bench, lower body by bending arms',
          targetMuscles: ['Triceps', 'Shoulders'],
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
          difficulty: 'Medium',
          tips: ['Keep elbows close to body', 'Lower until 90 degrees', 'Push through palms'],
          commonMistakes: ['Flaring elbows out', 'Not going low enough', 'Using legs too much']
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
          targetMuscles: ['Spine', 'Core'],
          imageUrl: 'https://images.unsplash.com/photo-1506629905607-d9c297d3f49e?w=400&h=300&fit=crop',
          difficulty: 'Easy',
          tips: ['Move slowly and controlled', 'Breathe with movement', 'Feel stretch in spine'],
          commonMistakes: ['Moving too fast', 'Not engaging core', 'Forcing the movement']
        },
        {
          name: 'Downward Dog',
          sets: 3,
          reps: '30 seconds',
          restTime: 15,
          instructions: 'Form inverted V-shape, press heels down, lengthen spine',
          targetMuscles: ['Hamstrings', 'Calves', 'Shoulders'],
          imageUrl: 'https://images.unsplash.com/photo-1506629905607-d9c297d3f49e?w=400&h=300&fit=crop',
          difficulty: 'Medium',
          tips: ['Press through palms', 'Lengthen spine', 'Relax neck'],
          commonMistakes: ['Hunching shoulders', 'Bending knees too much', 'Not pressing heels down']
        },
        {
          name: 'Pigeon Pose',
          sets: 2,
          reps: '30 seconds each side',
          restTime: 15,
          instructions: 'Hip opener, bring one leg forward, extend other leg back',
          targetMuscles: ['Hips', 'Glutes'],
          imageUrl: 'https://images.unsplash.com/photo-1506629905607-d9c297d3f49e?w=400&h=300&fit=crop',
          difficulty: 'Medium',
          tips: ['Keep hips square', 'Breathe deeply', 'Use props if needed'],
          commonMistakes: ['Forcing the stretch', 'Uneven hips', 'Holding breath']
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
        targetMuscles: ['Core', 'Shoulders'],
        imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
        difficulty: 'Medium',
        tips: ['Keep body straight', 'Breathe normally', 'Engage core muscles'],
        commonMistakes: ['Sagging hips', 'Raising hips too high', 'Holding breath']
      },
      {
        name: 'Dead Bug',
        sets: 3,
        reps: '10 each side',
        restTime: 30,
        instructions: 'Lie on back, extend opposite arm and leg while keeping core stable',
        targetMuscles: ['Core', 'Stability'],
        imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
        difficulty: 'Easy',
        tips: ['Keep lower back pressed down', 'Move slowly', 'Opposite arm and leg'],
        commonMistakes: ['Arching back', 'Moving too fast', 'Not engaging core']
      },
      {
        name: 'Bird Dog',
        sets: 3,
        reps: '10 each side',
        restTime: 30,
        instructions: 'On hands and knees, extend opposite arm and leg',
        targetMuscles: ['Core', 'Back', 'Glutes'],
        imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
        difficulty: 'Medium',
        tips: ['Keep hips level', 'Extend fully', 'Hold briefly at top'],
        commonMistakes: ['Rotating hips', 'Not extending fully', 'Rushing the movement']
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
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showWorkoutModal, setShowWorkoutModal] = useState<boolean>(false);
  const [showExerciseModal, setShowExerciseModal] = useState<boolean>(false);

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
          <View style={styles.exercisePreview}>
            {workout.exercises.slice(0, 2).map((exercise, idx) => (
              <View key={idx} style={styles.exercisePreviewItem}>
                <Image source={{ uri: exercise.imageUrl }} style={styles.exercisePreviewImage} />
                <View style={styles.exercisePreviewInfo}>
                  <Text style={styles.exercisePreviewName}>{exercise.name}</Text>
                  <Text style={styles.exercisePreviewMeta}>{exercise.sets} sets × {exercise.reps}</Text>
                  <View style={styles.difficultyContainer}>
                    <View style={[styles.difficultyDot, { backgroundColor: exercise.difficulty === 'Easy' ? '#27AE60' : exercise.difficulty === 'Medium' ? '#F39C12' : '#E74C3C' }]} />
                    <Text style={styles.difficultyLabel}>{exercise.difficulty}</Text>
                  </View>
                </View>
              </View>
            ))}
            {workout.exercises.length > 2 && (
              <Text style={styles.moreExercises}>+{workout.exercises.length - 2} more exercises</Text>
            )}
          </View>
        </View>
        
        <View style={styles.workoutActions}>
          <TouchableOpacity 
            style={styles.viewDetailsButton}
            onPress={() => {
              setSelectedWorkout(workout);
              setShowWorkoutModal(true);
            }}
          >
            <Eye size={16} color="#7F8C8D" />
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

      {/* Workout Details Modal */}
      <Modal
        visible={showWorkoutModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowWorkoutModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{selectedWorkout?.title}</Text>
            <TouchableOpacity 
              onPress={() => setShowWorkoutModal(false)}
              style={styles.closeButton}
            >
              <X size={24} color="#7F8C8D" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {selectedWorkout && (
              <>
                <View style={styles.workoutOverview}>
                  <Text style={styles.workoutModalDescription}>{selectedWorkout.description}</Text>
                  
                  <View style={styles.workoutStats}>
                    <View style={styles.statItem}>
                      <Clock size={20} color="#FF6B6B" />
                      <Text style={styles.statItemText}>{selectedWorkout.duration} min</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Zap size={20} color="#FF6B6B" />
                      <Text style={styles.statItemText}>{selectedWorkout.caloriesBurned} cal</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Target size={20} color="#FF6B6B" />
                      <Text style={styles.statItemText}>{selectedWorkout.targetMuscles.join(', ')}</Text>
                    </View>
                  </View>
                </View>
                
                <Text style={styles.exercisesTitle}>Exercises ({selectedWorkout.exercises.length})</Text>
                
                {selectedWorkout.exercises.map((exercise, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={styles.exerciseCard}
                    onPress={() => {
                      setSelectedExercise(exercise);
                      setShowExerciseModal(true);
                    }}
                  >
                    <Image source={{ uri: exercise.imageUrl }} style={styles.exerciseImage} />
                    <View style={styles.exerciseInfo}>
                      <View style={styles.exerciseHeader}>
                        <Text style={styles.exerciseName}>{exercise.name}</Text>
                        <View style={[styles.exerciseDifficultyBadge, { backgroundColor: exercise.difficulty === 'Easy' ? '#27AE60' : exercise.difficulty === 'Medium' ? '#F39C12' : '#E74C3C' }]}>
                          <Text style={styles.exerciseDifficultyText}>{exercise.difficulty}</Text>
                        </View>
                      </View>
                      
                      <Text style={styles.exerciseInstructions}>{exercise.instructions}</Text>
                      
                      <View style={styles.exerciseMeta}>
                        <View style={styles.exerciseMetaItem}>
                          <Repeat size={16} color="#7F8C8D" />
                          <Text style={styles.exerciseMetaText}>{exercise.sets} sets × {exercise.reps}</Text>
                        </View>
                        <View style={styles.exerciseMetaItem}>
                          <Timer size={16} color="#7F8C8D" />
                          <Text style={styles.exerciseMetaText}>{exercise.restTime}s rest</Text>
                        </View>
                      </View>
                      
                      <Text style={styles.targetMuscles}>Targets: {exercise.targetMuscles.join(', ')}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
                
                <TouchableOpacity 
                  style={styles.startWorkoutButton}
                  onPress={() => {
                    setShowWorkoutModal(false);
                    startWorkout(selectedWorkout);
                  }}
                >
                  <Play size={24} color="white" />
                  <Text style={styles.startWorkoutButtonText}>Start Workout</Text>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        </View>
      </Modal>

      {/* Exercise Details Modal */}
      <Modal
        visible={showExerciseModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowExerciseModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{selectedExercise?.name}</Text>
            <TouchableOpacity 
              onPress={() => setShowExerciseModal(false)}
              style={styles.closeButton}
            >
              <X size={24} color="#7F8C8D" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {selectedExercise && (
              <>
                <Image source={{ uri: selectedExercise.imageUrl }} style={styles.exerciseDetailImage} />
                
                <View style={styles.exerciseDetailInfo}>
                  <View style={styles.exerciseDetailHeader}>
                    <View style={[styles.exerciseDifficultyBadge, { backgroundColor: selectedExercise.difficulty === 'Easy' ? '#27AE60' : selectedExercise.difficulty === 'Medium' ? '#F39C12' : '#E74C3C' }]}>
                      <Text style={styles.exerciseDifficultyText}>{selectedExercise.difficulty}</Text>
                    </View>
                    <Text style={styles.targetMusclesDetail}>Targets: {selectedExercise.targetMuscles.join(', ')}</Text>
                  </View>
                  
                  <Text style={styles.exerciseDetailInstructions}>{selectedExercise.instructions}</Text>
                  
                  <View style={styles.exerciseDetailMeta}>
                    <View style={styles.exerciseDetailMetaItem}>
                      <Repeat size={20} color="#FF6B6B" />
                      <Text style={styles.exerciseDetailMetaText}>{selectedExercise.sets} sets × {selectedExercise.reps}</Text>
                    </View>
                    <View style={styles.exerciseDetailMetaItem}>
                      <Timer size={20} color="#FF6B6B" />
                      <Text style={styles.exerciseDetailMetaText}>{selectedExercise.restTime}s rest</Text>
                    </View>
                  </View>
                  
                  <View style={styles.tipsSection}>
                    <Text style={styles.tipsSectionTitle}>💡 Pro Tips</Text>
                    {selectedExercise.tips.map((tip, index) => (
                      <Text key={index} style={styles.tipItem}>• {tip}</Text>
                    ))}
                  </View>
                  
                  <View style={styles.mistakesSection}>
                    <Text style={styles.mistakesSectionTitle}>⚠️ Common Mistakes</Text>
                    {selectedExercise.commonMistakes.map((mistake, index) => (
                      <Text key={index} style={styles.mistakeItem}>• {mistake}</Text>
                    ))}
                  </View>
                </View>
              </>
            )}
          </ScrollView>
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
    marginLeft: 6,
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
  exercisePreview: {
    marginTop: 8,
  },
  exercisePreviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 8,
  },
  exercisePreviewImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  exercisePreviewInfo: {
    flex: 1,
  },
  exercisePreviewName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 2,
  },
  exercisePreviewMeta: {
    fontSize: 12,
    color: '#7F8C8D',
    marginBottom: 4,
  },
  difficultyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  difficultyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  difficultyLabel: {
    fontSize: 10,
    color: '#7F8C8D',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  workoutOverview: {
    marginBottom: 24,
  },
  workoutModalDescription: {
    fontSize: 16,
    color: '#7F8C8D',
    marginBottom: 16,
    lineHeight: 24,
  },
  workoutStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statItemText: {
    fontSize: 12,
    color: '#2C3E50',
    marginTop: 4,
    textAlign: 'center',
  },
  exercisesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 16,
  },
  exerciseCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  exerciseImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    flex: 1,
    marginRight: 8,
  },
  exerciseDifficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  exerciseDifficultyText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  exerciseInstructions: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 12,
    lineHeight: 20,
  },
  exerciseMeta: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  exerciseMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  exerciseMetaText: {
    fontSize: 12,
    color: '#7F8C8D',
    marginLeft: 4,
  },
  targetMuscles: {
    fontSize: 12,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  startWorkoutButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  startWorkoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  exerciseDetailImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
  },
  exerciseDetailInfo: {
    flex: 1,
  },
  exerciseDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  targetMusclesDetail: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  exerciseDetailInstructions: {
    fontSize: 16,
    color: '#2C3E50',
    lineHeight: 24,
    marginBottom: 20,
  },
  exerciseDetailMeta: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  exerciseDetailMetaItem: {
    alignItems: 'center',
    flex: 1,
  },
  exerciseDetailMetaText: {
    fontSize: 14,
    color: '#2C3E50',
    marginTop: 4,
    textAlign: 'center',
    fontWeight: '600',
  },
  tipsSection: {
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  tipsSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27AE60',
    marginBottom: 12,
  },
  tipItem: {
    fontSize: 14,
    color: '#2C3E50',
    marginBottom: 6,
    lineHeight: 20,
  },
  mistakesSection: {
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  mistakesSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F39C12',
    marginBottom: 12,
  },
  mistakeItem: {
    fontSize: 14,
    color: '#2C3E50',
    marginBottom: 6,
    lineHeight: 20,
  },
});