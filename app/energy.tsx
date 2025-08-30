import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router } from 'expo-router';
import { 
  Zap, 
  Battery, 
  Moon,
  Utensils,
  Dumbbell,
  Heart,
  MessageCircle
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

const energyMetrics = [
  { label: 'Energy Level', value: '87%', icon: Zap, color: '#00B894', trend: '+12%' },
  { label: 'Sleep Quality', value: '8.2h', icon: Moon, color: '#00CEC9', trend: '+0.5h' },
  { label: 'Nutrition', value: '91%', icon: Utensils, color: '#55A3FF', trend: '+8%' },
  { label: 'Recovery', value: '94%', icon: Heart, color: '#74B9FF', trend: '+15%' }
];

const dailyEnergyPattern = [
  { time: '6AM', level: 45, activity: 'Wake up' },
  { time: '9AM', level: 90, activity: 'Peak focus' },
  { time: '12PM', level: 85, activity: 'Pre-lunch' },
  { time: '3PM', level: 60, activity: 'Afternoon dip' },
  { time: '6PM', level: 80, activity: 'Evening boost' },
  { time: '9PM', level: 50, activity: 'Wind down' }
];

const energyBoosters = [
  {
    title: 'Power Nap',
    duration: '20 min',
    benefit: 'Instant refresh',
    icon: Moon,
    color: '#00CEC9'
  },
  {
    title: 'Quick Workout',
    duration: '15 min',
    benefit: 'Endorphin rush',
    icon: Dumbbell,
    color: '#55A3FF'
  },
  {
    title: 'Breathing',
    duration: '10 min',
    benefit: 'Oxygen boost',
    icon: Heart,
    color: '#74B9FF'
  },
  {
    title: 'Hydration',
    duration: '2 min',
    benefit: 'Cell function',
    icon: Battery,
    color: '#00B894'
  }
];

const todaysTasks = [
  {
    task: 'Morning hydration',
    time: '7:00 AM',
    description: '2 glasses of water',
    completed: true,
    icon: Battery,
    color: '#00B894'
  },
  {
    task: 'Nutritious breakfast',
    time: '8:00 AM',
    description: 'Protein + complex carbs',
    completed: true,
    icon: Utensils,
    color: '#55A3FF'
  },
  {
    task: 'Movement break',
    time: '2:00 PM',
    description: '10-minute walk',
    completed: false,
    icon: Dumbbell,
    color: '#74B9FF'
  },
  {
    task: 'Power nap',
    time: '3:30 PM',
    description: '20-minute rest',
    completed: false,
    icon: Moon,
    color: '#00CEC9'
  }
];

const weeklyGoals = [
  { goal: 'Sleep 8+ hours', progress: 85, target: '7 days', current: '6 days' },
  { goal: 'Daily movement', progress: 71, target: '7 days', current: '5 days' },
  { goal: 'Hydration goal', progress: 92, target: '56 glasses', current: '52 glasses' },
  { goal: 'Energy boosters', progress: 60, target: '14 sessions', current: '8 sessions' }
];

export default function EnergyScreen() {
  const [selectedBooster, setSelectedBooster] = useState<string | null>(null);

  const handleHapticFeedback = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleChatPress = async () => {
    await handleHapticFeedback();
    router.push('/energy-chat');
  };

  const renderMetricCard = (metric: any, index: number) => {
    const IconComponent = metric.icon;
    
    return (
      <View key={index} style={styles.metricCard}>
        <View style={[styles.metricIcon, { backgroundColor: metric.color + '20' }]}>
          <IconComponent size={20} color={metric.color} />
        </View>
        <Text style={styles.metricValue}>{metric.value}</Text>
        <Text style={styles.metricLabel}>{metric.label}</Text>
        <Text style={styles.metricTrend}>{metric.trend}</Text>
      </View>
    );
  };

  const renderEnergyBooster = (booster: any, index: number) => {
    const IconComponent = booster.icon;
    const isSelected = selectedBooster === booster.title;
    
    return (
      <TouchableOpacity 
        key={index} 
        style={[styles.boosterCard, isSelected && styles.boosterCardSelected]} 
        activeOpacity={0.8}
        onPress={async () => {
          await handleHapticFeedback();
          setSelectedBooster(isSelected ? null : booster.title);
        }}
      >
        <View style={[styles.boosterIcon, { backgroundColor: booster.color + '20' }]}>
          <IconComponent size={20} color={booster.color} />
        </View>
        <View style={styles.boosterContent}>
          <Text style={styles.boosterTitle}>{booster.title}</Text>
          <Text style={styles.boosterDuration}>{booster.duration}</Text>
        </View>
        <Text style={styles.boosterBenefit}>{booster.benefit}</Text>
      </TouchableOpacity>
    );
  };

  const renderTodayTask = (task: any, index: number) => {
    const IconComponent = task.icon;
    
    return (
      <TouchableOpacity 
        key={index} 
        style={[styles.taskCard, task.completed && styles.completedTask]}
        activeOpacity={0.8}
        onPress={handleHapticFeedback}
      >
        <View style={[styles.taskIcon, { backgroundColor: task.color + '20' }]}>
          <IconComponent size={16} color={task.color} />
        </View>
        <View style={styles.taskContent}>
          <Text style={styles.taskName}>{task.task}</Text>
          <Text style={styles.taskDescription}>{task.description}</Text>
        </View>
        <View style={styles.taskTime}>
          <Text style={styles.taskTimeText}>{task.time}</Text>
          {task.completed && (
            <View style={styles.completedBadge}>
              <Text style={styles.completedText}>✓</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderWeeklyGoal = (goal: any, index: number) => {
    return (
      <View key={index} style={styles.goalCard}>
        <View style={styles.goalHeader}>
          <Text style={styles.goalName}>{goal.goal}</Text>
          <Text style={styles.goalProgress}>{goal.progress}%</Text>
        </View>

        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressBarFill, 
              { 
                width: `${goal.progress}%`,
                backgroundColor: goal.progress >= 80 ? '#00B894' : goal.progress >= 60 ? '#FFD93D' : '#FF6B6B'
              }
            ]} 
          />
        </View>

        <Text style={styles.goalDetail}>
          {goal.current} / {goal.target}
        </Text>
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
              <Text style={styles.headerSubtitle}>High vitality today</Text>
            </View>

            <TouchableOpacity 
              style={styles.chatButton}
              onPress={handleChatPress}
              activeOpacity={0.8}
            >
              <MessageCircle size={20} color="white" />
              <Text style={styles.chatButtonText}>Energy Coach</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Energy Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today&apos;s Vitals</Text>
          <View style={styles.metricsGrid}>
            {energyMetrics.map(renderMetricCard)}
          </View>
        </View>

        {/* Daily Energy Pattern */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Energy Pattern</Text>
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
          <Text style={styles.sectionTitle}>Quick Boosters</Text>
          <View style={styles.boostersList}>
            {energyBoosters.map(renderEnergyBooster)}
          </View>
        </View>

        {/* Today's Tasks */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today&apos;s Energy Tasks</Text>
          {todaysTasks.map(renderTodayTask)}
        </View>

        {/* Weekly Goals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Week&apos;s Goals</Text>
          {weeklyGoals.map(renderWeeklyGoal)}
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
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 16,
  },
  chatButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
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
    fontWeight: '600',
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
  boostersList: {
    paddingHorizontal: 24,
  },
  boosterCard: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  boosterCardSelected: {
    borderWidth: 2,
    borderColor: '#00B894',
  },
  boosterIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  boosterContent: {
    flex: 1,
  },
  boosterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 2,
  },
  boosterDuration: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  boosterBenefit: {
    fontSize: 12,
    color: '#00B894',
    fontWeight: '600',
  },
  taskCard: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
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
  completedTask: {
    opacity: 0.7,
    borderLeftWidth: 4,
    borderLeftColor: '#27AE60',
  },
  taskIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  taskContent: {
    flex: 1,
  },
  taskName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 2,
  },
  taskDescription: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  taskTime: {
    alignItems: 'flex-end',
  },
  taskTimeText: {
    fontSize: 12,
    color: '#7F8C8D',
    marginBottom: 4,
  },
  completedBadge: {
    backgroundColor: '#27AE60',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedText: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  goalCard: {
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
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  goalProgress: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00B894',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E9ECEF',
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  goalDetail: {
    fontSize: 12,
    color: '#7F8C8D',
  },
});