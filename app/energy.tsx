import React from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import { 
  Zap, 
  Battery, 
  Sun, 
  Moon,
  Utensils,
  Dumbbell,
  Heart,
  TrendingUp,
  Plus,
  Play,
  Award,
  Clock,
  Target
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const energyMetrics = [
  { label: 'Energy Level', value: '87%', icon: Zap, color: '#00B894', trend: '+12%' },
  { label: 'Sleep Quality', value: '8.2/10', icon: Moon, color: '#00CEC9', trend: '+0.5' },
  { label: 'Nutrition Score', value: '91%', icon: Utensils, color: '#55A3FF', trend: '+8%' },
  { label: 'Recovery Rate', value: '94%', icon: Heart, color: '#74B9FF', trend: '+15%' }
];

const dailyEnergyPattern = [
  { time: '6 AM', level: 45, activity: 'Wake up' },
  { time: '8 AM', level: 75, activity: 'Morning routine' },
  { time: '10 AM', level: 90, activity: 'Peak focus' },
  { time: '12 PM', level: 85, activity: 'Pre-lunch' },
  { time: '2 PM', level: 60, activity: 'Post-lunch dip' },
  { time: '4 PM', level: 80, activity: 'Afternoon boost' },
  { time: '6 PM', level: 70, activity: 'Evening wind-down' },
  { time: '8 PM', level: 50, activity: 'Relaxation' },
  { time: '10 PM', level: 30, activity: 'Sleep prep' }
];

const energyBoosters = [
  {
    title: 'Power Nap',
    duration: '20 min',
    benefit: 'Instant refresh',
    icon: Moon,
    color: '#00CEC9',
    description: 'Quick energy restoration'
  },
  {
    title: 'Green Smoothie',
    duration: '5 min',
    benefit: 'Natural boost',
    icon: Utensils,
    color: '#00B894',
    description: 'Nutrient-packed energy'
  },
  {
    title: 'Quick Workout',
    duration: '15 min',
    benefit: 'Endorphin rush',
    icon: Dumbbell,
    color: '#55A3FF',
    description: 'Activate your body'
  },
  {
    title: 'Breathing Exercise',
    duration: '10 min',
    benefit: 'Oxygen boost',
    icon: Heart,
    color: '#74B9FF',
    description: 'Mindful energy reset'
  }
];

const nutritionPlan = [
  {
    meal: 'Breakfast',
    time: '7:00 AM',
    foods: ['Oatmeal with berries', 'Green tea', 'Almonds'],
    energyRating: 9,
    completed: true
  },
  {
    meal: 'Mid-Morning',
    time: '10:00 AM',
    foods: ['Apple with peanut butter'],
    energyRating: 7,
    completed: true
  },
  {
    meal: 'Lunch',
    time: '12:30 PM',
    foods: ['Quinoa salad', 'Grilled chicken', 'Avocado'],
    energyRating: 9,
    completed: false
  },
  {
    meal: 'Afternoon',
    time: '3:00 PM',
    foods: ['Greek yogurt', 'Berries'],
    energyRating: 8,
    completed: false
  },
  {
    meal: 'Dinner',
    time: '6:30 PM',
    foods: ['Salmon', 'Sweet potato', 'Broccoli'],
    energyRating: 9,
    completed: false
  }
];

const recoveryActivities = [
  { activity: 'Stretching', duration: '15 min', completed: true, benefit: 'Muscle recovery' },
  { activity: 'Hydration', target: '8 glasses', current: '6 glasses', benefit: 'Cell function' },
  { activity: 'Deep sleep', target: '8 hours', current: '7.5 hours', benefit: 'Full restoration' },
  { activity: 'Meditation', duration: '10 min', completed: false, benefit: 'Mental reset' }
];

export default function EnergyScreen() {
  const renderMetricCard = (metric: any, index: number) => {
    const IconComponent = metric.icon;
    
    return (
      <View key={index} style={styles.metricCard}>
        <View style={[styles.metricIcon, { backgroundColor: metric.color + '20' }]}>
          <IconComponent size={20} color={metric.color} />
        </View>
        <Text style={styles.metricValue}>{metric.value}</Text>
        <Text style={styles.metricLabel}>{metric.label}</Text>
        <Text style={styles.metricTrend}>{metric.trend} this week</Text>
      </View>
    );
  };

  const renderEnergyBooster = (booster: any, index: number) => {
    const IconComponent = booster.icon;
    
    return (
      <TouchableOpacity key={index} style={styles.boosterCard} activeOpacity={0.8}>
        <LinearGradient
          colors={[booster.color, booster.color + 'CC']}
          style={styles.boosterGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.boosterHeader}>
            <IconComponent size={24} color="white" />
            <Text style={styles.boosterDuration}>{booster.duration}</Text>
          </View>
          <Text style={styles.boosterTitle}>{booster.title}</Text>
          <Text style={styles.boosterDescription}>{booster.description}</Text>
          <View style={styles.boosterFooter}>
            <Text style={styles.boosterBenefit}>{booster.benefit}</Text>
            <View style={styles.playButton}>
              <Play size={16} color="white" fill="white" />
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const renderNutritionMeal = (meal: any, index: number) => {
    return (
      <View key={index} style={[styles.mealCard, meal.completed && styles.completedMeal]}>
        <View style={styles.mealHeader}>
          <View style={styles.mealInfo}>
            <Text style={styles.mealName}>{meal.meal}</Text>
            <Text style={styles.mealTime}>{meal.time}</Text>
          </View>
          <View style={styles.energyRating}>
            <Zap size={16} color="#FFD93D" />
            <Text style={styles.ratingText}>{meal.energyRating}/10</Text>
          </View>
        </View>
        
        <View style={styles.foodsList}>
          {meal.foods.map((food: string, foodIndex: number) => (
            <Text key={foodIndex} style={styles.foodItem}>• {food}</Text>
          ))}
        </View>
        
        {meal.completed && (
          <View style={styles.completedBadge}>
            <Text style={styles.completedText}>✓ Completed</Text>
          </View>
        )}
      </View>
    );
  };

  const renderRecoveryActivity = (activity: any, index: number) => {
    return (
      <View key={index} style={styles.recoveryCard}>
        <View style={styles.recoveryHeader}>
          <Text style={styles.recoveryActivity}>{activity.activity}</Text>
          {activity.completed !== undefined && (
            <View style={[styles.statusBadge, { backgroundColor: activity.completed ? '#27AE60' : '#E74C3C' }]}>
              <Text style={styles.statusText}>{activity.completed ? 'Done' : 'Pending'}</Text>
            </View>
          )}
        </View>
        
        <Text style={styles.recoveryBenefit}>{activity.benefit}</Text>
        
        {activity.duration && (
          <Text style={styles.recoveryDetail}>Duration: {activity.duration}</Text>
        )}
        
        {activity.target && (
          <Text style={styles.recoveryDetail}>
            Progress: {activity.current} / {activity.target}
          </Text>
        )}
      </View>
    );
  };

  const renderEnergyPattern = (pattern: any, index: number) => {
    const barHeight = (pattern.level / 100) * 60;
    
    return (
      <View key={index} style={styles.patternItem}>
        <View style={styles.energyBar}>
          <View 
            style={[
              styles.energyBarFill, 
              { 
                height: barHeight,
                backgroundColor: pattern.level > 70 ? '#00B894' : pattern.level > 40 ? '#FFD93D' : '#FF6B6B'
              }
            ]} 
          />
        </View>
        <Text style={styles.patternTime}>{pattern.time}</Text>
        <Text style={styles.patternActivity}>{pattern.activity}</Text>
      </View>
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: "Energy & Vitality",
          headerStyle: { backgroundColor: '#00B894' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' }
        }} 
      />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Stats */}
        <View style={styles.headerCard}>
          <LinearGradient
            colors={['#00B894', '#00CEC9']}
            style={styles.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.headerContent}>
              <Zap size={32} color="white" />
              <Text style={styles.headerTitle}>Energy Level</Text>
              <Text style={styles.headerScore}>87%</Text>
              <Text style={styles.headerSubtitle}>High vitality and great recovery</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Energy Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vitality Overview</Text>
          <View style={styles.metricsGrid}>
            {energyMetrics.map(renderMetricCard)}
          </View>
        </View>

        {/* Daily Energy Pattern */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Energy Pattern</Text>
          <View style={styles.patternCard}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.patternContainer}>
                {dailyEnergyPattern.map(renderEnergyPattern)}
              </View>
            </ScrollView>
          </View>
        </View>

        {/* Energy Boosters */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Energy Boosters</Text>
          <View style={styles.boostersGrid}>
            {energyBoosters.map(renderEnergyBooster)}
          </View>
        </View>

        {/* Nutrition Plan */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Nutrition Plan</Text>
          {nutritionPlan.map(renderNutritionMeal)}
        </View>

        {/* Recovery Activities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recovery & Restoration</Text>
          {recoveryActivities.map(renderRecoveryActivity)}
        </View>

        {/* Weekly Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Week's Energy</Text>
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <TrendingUp size={24} color="#00B894" />
              <Text style={styles.progressTitle}>Energy Optimization</Text>
            </View>
            <Text style={styles.progressText}>
              Outstanding energy management this week! Your consistent sleep schedule and nutrition plan boosted your average energy by 15%. Keep up the great work!
            </Text>
            <View style={styles.progressStats}>
              <View style={styles.progressStat}>
                <Text style={styles.progressStatValue}>+15%</Text>
                <Text style={styles.progressStatLabel}>Energy Boost</Text>
              </View>
              <View style={styles.progressStat}>
                <Text style={styles.progressStatValue}>8.2h</Text>
                <Text style={styles.progressStatLabel}>Avg Sleep</Text>
              </View>
              <View style={styles.progressStat}>
                <Text style={styles.progressStatValue}>91%</Text>
                <Text style={styles.progressStatLabel}>Nutrition Score</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  metricCard: {
    backgroundColor: 'white',
    width: (width - 60) / 2,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  metricIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 4,
  },
  metricTrend: {
    fontSize: 10,
    color: '#27AE60',
    textAlign: 'center',
  },
  patternCard: {
    backgroundColor: 'white',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  patternContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 16,
  },
  patternItem: {
    alignItems: 'center',
    minWidth: 60,
  },
  energyBar: {
    width: 20,
    height: 60,
    backgroundColor: '#E9ECEF',
    borderRadius: 10,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    marginBottom: 8,
  },
  energyBarFill: {
    width: '100%',
    borderRadius: 10,
  },
  patternTime: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  patternActivity: {
    fontSize: 8,
    color: '#7F8C8D',
    textAlign: 'center',
  },
  boostersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  boosterCard: {
    width: (width - 60) / 2,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  boosterGradient: {
    padding: 16,
    height: 140,
    justifyContent: 'space-between',
  },
  boosterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  boosterDuration: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  boosterTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  boosterDescription: {
    color: 'white',
    fontSize: 12,
    opacity: 0.9,
  },
  boosterFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  boosterBenefit: {
    color: 'white',
    fontSize: 10,
    opacity: 0.8,
  },
  playButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mealCard: {
    backgroundColor: 'white',
    marginHorizontal: 24,
    marginBottom: 12,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  completedMeal: {
    borderLeftWidth: 4,
    borderLeftColor: '#27AE60',
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 2,
  },
  mealTime: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  energyRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  foodsList: {
    marginBottom: 8,
  },
  foodItem: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 2,
  },
  completedBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#27AE6020',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  completedText: {
    fontSize: 10,
    color: '#27AE60',
    fontWeight: '600',
  },
  recoveryCard: {
    backgroundColor: 'white',
    marginHorizontal: 24,
    marginBottom: 12,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  recoveryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recoveryActivity: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
  },
  recoveryBenefit: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 4,
  },
  recoveryDetail: {
    fontSize: 12,
    color: '#95A5A6',
  },
  progressCard: {
    backgroundColor: 'white',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginLeft: 12,
  },
  progressText: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 20,
    marginBottom: 20,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  progressStat: {
    alignItems: 'center',
  },
  progressStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  progressStatLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 4,
    textAlign: 'center',
  },
});