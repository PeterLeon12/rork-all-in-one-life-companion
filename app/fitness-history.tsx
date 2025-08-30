import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown,
  Target,
  Award,
  ChevronLeft,
  ChevronRight,
  User,
  Heart
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface DailyStats {
  date: string;
  steps: number;
  calories: number;
  distance: number;
  activeMinutes: number;
  heartRate?: number;
  weight?: number;
  sleep?: number;
}

interface WeeklyGoal {
  type: 'steps' | 'calories' | 'distance' | 'activeMinutes';
  target: number;
  current: number;
  unit: string;
  color: string;
}

const generateMockHistory = (): DailyStats[] => {
  const history: DailyStats[] = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const baseSteps = 8000 + Math.random() * 4000;
    const steps = Math.floor(baseSteps);
    const calories = Math.floor(steps * 0.04 + Math.random() * 100);
    const distance = parseFloat((steps * 0.0008).toFixed(2));
    const activeMinutes = Math.floor(steps / 150 + Math.random() * 30);
    
    history.push({
      date: date.toISOString().split('T')[0],
      steps,
      calories,
      distance,
      activeMinutes,
      heartRate: Math.floor(60 + Math.random() * 40),
      weight: 70 + Math.random() * 10,
      sleep: 6 + Math.random() * 3
    });
  }
  
  return history;
};

export default function FitnessHistoryScreen() {
  const [historyData, setHistoryData] = useState<DailyStats[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week');
  const [currentWeekOffset, setCurrentWeekOffset] = useState<number>(0);
  const [weeklyGoals, setWeeklyGoals] = useState<WeeklyGoal[]>([
    { type: 'steps', target: 70000, current: 0, unit: 'steps', color: '#FF6B6B' },
    { type: 'calories', target: 2100, current: 0, unit: 'cal', color: '#4ECDC4' },
    { type: 'distance', target: 50, current: 0, unit: 'km', color: '#FFD93D' },
    { type: 'activeMinutes', target: 150, current: 0, unit: 'min', color: '#6C5CE7' }
  ]);

  useEffect(() => {
    loadHistoryData();
  }, []);

  useEffect(() => {
    calculateWeeklyProgress();
  }, [historyData, currentWeekOffset]);

  const loadHistoryData = async () => {
    try {
      const saved = await AsyncStorage.getItem('fitnessHistory');
      if (saved) {
        setHistoryData(JSON.parse(saved));
      } else {
        const mockData = generateMockHistory();
        setHistoryData(mockData);
        await AsyncStorage.setItem('fitnessHistory', JSON.stringify(mockData));
      }
    } catch (error) {
      console.error('Error loading history:', error);
      setHistoryData(generateMockHistory());
    }
  };

  const calculateWeeklyProgress = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() - (currentWeekOffset * 7));
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const weekData = historyData.filter(day => {
      const dayDate = new Date(day.date);
      return dayDate >= startOfWeek && dayDate <= endOfWeek;
    });

    const totals = weekData.reduce((acc, day) => ({
      steps: acc.steps + day.steps,
      calories: acc.calories + day.calories,
      distance: acc.distance + day.distance,
      activeMinutes: acc.activeMinutes + day.activeMinutes
    }), { steps: 0, calories: 0, distance: 0, activeMinutes: 0 });

    setWeeklyGoals(prev => prev.map(goal => ({
      ...goal,
      current: totals[goal.type]
    })));
  };

  const getDisplayData = () => {
    if (selectedPeriod === 'week') {
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay() - (currentWeekOffset * 7));
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      return historyData.filter(day => {
        const dayDate = new Date(day.date);
        return dayDate >= startOfWeek && dayDate <= endOfWeek;
      }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }
    return historyData.slice(-30);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getWeekRange = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() - (currentWeekOffset * 7));
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  };

  const calculateTrend = (data: DailyStats[], key: keyof DailyStats) => {
    if (data.length < 2) return 0;
    const recent = data.slice(-7).reduce((sum, day) => sum + (day[key] as number), 0) / 7;
    const previous = data.slice(-14, -7).reduce((sum, day) => sum + (day[key] as number), 0) / 7;
    return ((recent - previous) / previous) * 100;
  };

  const displayData = getDisplayData();
  const stepsTrend = calculateTrend(historyData, 'steps');
  const caloriesTrend = calculateTrend(historyData, 'calories');

  const renderDayCard = (day: DailyStats, index: number) => {
    const isToday = day.date === new Date().toISOString().split('T')[0];
    const maxSteps = Math.max(...displayData.map(d => d.steps));
    const stepProgress = (day.steps / maxSteps) * 100;

    return (
      <TouchableOpacity key={index} style={[styles.dayCard, isToday && styles.todayCard]}>
        <Text style={[styles.dayDate, isToday && styles.todayText]}>
          {formatDate(day.date)}
        </Text>
        
        <View style={styles.dayStats}>
          <View style={styles.statItem}>
            <Activity size={16} color={isToday ? '#FF6B6B' : '#7F8C8D'} />
            <Text style={[styles.statValue, isToday && styles.todayText]}>
              {day.steps.toLocaleString()}
            </Text>
            <Text style={styles.statLabel}>steps</Text>
          </View>
          
          <View style={styles.statItem}>
            <Target size={16} color={isToday ? '#4ECDC4' : '#7F8C8D'} />
            <Text style={[styles.statValue, isToday && styles.todayText]}>
              {day.calories}
            </Text>
            <Text style={styles.statLabel}>cal</Text>
          </View>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${stepProgress}%`, backgroundColor: isToday ? '#FF6B6B' : '#E9ECEF' }
              ]} 
            />
          </View>
        </View>
        
        <Text style={[styles.distanceText, isToday && styles.todayText]}>
          {day.distance} km • {day.activeMinutes} min
        </Text>
      </TouchableOpacity>
    );
  };

  const renderWeeklyGoal = (goal: WeeklyGoal, index: number) => {
    const progress = Math.min((goal.current / goal.target) * 100, 100);
    const isCompleted = goal.current >= goal.target;

    return (
      <View key={index} style={styles.goalCard}>
        <View style={styles.goalHeader}>
          <View style={[styles.goalIcon, { backgroundColor: goal.color + '20' }]}>
            <Activity size={20} color={goal.color} />
          </View>
          <View style={styles.goalInfo}>
            <Text style={styles.goalTitle}>
              {goal.type.charAt(0).toUpperCase() + goal.type.slice(1)}
            </Text>
            <Text style={styles.goalProgress}>
              {goal.current.toLocaleString()} / {goal.target.toLocaleString()} {goal.unit}
            </Text>
          </View>
          {isCompleted && (
            <Award size={24} color={goal.color} />
          )}
        </View>
        
        <View style={styles.goalProgressBar}>
          <View 
            style={[
              styles.goalProgressFill, 
              { width: `${progress}%`, backgroundColor: goal.color }
            ]} 
          />
        </View>
        
        <Text style={[styles.goalPercentage, { color: goal.color }]}>
          {Math.round(progress)}% complete
        </Text>
      </View>
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: "Fitness History",
          headerStyle: { backgroundColor: '#FF6B6B' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' },
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => router.push('/profile-setup')}
              style={styles.headerButton}
            >
              <User size={24} color="white" />
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
              
              {/* Period Selector */}
              <View style={styles.periodSelector}>
                <TouchableOpacity 
                  style={[styles.periodButton, selectedPeriod === 'week' && styles.activePeriodButton]}
                  onPress={() => setSelectedPeriod('week')}
                >
                  <Text style={[styles.periodButtonText, selectedPeriod === 'week' && styles.activePeriodText]}>
                    Week
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.periodButton, selectedPeriod === 'month' && styles.activePeriodButton]}
                  onPress={() => setSelectedPeriod('month')}
                >
                  <Text style={[styles.periodButtonText, selectedPeriod === 'month' && styles.activePeriodText]}>
                    Month
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Week Navigation */}
              {selectedPeriod === 'week' && (
                <View style={styles.weekNavigation}>
                  <TouchableOpacity 
                    style={styles.navButton}
                    onPress={() => setCurrentWeekOffset(prev => prev + 1)}
                  >
                    <ChevronLeft size={24} color="#2C3E50" />
                  </TouchableOpacity>
                  
                  <Text style={styles.weekRange}>{getWeekRange()}</Text>
                  
                  <TouchableOpacity 
                    style={[styles.navButton, currentWeekOffset === 0 && styles.disabledButton]}
                    onPress={() => setCurrentWeekOffset(prev => Math.max(0, prev - 1))}
                    disabled={currentWeekOffset === 0}
                  >
                    <ChevronRight size={24} color={currentWeekOffset === 0 ? '#BDC3C7' : '#2C3E50'} />
                  </TouchableOpacity>
                </View>
              )}

              {/* Weekly Goals */}
              {selectedPeriod === 'week' && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Weekly Goals</Text>
                  {weeklyGoals.map(renderWeeklyGoal)}
                </View>
              )}

              {/* Trends Summary */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Trends</Text>
                <View style={styles.trendsContainer}>
                  <View style={styles.trendCard}>
                    <View style={styles.trendHeader}>
                      <Activity size={20} color="#FF6B6B" />
                      <Text style={styles.trendTitle}>Steps</Text>
                    </View>
                    <View style={styles.trendValue}>
                      {stepsTrend > 0 ? (
                        <TrendingUp size={16} color="#27AE60" />
                      ) : (
                        <TrendingDown size={16} color="#E74C3C" />
                      )}
                      <Text style={[styles.trendPercentage, { color: stepsTrend > 0 ? '#27AE60' : '#E74C3C' }]}>
                        {Math.abs(stepsTrend).toFixed(1)}%
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.trendCard}>
                    <View style={styles.trendHeader}>
                      <Target size={20} color="#4ECDC4" />
                      <Text style={styles.trendTitle}>Calories</Text>
                    </View>
                    <View style={styles.trendValue}>
                      {caloriesTrend > 0 ? (
                        <TrendingUp size={16} color="#27AE60" />
                      ) : (
                        <TrendingDown size={16} color="#E74C3C" />
                      )}
                      <Text style={[styles.trendPercentage, { color: caloriesTrend > 0 ? '#27AE60' : '#E74C3C' }]}>
                        {Math.abs(caloriesTrend).toFixed(1)}%
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Daily History */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  {selectedPeriod === 'week' ? 'This Week' : 'Last 30 Days'}
                </Text>
                <View style={styles.historyContainer}>
                  {displayData.map(renderDayCard)}
                </View>
              </View>

              {/* Quick Actions */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.quickActions}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => router.push('/profile-setup')}
                  >
                    <User size={24} color="white" />
                    <Text style={styles.actionButtonText}>Update Profile</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.actionButton, { backgroundColor: '#4ECDC4' }]}
                    onPress={() => router.push('/health')}
                  >
                    <Heart size={24} color="white" />
                    <Text style={styles.actionButtonText}>Health Tips</Text>
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
  headerButton: {
    padding: 8,
  },
  periodSelector: {
    flexDirection: 'row',
    margin: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activePeriodButton: {
    backgroundColor: '#FF6B6B',
  },
  periodButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7F8C8D',
  },
  activePeriodText: {
    color: 'white',
  },
  weekNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  navButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  disabledButton: {
    opacity: 0.5,
  },
  weekRange: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
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
  goalCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginHorizontal: 24,
    marginBottom: 12,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 2,
  },
  goalProgress: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  goalProgressBar: {
    height: 6,
    backgroundColor: '#E9ECEF',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  goalProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  goalPercentage: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'right',
  },
  trendsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  trendCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 16,
    flex: 0.48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  trendHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  trendTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginLeft: 8,
  },
  trendValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  historyContainer: {
    paddingHorizontal: 24,
  },
  dayCard: {
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
  todayCard: {
    borderColor: '#FF6B6B',
    borderWidth: 2,
  },
  dayDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7F8C8D',
    marginBottom: 8,
  },
  todayText: {
    color: '#FF6B6B',
  },
  dayStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 2,
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E9ECEF',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  distanceText: {
    fontSize: 12,
    color: '#7F8C8D',
    textAlign: 'center',
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